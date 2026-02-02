import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AnalysisResult } from "../../core/domain/entities";
import type { AnalysisError, IFoodService } from "../../core/interfaces/services";
import { type Either, left, right } from "../../core/errors/either";
import { nanoid } from "nanoid";

export class GeminiFoodService implements IFoodService {
  async analyzeImage(
    imageBase64: string,
    apiKey: string
  ): Promise<Either<AnalysisError, AnalysisResult>> {
    try {
      // Clean base64 string if needed (remove data:image/jpeg;base64, prefix)
      const cleanBase64 = imageBase64.split(",")[1] || imageBase64;

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        You are a nutrition expert AI. Analyze the food in this image.
        Identify all food items, estimate their portion size, and calculate calories and macros.
        
        Return STRICT JSON format ONLY (no markdown code blocks) with the following structure:
        {
          "items": [
            {
              "name": "Food Name",
              "calories": 100,
              "macros": { "protein": 10, "carbs": 20, "fat": 5 },
              "confidence": 0.9 (0-1 scale)
            }
          ],
          "totalCalories": 100
        }
      `;

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: cleanBase64,
            mimeType: "image/jpeg",
          },
        },
      ]);

      const response = await result.response;
      const text = response.text();
      
      // Sanitizing code blocks if Gemini returns them despite instruction
      const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
      
      const parsed = JSON.parse(jsonStr);

      const analysis: AnalysisResult = {
        imageUrl: imageBase64, // Storing full base64 might be heavy for localStorage, but requested "simple" cache
        timestamp: Date.now(),
        totalCalories: parsed.totalCalories || 0,
        items: (parsed.items || []).map((item: any) => ({
          ...item,
          id: nanoid(),
        })),
      };

      return right(analysis);
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      return left({
        kind: "API_ERROR",
        message: error.message || "Failed to analyze image with Gemini",
      });
    }
  }
}
