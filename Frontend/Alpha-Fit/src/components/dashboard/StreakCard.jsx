import React, { useState, useMemo, useEffect } from "react";
import { LuFlame, LuChevronLeft, LuChevronRight } from "react-icons/lu";

const StreakCard = ({ todayWorkoutPercent = 0 }) => {
  const [streak, setStreak] = useState(() => parseInt(localStorage.getItem("user_streak")) || 0);
  const [viewDate, setViewDate] = useState(new Date()); 
  const now = new Date();
  const todayStr = now.toDateString();

  const changeMonth = (offset) => {
    setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };

  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0);
    
    const days = [];
    const startPadding = (startOfMonth.getDay() + 6) % 7;
    for (let i = 0; i < startPadding; i++) days.push({ padding: true });

    for (let d = 1; d <= endOfMonth.getDate(); d++) {
      const currentIterDate = new Date(year, month, d);
      const isToday = currentIterDate.toDateString() === todayStr;
      const diffInDays = Math.floor((now - currentIterDate) / (1000 * 60 * 60 * 24));
      const isCompleted = diffInDays > 0 && diffInDays <= streak;

      days.push({
        date: d,
        isToday,
        completed: isCompleted || (isToday && todayWorkoutPercent >= 50)
      });
    }
    return days;
  }, [viewDate, streak, todayWorkoutPercent, todayStr]);

  useEffect(() => {
    const lastUpdated = localStorage.getItem("last_streak_update");
    if (lastUpdated === todayStr) return;

    if (todayWorkoutPercent >= 50) {
      setStreak((prev) => {
        const newStreak = prev + 1;
        localStorage.setItem("user_streak", newStreak);
        localStorage.setItem("last_streak_update", todayStr);
        return newStreak;
      });
    } else if (lastUpdated !== null) {
      setStreak(0);
      localStorage.setItem("user_streak", 0);
      localStorage.setItem("last_streak_update", todayStr);
    }
  }, [todayWorkoutPercent, todayStr]);

  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 md:p-8 relative overflow-hidden group flex flex-col h-full">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-extrabold text-gray-900 border-b-2 border-orange-500 pb-1">
            {viewDate.toLocaleString('default', { month: 'long' })}
          </span>
          <span className="text-sm font-bold text-gray-400">
            {viewDate.getFullYear()}
          </span>
        </div>
        
        <div className="flex gap-2">
          <button onClick={() => changeMonth(-1)} className="p-1.5 hover:bg-gray-100 rounded-lg border border-gray-100 transition-colors text-gray-500">
            <LuChevronLeft size={20} />
          </button>
          <button onClick={() => setViewDate(new Date())} className="px-3 text-xs font-bold rounded-lg border border-gray-100 hover:bg-gray-50 text-gray-500">
            Current
          </button>
          <button onClick={() => changeMonth(1)} className="p-1.5 hover:bg-gray-100 rounded-lg border border-gray-100 transition-colors text-gray-500">
            <LuChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* WEEKDAY LABELS */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((d, i) => (
          <span key={i} className="text-[10px] font-bold text-gray-400 text-center tracking-wider">{d}</span>
        ))}
      </div>

      {/* DYNAMIC GRID */}
      <div className="grid grid-cols-7 gap-2 flex-1 content-start">
        {calendarDays.map((item, i) => (
          <div key={i} className="aspect-square relative flex items-center justify-center">
            {!item.padding && (
              <>
                <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                  item.completed 
                    ? "bg-orange-50 border border-orange-200" 
                    : item.isToday ? "border-2 border-orange-400 bg-white" : "border border-gray-100 bg-gray-50"
                }`} />
                
                <span className={`relative z-10 text-sm font-bold ${
                  item.completed ? "text-orange-600" : item.isToday ? "text-gray-900" : "text-gray-400"
                }`}>
                  {item.date}
                </span>

                {item.completed && (
                  <LuFlame className="absolute -top-1 -right-1 text-orange-500 text-sm bg-orange-50 rounded-full" />
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {/* DATA FOOTER */}
      <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-end">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Consistency</p>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black text-gray-900 leading-none">{streak}</span>
            <span className="text-sm font-bold text-orange-500 uppercase">Days</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Daily Yield</p>
          <p className={`text-2xl font-black leading-none ${todayWorkoutPercent >= 50 ? "text-green-500" : "text-gray-700"}`}>
            {todayWorkoutPercent}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default StreakCard;