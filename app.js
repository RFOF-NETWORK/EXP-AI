// Ein einfaches, lokal simuliertes neuronales Netz basierend auf Keyword-Gewichtungen
const aiWeights = {
    "hallo": { text: "Verbindung stabil. KI-Knoten RFOF-NETWORK aktiv.", neuron: [0.9, 0.1, 0.2] },
    "hi": { text: "Verbindung stabil. KI-Knoten RFOF-NETWORK aktiv.", neuron: [0.9, 0.1, 0.2] },
    "test": { text: "Statistischer Netzwerk-Integritätstest: Erfolgreich. 100% Signal.", neuron: [0.5, 0.5, 0.5] },
    "netzwerk": { text: "EXP-AI analysiert kontinuierlich statistische Datenströme.", neuron: [0.2, 0.8, 0.9] },
    "hilfe": { text: "Verfügbare Triggersignale: hallo, test, netzwerk, status", neuron: [0.1, 0.1, 0.1] },
    "status": { text: "Neuronen-Matrix: Online. Latenz: 0ms (Lokal). Modus: Statistik-Modell.", neuron: [0.9, 0.9, 0.2] }
};

const inputField = document.getElementById('input');
const outputDiv = document.getElementById('output');

inputField.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        const text = inputField.value.trim();
        if (text === '') return;

        // User-Eingabe im Terminal anzeigen
        printLine(`rfof-ai@network:~$ ${text}`, 'user');
        inputField.value = '';

        // KI-Verarbeitung starten
        processAI(text.toLowerCase());
    }
});

function processAI(input) {
    let found = false;
    
    // Durchsuche die Eingabe nach bekannten statistischen Mustern (Keywords)
    for (let key in aiWeights) {
        if (input.includes(key)) {
            const data = aiWeights[key];
            printLine(`[Neuron-Aktivierung: [${data.neuron.join(', ')}]]`, 'system');
            printLine(`EXP-AI: ${data.text}`, 'ai');
            found = true;
            break;
        }
    }

    // Fallback, wenn das statistische Netz kein Muster erkennt
    if (!found) {
        const fallbackWeights = [0.1, 0.0, 0.8];
        printLine(`[Neuron-Fehlaktivierung: [${fallbackWeights.join(', ')}]]`, 'system');
        printLine("EXP-AI: Signal unklar. Muster nicht im statistischen Modell vorhanden. Versuchen Sie 'hilfe'.", "ai");
    }
}

function printLine(text, type) {
    const span = document.createElement('span');
    span.className = type;
    span.textContent = text + '\n';
    outputDiv.appendChild(span);
    outputDiv.scrollTop = outputDiv.scrollHeight; // Auto-Scroll nach unten
}
