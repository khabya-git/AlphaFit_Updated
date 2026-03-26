import React from "react";

const ExerciseCard = ({ exercise, onSelect }) => (
  <div
    onClick={() => onSelect(exercise)}
    className="bg-gray-800/50 hover:bg-gray-700 border border-gray-700 rounded-xl p-4 cursor-pointer transition-all duration-300 shadow-md hover:shadow-emerald-500/10"
  >
    <img
      src={exercise.image}
      alt={exercise.name}
      className="rounded-lg w-full h-32 object-cover mb-3"
    />
    <h4 className="text-white font-semibold">{exercise.name}</h4>
    <p className="text-gray-400 text-sm">{exercise.category}</p>
    <p className="text-xs text-gray-500 italic">{exercise.level}</p>
  </div>
);

export default ExerciseCard;
