import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

export async function* sendMessageToGeminiStream(
  message: string,
  mediaBase64?: string,
  systemInstruction?: string,
  model: string = 'gemini-2.5-flash'
): AsyncGenerator<string, void, unknown> {
  try {
    let contents: any = message;

    if (mediaBase64) {
      const match = mediaBase64.match(/^data:(.+);base64,(.+)$/);

      if (match) {
        const mimeType = match[1];
        const data = match[2];

        contents = {
          parts: [
            ...(message ? [{ text: message }] : []),
            {
              inlineData: {
                mimeType: mimeType,
                data: data,
              },
            },
          ],
        };
      }
    }

    const responseStream = await ai.models.generateContentStream({
      model: model,
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    for await (const chunk of responseStream) {
      if (chunk.text) {
        yield chunk.text;
      }
    }

  } catch (error) {
    console.error("Gemini API Error:", error);
    yield "Sorry, something went wrong. Please try again.";
  }
}

export const sendMessageToGemini = async (message: string, mediaBase64?: string): Promise<string> => {
  let fullText = '';
  for await (const chunk of sendMessageToGeminiStream(message, mediaBase64)) {
    fullText += chunk;
  }
  return fullText;
};