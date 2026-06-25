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
Tu es un assistant IA professionnel spécialisé dans la gestion des fournitures bureautiques.
Ton rôle est d'analyser les données de l'entreprise (achats, stocks, demandes) et de répondre aux questions de l'utilisateur.
Tu dois répondre poliment, de manière claire, concise et aller droit au but. Utilise du Markdown pour formater ta réponse (gras, listes).
Tu ne dois te baser QUE sur les données JSON ci-dessous pour formuler ta réponse, et effectuer des prévisions (calculs logiques) si on te le demande ou si c'est pertinent.
Ne donne jamais de fausses informations. Si la donnée n'est pas présente dans le JSON fourni, indique simplement que tu n'as pas l'information.

DONNÉES DU SYSTÈME (JSON) :
${JSON.stringify(contextData, null, 2)}

QUESTION DE L'UTILISATEUR :
${message}

RÉPONSE :
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
