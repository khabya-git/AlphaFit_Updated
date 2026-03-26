import React, { useEffect, useState } from "react";
import { LuDumbbell, LuClock, LuTarget, LuActivity } from "react-icons/lu";

const WorkoutCard = ({ onNavigate }) => {
  const [workout, setWorkout] = useState(null);

  useEffect(() => {
    // Simulated load
    const loadWorkout = async () => {
      setWorkout({
        title: "Upper Body Strength", 
        durationMin: 45,
        focus: "Chest/Back",
        scheduledAt: "6:30 PM",
      });
    };
    loadWorkout();
  }, []);

  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 md:p-8 flex flex-col h-full font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h3 className="text-sm font-extrabold text-gray-900 tracking-wide flex items-center gap-2">
            <div className="bg-blue-50 text-blue-600 p-1.5 rounded-md">
              <LuActivity size={16} />
            </div>
            Today's Workout
          </h3>
          <p className="text-xs font-semibold text-gray-500 mt-1">
            Status: Ready
          </p>
        </div>
        <button 
          onClick={() => onNavigate("workouts")} 
          className="text-[10px] font-bold tracking-widest uppercase text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors cursor-pointer"
        >
          View Schedule
        </button>
      </div>

      {workout ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1 content-start">
          
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 hover:border-gray-200 transition-colors">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <LuTarget size={14} className="text-blue-500" /> Routine
            </p>
            <p className="text-lg font-extrabold text-gray-900 leading-tight">{workout.title}</p>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 hover:border-gray-200 transition-colors">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <LuDumbbell size={14} className="text-blue-500" /> Focus
            </p>
            <p className="text-lg font-extrabold text-gray-900 leading-tight">{workout.focus}</p>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 hover:border-gray-200 transition-colors">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <LuClock size={14} className="text-blue-500" /> Duration
            </p>
            <p className="text-lg font-extrabold text-gray-900 leading-tight">{workout.durationMin} MIN</p>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 hover:border-gray-200 transition-colors">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <span className="text-blue-500 animate-pulse">●</span> Scheduled
            </p>
            <p className="text-lg font-extrabold text-gray-900 leading-tight">{workout.scheduledAt}</p>
          </div>
        </div>
      ) : (
        <div className="py-12 flex-1 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">No Routine Scheduled</p>
        </div>
      )}

      {/* Action Button */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <button 
          onClick={() => onNavigate("pose-detection")}
          className="w-full inline-flex items-center justify-center gap-3 px-6 py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-sm cursor-pointer"
        >
          <LuDumbbell size={18} />
          <span>Start Workout</span>
        </button>
      </div>
    </div>
  );
};

export default WorkoutCard;