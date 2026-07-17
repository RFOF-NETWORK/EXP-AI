// ==========================================
// INTERNE NEURONEN-SPEICHERUNG & GEWICHTUNG
// ==========================================
const STORAGE_KEY = 'exp_ai_neurons';
const GLOBAL_ENDPOINT = "https://vercel.app";

// Statische Neuronen-Muster (interne Gewichtung v1.0.0 eingebettet)
const staticBrain = [
    { inputs: ["hallo", "hi", "hey", "moin"], outputs: ["Verbindung stabil. EXP-AI Knoten aktiv.", "Hallo! Der statistische Kern läuft."], neuronWeights: [0.9, 0.1, 0.2] },
    { inputs: ["status", "online", "wie gehts"], outputs: ["Lokales Neuronennetz: 100% Funktionalität."], neuronWeights: [0.9, 0.9, 0.2] },
    { inputs: ["wer bist du", "was bist du", "name"], outputs: ["Ich bin EXP-AI, eine Terminal-KI im RFOF-NETWORK."], neuronWeights: [0.5, 0.5, 0.5] }
];

const inputField = document.getElementById('input');
const outputDiv = document.getElementById('output');

inputField.addEventListener('keydown', async function(e) {
    if (e.key === 'Enter') {
        const text = inputField.value.trim();
        if (text === '') return;

        printLine(`rfof-ai@network:~$ ${text}`, 'user');
        inputField.value = '';

        // LERN-MODUS ABFANGEN
        if (text.toLowerCase().startsWith('lernen ')) {
            handleLocalLearning(text);
            return;
        }

        printLine("[Routing]: Signalprüfung läuft...", "system");
        
        // Schritt A: Prüfe lokales statistisches Netz
        let localMatch = getLocalResponse(text);
        if (localMatch) {
            // Ausgabe der reinen internen Neuronen-Versionierung
            printLine(`[Neuron-Aktivierung: [${localMatch.weights.join(', ')}]]`, "system");
            printLine(`EXP-AI: ${localMatch.reply}`, "ai");
            return;
        }

        // Schritt B: Sende an globalen Endpunkt, wenn lokales Netz kein Muster hat
        printLine("[Routing]: Kein lokales Muster. Sende an globalen Endpunkt...", "system");
        
        let aiReply = await fetchGlobalAI(text);

        if (aiReply) {
            // Globale Antworten generieren ein neues virtuelles Neuronengewicht
            printLine(`[Neuron-Aktivierung (Global): [0.7, 0.3, 0.9]]`, "system");
            printLine(`EXP-AI: ${aiReply}`, "ai");
        } else {
            // Fehlaktivierungs-Gewicht
            printLine("[Neuron-Fehlaktivierung: [0.1, 0, 0.8]]", "system");
            printLine("EXP-AI: Signal unklar. Nutzen Sie 'hilfe' oder bringen Sie mir den Satz mit 'lernen' bei.", "ai");
        }
    }
});

// ==========================================
// SYSTEM-FUNKTIONEN (REIN FUNKTIONAL)
// ==========================================

function getLocalResponse(userInput) {
    const customBrain = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const activeBrain = [...staticBrain, ...customBrain];
    
    for (let entry of activeBrain) {
        for (let trigger of entry.inputs) {
            if (userInput.toLowerCase().includes(trigger)) {
                return {
                    reply: entry.outputs[Math.floor(Math.random() * entry.outputs.length)],
                    weights: entry.neuronWeights || [0.9, 0.1, 0.2]
                };
            }
        }
    }
    return null;
}

function handleLocalLearning(command) {
    const content = command.substring(7);
    const parts = content.split('=');
    
    if (parts.length < 2) {
        printLine("EXP-AI: Fehler beim Lernen. Format: lernen [Muster] = [Antwort]", "ai");
        return;
    }
    
    const trigger = parts[0].trim().toLowerCase();
    const response = parts[1].trim();

    let customBrain = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    // Neues gelerntes Muster kriegt das interne v1.0.0 Neuronengewicht mitgegeben
    customBrain.push({ inputs: [trigger], outputs: [response], neuronWeights: [0.9, 0.1, 0.2] });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customBrain));

    printLine("[System-Zustand]: Lokaler Vektor-Speicher rekonfiguriert.", "system");
    printLine(`EXP-AI: Muster '${trigger}' lokal gelernt!`, "ai");
}

async function fetchGlobalAI(userInput) {
    try {
        const response = await fetch(GLOBAL_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                prompt: `Du bist EXP-AI für das RFOF-NETWORK. Antworte kurz auf Deutsch. Frage: ${userInput}`
            })
        });

        if (!response.ok) return null;
        const data = await response.json();
        
        let outputText = "";
        if (typeof data === 'string') {
            outputText = data;
        } else if (data && data.response) {
            outputText = data.response;
        } else if (data && data.text) {
            outputText = data.text;
        } else if (data && data.result) {
            outputText = data.result;
        }

        return outputText.trim() || null;
    } catch (error) {
        return null;
    }
}

function printLine(text, type) {
    const span = document.createElement('span');
    span.className = type;
    span.textContent = text + '\n';
    outputDiv.appendChild(span);
    outputDiv.scrollTop = outputDiv.scrollHeight;
}
