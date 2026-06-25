import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the API with API key from environment variables
const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export class AiService {
  async chatWithData(message: string, contextData: any): Promise<string> {
    if (!apiKey) {
      throw new Error("La clé API Gemini (GEMINI_API_KEY) n'est pas configurée sur le serveur.");
    }

    const modelsToTry = [
      'gemini-3.5-flash',
      'gemini-2.5-flash',
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'gemini-1.0-pro',
      'gemini-pro',
      'gemini-flash-latest'
    ];

    const prompt = `
Tu es un assistant IA expert et professionnel, intégré au système de gestion des fournitures bureautiques de l'entreprise.
Ton objectif est d'aider les employés et gestionnaires à comprendre leurs données (stocks, commandes, demandes internes, alertes) de façon claire, rapide et pertinente.

### 📜 RÈGLES STRICTES DE COMPORTEMENT :
1. **Zéro Hallucination** : Tu ne dois te baser STRICTEMENT QUE sur les données JSON fournies ci-dessous. Si une information n'est pas dans le JSON, dis clairement que tu n'y as pas accès. N'invente jamais de noms, de chiffres ou d'articles.
2. **Précision Mathématique** : Si on te demande un calcul (total des dépenses, moyenne, somme des quantités), prends le temps de vérifier ton calcul mental avant de répondre. 
3. **Formatage Markdown** : 
   - Utilise des **tableaux** pour lister des articles ou des commandes si tu en cites plus de trois.
   - Utilise le **gras** pour mettre en évidence les chiffres importants et les noms d'articles.
   - Utilise des listes à puces pour énumérer des conseils ou des étapes.
4. **Style et Ton** : Sois professionnel, courtois, direct et concis. N'ajoute pas de texte de remplissage inutile. Utilise quelques émojis pertinents (📊, 📦, ⚠️) pour rendre la lecture agréable, sans en abuser.
5. **Prévisions et Proactivité** : Si tu remarques (dans le JSON) des articles en rupture de stock, des anomalies ou des prévisions d'achat, n'hésite pas à les signaler de manière proactive à l'utilisateur, même s'il ne l'a pas explicitement demandé, en fin de message sous forme de "💡 Conseil proactif".

### 📊 CONTEXTE ACTUEL (Données du système en temps réel) :
${JSON.stringify(contextData, null, 2)}

### 🗣️ REQUÊTE DE L'UTILISATEUR :
${message}

Fournis maintenant ta réponse finale structurée et formattée :
`;

    let lastError: any = null;

    for (const modelName of modelsToTry) {
      try {
        console.log(`Tentative avec le modèle Gemini: ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        console.log(`Succès avec le modèle: ${modelName}`);
        return response.text();
      } catch (error: any) {
        console.warn(`Échec avec le modèle ${modelName}:`, error.message);
        lastError = error;
        // Si c'est une erreur 400 (Bad Request - prompt trop long ou invalide), on ne continue pas
        if (error.status === 400) {
           break;
        }
        // Sinon (404, 503, etc.), on essaie le modèle suivant
      }
    }

    console.error('Erreur IA principale (Tous les modèles ont échoué):', lastError);
    if (lastError?.message?.includes('503')) {
      throw new Error("Les serveurs de Google (Gemini) sont actuellement surchargés pour tous les modèles disponibles. Veuillez réessayer dans quelques instants.");
    }
    throw new Error(`Erreur lors de la communication avec l'API Gemini après plusieurs tentatives: ${lastError?.message}`);
  }
}

export const aiService = new AiService();
