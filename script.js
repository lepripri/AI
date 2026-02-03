document.addEventListener("DOMContentLoaded", () => {
    const inputChat = document.getElementById("pripriChat");
    const btnEnvoyer = document.querySelector(".input button");
    const chatContainer = document.querySelector(".chat");
    const formatSelect = document.getElementById("format");

    // --- 1. FONCTION POUR RÉCUPÉRER LA CLÉ (Firestore > LocalStorage) ---
    async function getAIKey() {
        let key = localStorage.getItem("AIKey"); // Backup local
        if (window.Pripri && Pripri.auth.currentUser) {
            try {
                const doc = await Pripri.db.collection("users").doc(Pripri.auth.currentUser.uid).get();
                if (doc.exists && doc.data().AIKey) {
                    key = doc.data().AIKey;
                }
            } catch (e) { console.error("Erreur Firestore Key:", e); }
        }
        return key;
    }

    // --- 2. GESTION DE L'HISTORIQUE (Pour la mémoire de l'IA) ---
    async function getHistory() {
        // Pour l'instant on simule l'historique, mais tu pourras le lier à ta collection Firebase
        // en filtrant par le chat sélectionné dans ton menu latéral.
        return []; 
    }

    // --- 3. APPEL À L'API GEMINI ---
    async function callGemini(prompt, history) {
        const key = await getAIKey();
        if (!key) return "⚠️ Erreur : Aucune clé AIKey trouvée. Va dans les paramètres !";

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
        
        const payload = {
            contents: [...history, { role: "user", parts: [{ text: prompt }] }]
        };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } catch (e) {
            return "❌ Erreur de connexion à Gemini. Vérifie ta clé.";
        }
    }

    // --- 4. ACTION D'ENVOI ---
    async function envoyer() {
    const message = inputChat.value.trim();
    if (!message) return;

    // --- VERIFICATION DE CONNEXION ---
    if (!window.Pripri || !Pripri.auth.currentUser) {
        // On utilise ta fonction messageAlert que tu as dans allPages/settings
        if (typeof messageAlert === "function") {
            messageAlert("Tu dois être connecté pour parler à Gemini !");
        } else {
            alert("Connexion requise.");
        }
        return; 
    }
        // Création de l'élément Message Utilisateur
        const userMsg = document.createElement("markdown");
        userMsg.innerHTML = `<content>**Moi :** ${message}</content><display></display>`;
        chatContainer.insertBefore(userMsg, document.querySelector(".inputGroup"));
        
        inputChat.value = ""; // Vider l'input
        inputChat.focus();

        // Appel IA
        const history = await getHistory();
        const reponse = await callGemini(message, history);

        // Création de l'élément Réponse IA
        const aiMsg = document.createElement("markdown");
        // Si le select est sur "non formaté", on n'utilise pas la balise <markdown> standard
        if (formatSelect.value === "non formaté") {
            aiMsg.innerHTML = `<div style="white-space: pre-wrap; font-family: monospace; padding: 10px;">**Gemini :**\n${reponse}</div>`;
        } else {
            aiMsg.innerHTML = `<content>**Gemini :** ${reponse}</content><display></display>`;
        }
        
        chatContainer.insertBefore(aiMsg, document.querySelector(".inputGroup"));
        
        // Scroll automatique vers le bas
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // --- 5. ÉVÉNEMENTS ---
    btnEnvoyer.addEventListener("click", envoyer);
    inputChat.addEventListener("keydown", (e) => {
        if (e.key === "Enter") envoyer();
    });
});
