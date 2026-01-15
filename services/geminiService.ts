
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private static instance: GoogleGenAI | null = null;

  private static getClient(): GoogleGenAI {
    if (!this.instance) {
      this.instance = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    }
    return this.instance;
  }

  static async generateInvitation(params: {
    eventType: string;
    description: string;
    style: string;
  }): Promise<string | null> {
    const ai = this.getClient();
    const prompt = `A professional, high-quality invitation card design for a ${params.eventType}. 
    Style: ${params.style}. 
    Specific description: ${params.description}. 
    The invitation should be visually stunning, centered, with space for text, and professional typography elements. 
    Do not include literal placeholder text, focus on the artistic background and layout. 
    High-fidelity, 4K resolution, artistic composition.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: "3:4"
          }
        }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      return null;
    } catch (error) {
      console.error("Image generation failed:", error);
      return null;
    }
  }
}
