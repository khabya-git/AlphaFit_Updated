import React from "react";

const ExerciseAlternatives = ({ exercise }) => {
  if (!exercise) return null;

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 mt-6">
      <h3 className="text-white font-semibold mb-3">
        🔄 Alternatives for {exercise.name}
      </h3>
      <ul className="text-gray-300 text-sm space-y-1">
        {exercise.alternatives.map((alt, i) => (
          <li key={i} className="hover:text-emerald-400 transition">
            • {alt}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExerciseAlternatives;
