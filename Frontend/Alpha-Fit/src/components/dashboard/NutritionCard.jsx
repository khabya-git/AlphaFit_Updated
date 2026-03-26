import React, { useState, useEffect } from "react";
import axios from "../../utils/axiosInstance";
import { LuFlame, LuDumbbell, LuRefreshCcw, LuTarget } from "react-icons/lu";

// ✅ Light Theme Stat Subcard
const StatRow = ({ icon, label, value, goal, unit, color }) => {
  const percent = Math.min((value / goal) * 100, 100);
  const remaining = Math.max(0, goal - value);

  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 relative overflow-hidden group flex items-center justify-between transition-colors hover:border-gray-200">
      {/* Progress Bar Floor */}
      <div 
        className={`absolute bottom-0 left-0 h-[3px] transition-all duration-1000 ${color.replace("text-", "bg-")}`} 
        style={{ width: `${percent}%` }}
      />

      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-lg bg-white shadow-sm ${color} group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <div>
          <p className="text-xl font-extrabold text-gray-900 leading-none">
            {value.toFixed(0)} <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{unit}</span>
          </p>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{label}</p>
        </div>
      </div>

      <div className="text-right">
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Left</p>
        <p className={`text-sm font-bold mt-1 ${remaining === 0 ? 'text-green-500' : 'text-gray-600'}`}>
          {remaining === 0 ? 'Done' : remaining.toFixed(0)}
        </p>
      </div>
    </div>
  );
};

const NutritionCard = ({ nutrition, onReset }) => {
  // Targets based on athletic performance goals
  const dailyGoals = { 
    calories: nutrition?.calorieGoal || 2000, 
    protein: 150, 
    fat: 70, 
    carbs: 250 
  };

  const totals = {
    calories: nutrition?.todayCalories || 0,
    protein: nutrition?.todayProtein || 0,
    fat: nutrition?.todayFat || 0,
    carbs: nutrition?.todayCarbs || 0,
  };

  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 md:p-8 flex flex-col h-full font-sans animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-sm font-extrabold text-gray-900 tracking-wide flex items-center gap-2">
            <div className="bg-orange-50 text-orange-600 p-1.5 rounded-md">
              <LuTarget size={16} />
            </div>
            Daily Nutrition
          </h3>
          <p className="text-xs font-semibold text-gray-500 mt-1">
            Tracking macros
          </p>
        </div>
        {onReset && (
          <button 
            onClick={onReset} 
            className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors"
            title="Reset Today's Nutrition"
          >
            <LuRefreshCcw size={16} />
          </button>
        )}
      </div>

      {/* Main List */}
      <div className="flex flex-col gap-3 flex-1 justify-center">
        <StatRow
          icon={<LuFlame size={18} />}
          label="Calories"
          value={totals.calories}
          goal={dailyGoals.calories}
          unit="kc"
          color="text-orange-500"
        />
        <StatRow
          icon={<LuDumbbell size={18} />}
          label="Protein"
          value={totals.protein}
          goal={dailyGoals.protein}
          unit="g"
          color="text-green-500"
        />
        <StatRow
          icon={<div className="font-extrabold text-sm font-serif">F</div>}
          label="Fat"
          value={totals.fat}
          goal={dailyGoals.fat}
          unit="g"
          color="text-yellow-500"
        />
        <StatRow
          icon={<div className="font-extrabold text-sm font-serif">C</div>}
          label="Carbs"
          value={totals.carbs}
          goal={dailyGoals.carbs}
          unit="g"
          color="text-blue-500"
        />
      </div>

    </div>
  );
};

export default NutritionCard;