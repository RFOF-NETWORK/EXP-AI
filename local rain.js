import { CONFIG } from './config.js';

const STORAGE_KEY = 'exp_ai_langzeit';

const staticBrain = [
    { inputs: ["hallo", "hi", "hey"], outputs: ["Verbindung stabil. EXP-AI Knoten aktiv."] },
    { inputs: ["status", "online"], outputs: ["Lokales Neuronennetz: 100% Funktionalität."] }
];

export function getLocalResponse(userInput) {
    const customBrain = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const activeBrain = [...staticBrain, ...customBrain];
    
    // Einfacher Muster-Abgleich
    for (let entry of activeBrain) {
        for (let trigger of entry.inputs) {
            if (userInput.toLowerCase().includes(trigger)) {
                return entry.outputs[Math.floor(Math.random() * entry.outputs.length)];
            }
        }
    }
    return null;
}

export function saveLocalKnowledge(trigger, response) {
    let customBrain = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    customBrain.push({ inputs: [trigger], outputs: [response] });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customBrain));
}
