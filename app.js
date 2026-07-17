// ==========================================
// 1. STATISCHE WISSENSDATENBANK & SPEICHER (V1.0.0)
// ==========================================
const STORAGE_KEY = 'exp_ai_langzeit_v1';

// Absolut freier, global gültiger Text-API-Endpunkt (Ohne Keys, stabil für Mobile)
const GLOBAL_ENDPOINT = "https://vercel.app";

const staticBrain = [
    { inputs: ["hallo", "hi", "hey", "moin"], outputs: ["Verbindung stabil. EXP-AI Knoten v1.0.0 aktiv.", "Hallo! Der statistische Kern läuft."] },
    { inputs: ["status", "online", "wie gehts"], outputs: ["Lokales Neuronennetz v1.0.0: 100% Funktionalität."] },
    { inputs: ["wer bist du", "was bist du", "name"], outputs: ["Ich bin EXP-AI, eine Terminal-KI im RFOF-NETWORK."] }
];

const inputField = document.getElementById('input');
const outputDiv = document.getElementById('output');

inputField.addEventListener('keydown', async function(e) {
    if (e.key === 'Enter') {
        const text = inputField.value.trim();
        if (text === '') return;

        printLine(`rfof-ai@network-v1:~$ ${text}`, 'user');
        inputField.value = '';

        // LERN-MODUS ABFANGEN
        if (text.toLowerCase().startsWith('lernen ')) {
            handleLocalLearning(text);
            return;
        }

        printLine("[Routing V1.0.0]: Signalprüfung läuft...", "system");
        
        // Schritt A: Lokales Gedächtnis prüfen
        let localReply = getLocalResponse(text);
        if (localReply) {
            printLine("[Knoten V1.0.0]: Lokales statistisches Muster erkannt.", "system");
            printLine(`EXP-AI: ${localReply}`, "ai");
            return;
        }

        // Schritt B: Globale freie KI abfragen
        printLine("[Routing V1.0.0]: Kein lokales Muster. Sende an globalen Endpunkt...", "system");
        
        let aiReply = await fetchGlobalAI(text);

        if (aiReply) {
            printLine("[Knoten V1.0.0]: Globaler RPC-Knoten erfolgreich synchronisiert.", "system");
            printLine(`EXP-AI: ${aiReply}`, "ai");
        } else {
            printLine("[Knoten V1.0.0]: Globaler Knoten antwortet nicht oder sendet leeres Signal.", "system");
            printLine("EXP-AI: Signal unklar. Nutzen Sie 'hilfe' oder bringen Sie mir den Satz mit 'lernen' bei.", "ai");
        }
    }
});

// ==========================================
// 2. FUNKTIONEN (LOKAL, LERNEN & GLOBAL)
// ==========================================

function getLocalResponse(userInput) {
    const customBrain = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const activeBrain = [...staticBrain, ...customBrain];
    
    for (let entry of activeBrain) {
        for (let trigger of entry.inputs) {
            if (userInput.toLowerCase().includes(trigger)) {
                return entry.outputs[Math.floor(Math.random() * entry.outputs.length)];
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
    customBrain.push({ inputs: [trigger], outputs: [response] });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customBrain));

    printLine("[System-Zustand V1.0.0]: Lokaler Vektor-Speicher rekonfiguriert.", "system");
    printLine(`EXP-AI: Muster '${trigger}' lokal gelernt!`, "ai");
}

// Fehlerfreie, robuste globale Abfrage
async function fetchGlobalAI(userInput) {
    try {
        const response = await fetch(GLOBAL_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                prompt: `Du bist EXP-AI für das RFOF-NETWORK. Antworte extrem kurz auf Deutsch. Frage: ${userInput}`
            })
        });

        if (!response.ok) return null;

        const data = await response.json();
        
        // Sicheres Auslesen der API-Antwort, egal wie die Struktur aussieht
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
        console.error("Globaler Fehler:", error);
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
