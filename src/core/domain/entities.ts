export interface MacroNutrients {
  protein: number;
  carbs: number;
  fat: number;
}

export interface FoodItem {
  id: string; // generated ID
  name: string;
  calories: number;
  macros?: MacroNutrients;
  confidence: number;
}

export interface AnalysisResult {
  imageUrl: string;
  totalCalories: number;
  items: FoodItem[];
  timestamp: number;
}
