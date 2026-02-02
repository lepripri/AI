// /AI/script.js

// On attend que le module Firebase soit prêt
const checkPripri = setInterval(() => {
    if (window.Pripri && window.Pripri.isConnected !== undefined) {
        clearInterval(checkPripri);
        initChat();
    }
}, 100);

function initChat() {
    const input = document.querySelector('input');
    const display = document.querySelector('#chat-display'); // Crée cette div dans ton HTML

    input.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter' && input.value.trim() !== "") {
            const prompt = input.value;
            input.value = "";
            input.disabled = true; // On bloque l'input pendant que l'IA réfléchit

            // Ajout du message utilisateur à l'écran
            display.innerHTML += `<div class="user-msg">${prompt}</div>`;

            // Appel à l'IA (en utilisant la fonction qu'on va ajouter à Pripri)
            const response = await askGemini(prompt);

            // Ajout de la réponse IA
            display.innerHTML += `<div class="ai-msg">${response}</div>`;
            
            input.disabled = false;
            input.focus();
        }
    });
}

async function askGemini(text) {
    // Note : Pour un test rapide sur ton Redmi, mets ta clé ici.
    // Pour GitHub, on verra plus tard comment la sécuriser.
    const API_KEY = "TA_CLE_GEMINI"; 
    const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    try {
        const res = await fetch(URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: text }] }]
            })
        });
        const data = await res.json();
        return data.candidates[0].content.parts[0].text;
    } catch (err) {
        return "❌ Erreur : Impossible de contacter le cerveau de l'IA.";
    }
}
async function getAIResponse(prompt) {
  const user = Pripri.auth.currentUser;
  const userDoc = await getDoc(doc(Pripri.db, "users", user.uid));
  
  if (userDoc.exists() && userDoc.data().aiKey) {
    const key = userDoc.data().aiKey;
    // Appel fetch à Gemini ici avec la clé récupérée...
  } else {
    showMessage('clé IA non configurée')
  }
}
