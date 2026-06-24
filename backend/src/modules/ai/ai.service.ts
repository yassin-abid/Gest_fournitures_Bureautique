import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the API with API key from environment variables
const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export class AiService {
  async chatWithData(message: string, contextData: any): Promise<string> {
    if (!apiKey) {
      throw new Error("La clé API Gemini (GEMINI_API_KEY) n'est pas configurée sur le serveur.");
    }

    let targetModelName = 'gemini-1.5-flash';

    try {
      // Step 1: Auto-detect available models if the default one fails
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();
        
        if (data && data.models) {
          // Find the first model that supports generateContent
          const validModels = data.models.filter((m: any) => 
            m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent')
          );
          
          if (validModels.length > 0) {
            // Prefer gemini-1.5-flash if available, else pick the first text model
            const flashModel = validModels.find((m: any) => m.name.includes('gemini-1.5-flash'));
            const proModel = validModels.find((m: any) => m.name.includes('gemini-1.5-pro') || m.name.includes('gemini-pro'));
            
            const selected = flashModel || proModel || validModels[0];
            // Remove 'models/' prefix if present because the SDK adds it
            targetModelName = selected.name.replace('models/', '');
            console.log(`Auto-detected Gemini model: ${targetModelName}`);
          }
        }
      } catch (e) {
        console.error("Erreur lors de l'auto-détection du modèle, utilisation de la valeur par défaut.", e);
      }

      // Step 2: Use the detected model
      const model = genAI.getGenerativeModel({ model: targetModelName });

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
      throw new Error(`Le modèle IA (${targetModelName}) n'est pas disponible ou la clé API est invalide. Détails: ${error.message}`);
    }
  }
}

export const aiService = new AiService();
