// À ajouter dans window.Pripri pour appeler l'IA
async function askAI(prompt) {
  if (!Pripri.isConnected) return "Veuillez vous connecter d'abord.";
  
  const API_KEY = "TA_CLE_GEMINI_ICI"; // À obtenir sur Google AI Studio
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    return "Erreur de connexion avec le cerveau de l'IA.";
  }
}

// Mise à jour de l'objet global
window.Pripri.askAI = askAI;const myInput = document.querySelector('input');

myInput.addEventListener('keypress', async (e) => {
  if (e.key === 'Enter') {
    const question = myInput.value;
    myInput.value = "Réflexion en cours...";
    
    // On appelle la fonction de ton module !
    const reponse = await Pripri.askAI(question);
    
    console.log("IA dit :", reponse);
    // Ici, tu affiches la réponse dans une div
    myInput.value = ""; 
  }
});
