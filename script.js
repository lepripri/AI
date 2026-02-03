document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("pripriChat");
    const button = document.querySelector(".input button");
    const chatContainer = document.querySelector(".chat");

    async function envoyerMessage() {
        const texte = input.value.trim();
        if (!texte) return;

        // 1. Afficher ton message sur le site
        const userDiv = document.createElement("markdown");
        userDiv.innerHTML = `<content>**Moi :** ${texte}</content><display></display>`;
        chatContainer.insertBefore(userDiv, document.querySelector(".inputGroup"));
        
        input.value = ""; // On vide l'input

        // 2. Préparer l'historique pour Gemini (la mémoire)
        // On récupère les messages stockés dans Firebase
        const history = await getGeminiContext(); 

        // 3. Appel à l'API Gemini
        // Ici, tu utiliseras ta clé API Google
        const reponseIA = await callGeminiAPI(texte, history);

        // 4. Afficher la réponse de Gemini
        const aiDiv = document.createElement("markdown");
        aiDiv.innerHTML = `<content>**Gemini :** ${reponseIA}</content><display></display>`;
        chatContainer.insertBefore(aiDiv, document.querySelector(".inputGroup"));
        
        // 5. Sauvegarder dans Firebase
        saveToFirebase("user", texte);
        saveToFirebase("model", reponseIA);
    }

    button.addEventListener("click", envoyerMessage);
    
    // Pour envoyer avec la touche Entrée
    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") envoyerMessage();
    });
});
