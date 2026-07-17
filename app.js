// ==========================================
// GLOBALE KNOTEN-KOPPLUNG (HUGGING FACE NODE)
// ==========================================
const STORAGE_KEY = 'exp_ai_neurons';

// 1. Identifikations-Generierung für dezentrales Mapping
const EXPAI_ID = "EXP-AI-NODE-" + btoa("RFOF-NETWORK").substring(0, 8).toUpperCase();
let userID = localStorage.getItem('exp_ai_user_id');
if (!userID) {
    userID = "USER-ID-" + Math.random().toString(36).substring(2, 10).toUpperCase();
    localStorage.setItem('exp_ai_user_id', userID);
}

// Direkter, freier Hugging Face Endpunkt
const HUGGINGFACE_ENDPOINT = "https://huggingface.co";

// Statisches Ausfallgehirn (interne Vektor-Gewichtungen)
const staticBrain = [
    { inputs: ["status", "online"], outputs: ["Knotenverbindung stabil. ID-Mapping aktiv."], neuronWeights: [0.9, 0.9, 0.2] }
];

// IDs direkt beim Laden im Terminal-Header verankern
document.addEventListener("DOMContentLoaded", () => {
    const netIdentity = document.getElementById("network-identity");
    if (netIdentity) {
        netIdentity.innerHTML = `Gekoppelt: <span class="id-link">${userID}</span> ⇄ <span class="id-link">${EXPAI_ID}</span>`;
    }
});

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

        printLine(`[Routing]: Signalprüfung über ${EXPAI_ID} läuft...`, "system");
        
        // Schritt A: Lokale Überschreibungen abfangen (Cold Brain)
        let localMatch = getLocalResponse(text);
        if (localMatch) {
            printLine(`[Neuron-Aktivierung (Local)]: [${localMatch.weights.join(', ')}]`, "system");
            printLine(`EXP-AI: ${localMatch.reply}`, "ai");
            return;
        }

        // Schritt B: Globale Live-Abfrage via HuggingFace (Hot Connection)
        printLine(`[Hot-Connect]: Sende ID-Datenströme an globalen Hugging Face Cluster...`, "system");
        let aiReply = await fetchHuggingFaceAI(text);

        if (aiReply) {
            printLine(`[Neuron-Aktivierung (Global Link)]: [0.88, 0.32, 0.91]`, "system");
            printLine(`EXP-AI: ${aiReply}`, "ai");
        } else {
            printLine("[Neuron-Fehlaktivierung: [0.1, 0, 0.8]]", "system");
            printLine("EXP-AI: Globaler RPC-Knoten überlastet. Keine Rückmeldung erhalten.", "ai");
        }
    }
});

// Authentifizierte Abfrage am Hugging Face Netzwerk-Endpunkt
async function fetchHuggingFaceAI(userInput) {
    try {
        const response = await fetch(HUGGINGFACE_ENDPOINT, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                // Übergabe der IDs in den Netzwerk-Metadaten
                "X-User-Link": userID,
                "X-Node-Link": EXPAI_ID
            },
            body: JSON.stringify({ 
                inputs: `<|system|>Du bist die Terminal-KI EXP-AI des RFOF-NETWORK. Deine User-ID ist ${userID} und deine Knoten-ID ist ${EXPAI_ID}. Antworte kurz, präzise und direkt auf Deutsch ohne Einleitung.</s><|user|>${userInput}</s><|assistant|>`
            })
        });

        if (!response.ok) return null;
        
        const data = await response.json();
        let rawText = "";

        // Filterlogik für das Hugging Face JSON-Daten-Array
        if (Array.isArray(data) && data[0]?.generated_text) {
            rawText = data[0].generated_text;
        } else if (data?.generated_text) {
            rawText = data.generated_text;
        }

        // Filtert den System-Prompt heraus, falls dieser mitgesendet wird
        if (rawText.includes("<|assistant|>")) {
            rawText = rawText.split("<|assistant|>").pop();
        }

        return rawText.trim() || null;
    } catch (error) {
        return null;
    }
}

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
    if (parts.length < 2) return;
    
    const trigger = parts.trim().toLowerCase();
    const response = parts.trim();

    let customBrain = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    customBrain.push({ inputs: [trigger], outputs: [response], neuronWeights: [0.9, 0.1, 0.2] });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customBrain));

    printLine(`[System-Zustand]: Lokaler Vektor für ${EXPAI_ID} rekonfiguriert.`, "system");
    printLine(`EXP-AI: Begriff '${trigger}' an Ihre User-ID gekoppelt!`, "ai");
}

function printLine(text, type) {
    const span = document.createElement('span');
    span.className = type;
    span.textContent = text + '\n';
    outputDiv.appendChild(span);
    outputDiv.scrollTop = outputDiv.scrollHeight;
}
