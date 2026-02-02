import React from "react";
import type { AnalysisResult } from "../../core/domain/entities";
import { Clock, Calendar, ChevronRight } from "lucide-react";

// Helper to avoid date-fns dependency for simplicity if not installed
const timeAgo = (timestamp: number) => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(timestamp).toLocaleDateString();
};

interface HistoryViewProps {
  history: AnalysisResult[];
  onSelect: (result: AnalysisResult) => void;
  onClear: () => void;
  onClose: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onSelect,
  onClear,
  onClose,
}) => {
  return (
    <div className="absolute inset-0 bg-zinc-950 z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
      <div className="p-6 border-b border-zinc-900 flex justify-between items-center bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Clock size={20} className="text-emerald-500" />
          History
        </h2>
        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-white transition-colors text-sm font-medium"
        >
          Close
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-zinc-500 gap-4">
            <Calendar size={48} className="opacity-20" />
            <p>No meals tracked yet.</p>
          </div>
        ) : (
          history.map((item, idx) => (
            <button
              key={`${item.timestamp}-${idx}`}
              onClick={() => onSelect(item)}
              className="bg-zinc-900 hover:bg-zinc-800 transition-colors rounded-xl p-3 flex gap-4 items-center text-left group border border-transparent hover:border-zinc-700"
            >
              <div className="h-16 w-16 rounded-lg overflow-hidden shrink-0 bg-zinc-800">
                <img
                  src={item.imageUrl}
                  alt="Meal"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-medium text-white truncate">
                    {item.items.map((i) => i.name).join(", ")}
                  </span>
                  <span className="text-emerald-400 font-bold text-sm whitespace-nowrap">
                    {item.totalCalories} kcal
                  </span>
                </div>
                <div className="text-xs text-zinc-500 flex items-center gap-1">
                  <Clock size={10} />
                  {timeAgo(item.timestamp)}
                  <span className="mx-1">•</span>
                  {item.items.length} items
                </div>
              </div>
              <ChevronRight size={16} className="text-zinc-600 group-hover:text-zinc-400" />
            </button>
          ))
        )}
      </div>

      {history.length > 0 && (
        <div className="p-4 border-t border-zinc-900 bg-zinc-950/50 backdrop-blur-sm">
          <button
            onClick={onClear}
            className="w-full py-3 text-red-400 text-sm font-medium hover:bg-red-950/30 rounded-lg transition-colors"
          >
            Clear History
          </button>
        </div>
      )}
    </div>
  );
};
