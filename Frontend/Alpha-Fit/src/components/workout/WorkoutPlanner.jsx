import React, { useState, useEffect } from "react";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const WorkoutPlanner = ({ selectedExercise }) => {
  const [plan, setPlan] = useState(() => {
    return JSON.parse(localStorage.getItem("workoutPlan")) || {};
  });

  const handleAdd = (day) => {
    if (!selectedExercise) return alert("Select an exercise first!");
    const updated = { ...plan, [day]: selectedExercise.name };
    setPlan(updated);
    localStorage.setItem("workoutPlan", JSON.stringify(updated));
  };

  const handleClear = (day) => {
    const updated = { ...plan };
    delete updated[day];
    setPlan(updated);
    localStorage.setItem("workoutPlan", JSON.stringify(updated));
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 mt-6">
      <h3 className="text-white font-semibold mb-4">🗓️ Weekly Workout Planner</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="bg-gray-900/40 p-3 rounded-lg flex flex-col items-center"
          >
            <p className="text-white font-semibold">{day}</p>
            {plan[day] ? (
              <>
                <p className="text-emerald-400 text-sm mt-1">{plan[day]}</p>
                <button
                  onClick={() => handleClear(day)}
                  className="text-xs text-red-400 mt-2 hover:underline"
                >
                  Clear
                </button>
              </>
            ) : (
              <button
                onClick={() => handleAdd(day)}
                className="text-xs text-blue-400 mt-2 hover:underline"
              >
                Add
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutPlanner;
