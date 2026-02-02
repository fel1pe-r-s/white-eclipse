import type { AnalysisResult } from "../../core/domain/entities";
import type { IStorageService } from "../../core/interfaces/services";

const STORAGE_KEYS = {
  HISTORY: "food_agent_history",
  API_KEY: "food_agent_api_key",
};

export class LocalStorageService implements IStorageService {
  saveAnalysis(analysis: AnalysisResult): void {
    const history = this.getHistory();
    // Add to beginning, keep last 50
    const newHistory = [analysis, ...history].slice(0, 50);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(newHistory));
  }

  getHistory(): AnalysisResult[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (!stored) return [];
      return JSON.parse(stored) as AnalysisResult[];
    } catch (e) {
      console.error("Failed to parse history", e);
      return [];
    }
  }

  clearHistory(): void {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  }

  saveApiKey(key: string): void {
    localStorage.setItem(STORAGE_KEYS.API_KEY, key);
  }

  getApiKey(): string | null {
    return localStorage.getItem(STORAGE_KEYS.API_KEY);
  }
}
