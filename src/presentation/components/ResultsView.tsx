import React from "react";
import type { AnalysisResult } from "../../core/domain/entities";
import { Check, ChevronLeft, Flame, Zap, Droplet, Activity } from "lucide-react";

interface ResultsViewProps {
  result: AnalysisResult;
  onReset: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ result, onReset }) => {
  return (
    <div className="h-full w-full bg-zinc-950 flex flex-col text-zinc-100 overflow-y-auto">
      {/* Header Image */}
      <div className="relative h-64 w-full shrink-0">
        <img
          src={result.imageUrl}
          alt="Analyzed food"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
        <button
          onClick={onReset}
          className="absolute top-4 left-4 p-2 rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
      </div>

      <div className="flex-1 p-6 -mt-10 relative z-10 flex flex-col gap-6">
        {/* Total Calories Card */}
        <div className="bg-zinc-900 rounded-3xl p-6 shadow-xl border border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-zinc-400 font-medium">Total Energy</span>
            <Flame className="text-orange-500" size={24} />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-5xl font-bold tracking-tight text-white">
              {result.totalCalories}
            </span>
            <span className="text-xl text-zinc-500 mb-1 font-medium">kcal</span>
          </div>
        </div>

        {/* Breakdown List */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-zinc-200">Food Items</h3>
          {result.items.map((item) => (
            <div
              key={item.id}
              className="bg-zinc-900/50 rounded-2xl p-4 border border-zinc-800/50 flex flex-col gap-3"
            >
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-lg text-zinc-100 capitalize">
                  {item.name}
                </h4>
                <div className="flex flex-col items-end">
                  <span className="font-bold text-emerald-400">{item.calories} kcal</span>
                  <span className="text-xs text-zinc-500">
                    {Math.round(item.confidence * 100)}% match
                  </span>
                </div>
              </div>

              {item.macros && (
                <div className="grid grid-cols-3 gap-2 mt-1">
                  <div className="bg-zinc-950 rounded-lg p-2 flex flex-col items-center">
                    <span className="text-xs text-zinc-500 mb-1 flex items-center gap-1">
                      <Zap size={10} className="text-blue-400" /> Carbs
                    </span>
                    <span className="font-medium">{item.macros.carbs}g</span>
                  </div>
                  <div className="bg-zinc-950 rounded-lg p-2 flex flex-col items-center">
                    <span className="text-xs text-zinc-500 mb-1 flex items-center gap-1">
                      <Activity size={10} className="text-red-400" /> Prot
                    </span>
                    <span className="font-medium">{item.macros.protein}g</span>
                  </div>
                  <div className="bg-zinc-950 rounded-lg p-2 flex flex-col items-center">
                    <span className="text-xs text-zinc-500 mb-1 flex items-center gap-1">
                      <Droplet size={10} className="text-yellow-400" /> Fat
                    </span>
                    <span className="font-medium">{item.macros.fat}g</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={onReset}
          className="mt-4 w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-semibold text-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20"
        >
          <Check size={20} />
          Done
        </button>
      </div>
    </div>
  );
};
