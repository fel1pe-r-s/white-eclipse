import type { AnalysisResult } from "../domain/entities";
import type { Either } from "../errors/either";

export type AnalysisError = {
  kind: "API_ERROR" | "NETWORK_ERROR" | "INVALID_IMAGE" | "UNKNOWN";
  message: string;
};

export interface IFoodService {
  analyzeImage(imageBase64: string, apiKey: string): Promise<Either<AnalysisError, AnalysisResult>>;
}

export interface IStorageService {
  saveAnalysis(analysis: AnalysisResult): void;
  getHistory(): AnalysisResult[];
  clearHistory(): void;
  saveApiKey(key: string): void;
  getApiKey(): string | null;
}
