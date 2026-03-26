import React, { useMemo, useState, useEffect } from "react";
import { LuDroplet, LuSettings, LuRotateCcw, LuPlus } from "react-icons/lu";

const CircleProgress = ({ percent, size = 120, stroke = 10 }) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = c - (percent / 100) * c;
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2} cy={size / 2} r={r}
        stroke="#f3f4f6" strokeWidth={stroke} fill="none"
      />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        stroke="#3b82f6" strokeWidth={stroke}
        strokeDasharray={c} strokeDashoffset={dash}
        strokeLinecap="round"
        className="transition-all duration-1000 ease-out"
      />
    </svg>
  );
};

const WaterCard = () => {
  const [goal, setGoal] = useState(() => Number(localStorage.getItem("waterGoal")) || 3500);
  const [water, setWater] = useState(0);
  const [tempGoal, setTempGoal] = useState(goal);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("waterMl");
    const lastSavedDate = localStorage.getItem("waterDate");
    const today = new Date().toDateString();

    if (lastSavedDate !== today) {
      setWater(0);
      localStorage.setItem("waterMl", 0);
      localStorage.setItem("waterDate", today);
    } else if (saved) {
      setWater(Number(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("waterMl", water);
    localStorage.setItem("waterGoal", goal);
  }, [water, goal]);

  const pct = useMemo(() => Math.min(100, Math.round((water / goal) * 100)), [water, goal]);

  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 md:p-8 flex flex-col h-full font-sans">
      {/* Header Area */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-sm font-extrabold text-gray-900 tracking-wide flex items-center gap-2">
            <div className="bg-blue-50 text-blue-600 p-1.5 rounded-md">
              <LuDroplet size={16} />
            </div>
            Hydration
          </h3>
          <p className="text-xs font-semibold text-gray-500 mt-1">Status: {pct < 100 ? 'In Progress' : 'Goal Met 🎉'}</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
          >
            <LuSettings size={18} />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="mb-6 bg-gray-50 border border-gray-200 rounded-xl p-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Target Volume (ML)</p>
          <div className="flex gap-2">
            <input
              type="number"
              value={tempGoal}
              onChange={(e) => setTempGoal(Number(e.target.value))}
              className="flex-1 bg-white border border-gray-200 rounded-lg p-2 text-sm font-bold text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              step="250"
            />
            <button
              onClick={() => { setGoal(tempGoal); setShowSettings(false); }}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 font-bold text-xs"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Main Stats Display */}
      <div className="flex flex-col xl:flex-row items-center gap-8 flex-1">
        <div className="relative flex items-center justify-center shrink-0">
          <CircleProgress percent={pct} size={120} stroke={10} />
          <div className="absolute text-center">
            <p className="text-3xl font-black text-blue-600">{pct}%</p>
          </div>
        </div>

        <div className="flex-1 w-full flex flex-col justify-center">
          <div className="mb-4 text-center xl:text-left">
             <div className="flex items-baseline justify-center xl:justify-start gap-1">
                <span className="text-4xl font-black text-gray-900 tracking-tighter">{water}</span>
                <span className="text-sm font-bold text-gray-400 uppercase">/ {goal}ml</span>
             </div>
          </div>

          {/* Liquid Dosage Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {[250, 500, 1000].map((amt) => (
              <button
                key={amt}
                onClick={() => setWater((v) => Math.min(goal * 2, v + amt))}
                className="group h-10 bg-gray-50 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all flex items-center justify-center gap-1 text-gray-700"
              >
                <LuPlus size={12} className="text-blue-500" />
                <span className="text-[11px] font-bold">{amt}</span>
              </button>
            ))}
            <button
              onClick={() => setWater(0)}
              className="h-10 bg-gray-50 border border-gray-200 rounded-lg hover:border-red-200 hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center text-gray-400"
              title="Reset"
            >
              <LuRotateCcw size={14} />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default WaterCard;