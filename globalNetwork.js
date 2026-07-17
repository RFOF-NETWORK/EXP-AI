import { CONFIG } from './config.js';

export async function fetchGlobalAIResponse(userInput) {
    // Wir nutzen den ersten verfügbaren freien Community-Knoten
    const url = CONFIG.GLOBAL_ENDPOINTS[0];
    
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                inputs: `<|system|>Du bist EXP-AI, eine hilfreiche Terminal-KI für das RFOF-NETWORK. Antworte kurz, präzise und auf Deutsch.</s><|user|>${userInput}</s><|assistant|>`
            })
        });

        if (!response.ok) throw new Error("Knoten-Latenz zu hoch");

        const data = await response.json();
        
        // Filter-Logik: Extrahiere nur den reinen Antworttext der KI
        let rawText = data[0]?.generated_text || data?.generated_text || "";
        
        if (rawText.includes("<|assistant|>")) {
            rawText = rawText.split("<|assistant|>").pop();
        }
        
        return rawText.trim() || "Knoten-Filterung fehlgeschlagen. Leeres Signal.";

    } catch (error) {
        console.error("Global Node Error:", error);
        return null; // Gibt null zurück, damit automatisch auf das lokale Gehirn gewechselt wird
    }
}
