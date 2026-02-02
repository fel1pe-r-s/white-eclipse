import { useState, useEffect, useCallback } from "react";
import type { AnalysisResult } from "../../core/domain/entities";
import type { AnalysisError } from "../../core/interfaces/services";
import { fold } from "../../core/errors/either";
import { GeminiFoodService } from "../../infrastructure/gemini/gemini-food-service";
import { LocalStorageService } from "../../infrastructure/storage/local-storage-service";

const foodService = new GeminiFoodService();
const storageService = new LocalStorageService();

export type AppState = {
  status: "idle" | "analyzing" | "success" | "error";
  currentResult: AnalysisResult | null;
  history: AnalysisResult[];
  error: string | null;
  apiKey: string | null;
};

export const useFoodAgent = () => {
  const [state, setState] = useState<AppState>({
    status: "idle",
    currentResult: null,
    history: [],
    error: null,
    apiKey: null,
  });

  // Load initial data
  useEffect(() => {
    // Check .env first, then local storage
    const envKey = import.meta.env.VITE_GEMINI_API_KEY;
    const storedKey = storageService.getApiKey();
    const history = storageService.getHistory();

    setState((prev) => ({
      ...prev,
      apiKey: envKey || storedKey,
      history,
    }));
  }, []);

  const setApiKey = useCallback((key: string) => {
    storageService.saveApiKey(key);
    setState((prev) => ({ ...prev, apiKey: key }));
  }, []);

  const clearHistory = useCallback(() => {
    storageService.clearHistory();
    setState((prev) => ({ ...prev, history: [] }));
  }, []);

  const analyzeImage = useCallback(async (imageBase64: string) => {
    const key = state.apiKey || import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!key) {
      setState((prev) => ({
        ...prev,
        status: "error",
        error: "API Key is missing. Please configure it in settings.",
      }));
      return;
    }

    setState((prev) => ({ ...prev, status: "analyzing", error: null }));

    const result = await foodService.analyzeImage(imageBase64, key);

    fold(
      result,
      (error: AnalysisError) => {
        setState((prev) => ({
          ...prev,
          status: "error",
          error: error.message,
        }));
      },
      (analysis: AnalysisResult) => {
        storageService.saveAnalysis(analysis);
        setState((prev) => ({
          ...prev,
          status: "success",
          currentResult: analysis,
          history: [analysis, ...prev.history],
        }));
      }
    );
  }, [state.apiKey]);

  const resetAnalysis = useCallback(() => {
    setState((prev) => ({ ...prev, status: "idle", currentResult: null, error: null }));
  }, []);

  return {
    state,
    actions: {
      setApiKey,
      analyzeImage,
      clearHistory,
      resetAnalysis,
    },
  };
};
