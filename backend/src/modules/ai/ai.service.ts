import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the API with API key from environment variables
const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export class AiService {
  async chatWithData(message: string, contextData: any): Promise<string> {
    if (!apiKey) {
      throw new Error("La clé API Gemini (GEMINI_API_KEY) n'est pas configurée sur le serveur.");
    }

    try {
      // Use the model explicitly requested by the user's curl
      const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

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

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      console.error('Erreur IA principale:', error);
      if (error.message && error.message.includes('503')) {
        throw new Error("Les serveurs de Google (Gemini) sont actuellement surchargés. Veuillez réessayer dans quelques instants.");
      }
      throw new Error(`Erreur lors de la communication avec l'API Gemini: ${error.message}`);
    }
  }
}

export const aiService = new AiService();
