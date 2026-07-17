// ==========================================
// 1. STATISCHE WISSENSDATENBANK & SPEICHER (V1.0.0)
// ==========================================
const STORAGE_KEY = 'exp_ai_langzeit_v1';
// Ändern Sie diese Zeile oben in Ihrer app.js um für maximale Stabilität:
const GLOBAL_ENDPOINT = "https://huggingface.co";


const staticBrain = [
    { inputs: ["hallo", "hi", "hey", "moin"], outputs: ["Verbindung stabil. EXP-AI Knoten v1.0.0 aktiv.", "Hallo! Der statistische Kern läuft."] },
    { inputs: ["status", "online", "wie gehts"], outputs: ["Lokales Neuronennetz v1.0.0: 100% Funktionalität."] },
    { inputs: ["wer bist du", "was bist du", "name"], outputs: ["Ich bin EXP-AI, eine Terminal-KI im RFOF-NETWORK."] }
];

const inputField = document.getElementById('input');
const outputDiv = document.getElementById('output');

// Input-Event-Listener
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

        // VERARBEITUNG STARTEN
        printLine("[Routing V1.0.0]: Signalprüfung läuft...", "system");
        
        // Schritt A: Prüfe lokales Gedächtnis
        let localReply = getLocalResponse(text);
        if (localReply) {
            printLine("[Knoten V1.0.0]: Lokales statistisches Muster erkannt.", "system");
            printLine(`EXP-AI: ${localReply}`, "ai");
            return;
        }

        // Schritt B: Wenn lokal nichts existiert -> Sende an globale freie KI
        printLine("[Routing V1.0.0]: Kein lokales Muster. Sende an globalen Endpunkt...", "system");
        let aiReply = await fetchGlobalAI(text);

        if (aiReply) {
            printLine("[Knoten V1.0.0]: Globaler RPC-Knoten erfolgreich synchronisiert.", "system");
            printLine(`EXP-AI: ${aiReply}`, "ai");
        } else {
            printLine("EXP-AI: Signal unklar. Weder lokales Netz noch globaler Knoten antworten.", "ai");
        }
    }
});

// ==========================================
// 2. FUNKTIONEN (LOKAL, LERNEN & GLOBAL)
// ==========================================

// Lokaler Muster-Abgleich
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

// Lernfunktion für den Browser-Speicher des Handys
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

// Abfrage des freien globalen KI-Links
async function fetchGlobalAI(userInput) {
    try {
        const response = await fetch(GLOBAL_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                inputs: `<|system|>Du bist EXP-AI, eine hilfreiche Terminal-KI für das RFOF-NETWORK. Antworte extrem kurz auf Deutsch. (Protokoll v1.0.0)</s><|user|>${userInput}</s><|assistant|>`
            })
        });

        if (!response.ok) return null;

        const data = await response.json();
        let rawText = data?.generated_text || data[0]?.generated_text || "";
        
        if (rawText.includes("<|assistant|>")) {
            rawText = rawText.split("<|assistant|>").pop();
        }
        
        return rawText.trim() || null;
    } catch (error) {
        return null;
    }
}

// Ausgabe-Hilfsfunktion
function printLine(text, type) {
    const span = document.createElement('span');
    span.className = type;
    span.textContent = text + '\n';
    outputDiv.appendChild(span);
    outputDiv.scrollTop = outputDiv.scrollHeight;
}
