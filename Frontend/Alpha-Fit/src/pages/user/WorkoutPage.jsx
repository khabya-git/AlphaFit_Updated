import React, { useState, useEffect } from "react";
import axios from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import exerciseLibrary from "../../data/exerciseLibrary";
import {
  LuDumbbell, LuPlus, LuTrash2, LuCheck, LuChevronDown,
  LuChevronUp, LuZap, LuTarget, LuFlame
} from "react-icons/lu";

const BODY_PARTS = Object.keys(exerciseLibrary);

const DIFFICULTY_COLOR = {
  beginner: "text-green-600 bg-green-50 border-green-200",
  intermediate: "text-amber-600 bg-amber-50 border-amber-200",
  advanced: "text-red-600 bg-red-50 border-red-200",
};

export default function WorkoutPage({ onWorkoutAdded }) {
  const [selectedBodyPart, setSelectedBodyPart] = useState(BODY_PARTS[0]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [expandedAlts, setExpandedAlts] = useState({});
  const [sets, setSets] = useState([{ weight: "", reps: "" }]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Reset sets when exercise changes
  useEffect(() => {
    setSets([{ weight: "", reps: "" }]);
    setSuccess(false);
  }, [selectedExercise]);

  // ─── Set Helpers ────────────────────────────────────────
  const addSet = () => setSets((prev) => [...prev, { weight: "", reps: "" }]);

  const removeSet = (i) => setSets((prev) => prev.filter((_, idx) => idx !== i));

  const updateSet = (i, field, val) => {
    setSets((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: val };
      return next;
    });
  };

  // ─── Computed Stats ──────────────────────────────────────
  const filledSets = sets.filter((s) => s.weight > 0 && s.reps > 0);
  const totalVolume = filledSets.reduce(
    (sum, s) => sum + Number(s.weight) * Number(s.reps),
    0
  );
  const maxWeight = filledSets.length
    ? Math.max(...filledSets.map((s) => Number(s.weight)))
    : 0;

  // ─── Submit ──────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!selectedExercise) return toast.error("Select an exercise first");
    const validSets = sets.filter(
      (s) => s.weight !== "" && s.reps !== "" && Number(s.weight) > 0 && Number(s.reps) > 0
    );
    if (validSets.length === 0) return toast.error("Add at least one valid set");

    try {
      setLoading(true);
      const res = await axios.post("/workout", {
        exercise: selectedExercise.name,
        sets: validSets.map((s) => ({
          weight: Number(s.weight),
          reps: Number(s.reps),
        })),
      });

      const isPR = res.data?.isPR;
      toast.success(
        isPR
          ? `🏆 NEW PR! ${selectedExercise.name} logged!`
          : `✅ ${selectedExercise.name} logged!`
      );
      setSuccess(true);
      setSets([{ weight: "", reps: "" }]);
      if (onWorkoutAdded) onWorkoutAdded();
    } catch (err) {
      toast.error("Failed to log workout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-8 font-sans animate-in fade-in duration-500 min-h-full">

      {/* HEADER */}
      <div className="border-b border-gray-100 pb-5">
        <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <LuDumbbell />
          </div>
          Log Workout
        </h2>
        <p className="text-sm font-medium text-gray-500 mt-2">
          Select a muscle group, choose an exercise, and record your sets.
        </p>
      </div>

      {/* BODY PART TABS */}
      <div className="flex flex-wrap gap-2">
        {BODY_PARTS.map((part) => (
          <button
            key={part}
            onClick={() => {
              setSelectedBodyPart(part);
              setSelectedExercise(null);
            }}
            className={`px-5 py-2 text-xs font-bold capitalize rounded-full whitespace-nowrap transition-all border ${
              selectedBodyPart === part
                ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20"
                : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            {part}
          </button>
        ))}
      </div>

      {/* EXERCISE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {exerciseLibrary[selectedBodyPart]?.map((exercise) => {
          const isSelected = selectedExercise?.name === exercise.name;
          const altsOpen = expandedAlts[exercise.name];

          return (
            <div
              key={exercise.name}
              onClick={() => setSelectedExercise(isSelected ? null : exercise)}
              className={`p-5 rounded-xl border cursor-pointer transition-all group ${
                isSelected
                  ? "border-blue-500 bg-blue-50/50 shadow-md shadow-blue-500/10"
                  : "border-gray-100 bg-white hover:border-blue-200 hover:shadow-sm"
              }`}
            >
              {/* Title Row */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <h3 className={`font-bold text-sm tracking-tight ${isSelected ? "text-blue-700" : "text-gray-900"}`}>
                    {exercise.name}
                  </h3>
                  <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mt-0.5">
                    {exercise.muscleGroup}
                  </p>
                </div>
                <span className={`text-[10px] font-bold uppercase border px-2 py-1 rounded-md shrink-0 ${DIFFICULTY_COLOR[exercise.difficulty]}`}>
                  {exercise.difficulty}
                </span>
              </div>

              {/* Description */}
              <p className="text-[12px] text-gray-600 leading-relaxed mb-4">
                {exercise.description}
              </p>

              {/* Alternatives */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedAlts((prev) => ({ ...prev, [exercise.name]: !prev[exercise.name] }));
                }}
                className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 hover:text-blue-600 transition-colors"
              >
                <LuTarget size={12} className="text-blue-500" />
                Alternatives ({exercise.alternatives.length})
                {altsOpen ? <LuChevronUp size={12} /> : <LuChevronDown size={12} />}
              </button>

              {altsOpen && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {exercise.alternatives.map((alt) => (
                    <span
                      key={alt}
                      className="text-[11px] font-medium bg-gray-50 border border-gray-100 rounded-md px-2 py-1 text-gray-600"
                    >
                      {alt}
                    </span>
                  ))}
                </div>
              )}

              {/* Selected badge */}
              {isSelected && (
                <div className="mt-4 border-t border-blue-100 pt-3 text-xs font-bold text-blue-600 flex items-center gap-2">
                  <LuCheck size={14} className="bg-blue-100 rounded-full p-0.5" /> 
                  Selected — log your sets below
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* SET LOGGER PANEL */}
      {selectedExercise && (
        <div className="bg-white border md:border-t-4 border-gray-200 md:border-t-blue-500 rounded-2xl p-6 md:p-8 space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-300 shadow-xl shadow-gray-200/50">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                <LuFlame className="text-orange-500" /> {selectedExercise.name}
              </h3>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mt-1">
                {selectedExercise.muscleGroup}
              </p>
            </div>

            {/* Live Stats */}
            <div className="flex gap-4 md:gap-8 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <div className="text-center px-2 border-r border-gray-200">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Volume</p>
                <p className="text-lg font-black text-gray-900">{totalVolume}<span className="text-xs text-gray-500 ml-1 font-semibold">kg</span></p>
              </div>
              <div className="text-center px-2 border-r border-gray-200">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Top Set</p>
                <p className="text-lg font-black text-gray-900">{maxWeight}<span className="text-xs text-gray-500 ml-1 font-semibold">kg</span></p>
              </div>
              <div className="text-center px-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sets</p>
                <p className="text-lg font-black text-gray-900">{filledSets.length}</p>
              </div>
            </div>
          </div>

          {/* Set rows */}
          <div className="space-y-3">
            <div className="grid grid-cols-12 gap-3 text-xs font-bold text-gray-500 uppercase tracking-wider px-2 border-b border-gray-100 pb-2">
              <span className="col-span-2">Set</span>
              <span className="col-span-4">Weight (kg)</span>
              <span className="col-span-4">Reps</span>
              <span className="col-span-2 text-center">Volume</span>
            </div>

            {sets.map((set, i) => {
              const rowVol = set.weight > 0 && set.reps > 0
                ? Number(set.weight) * Number(set.reps)
                : 0;

              return (
                <div key={i} className="grid grid-cols-12 gap-3 items-center group bg-gray-50 p-2 rounded-xl border border-transparent hover:border-gray-200 transition-all">
                  <div className="col-span-2 text-sm font-black text-blue-600 bg-white shadow-sm w-8 h-8 rounded-full flex items-center justify-center border border-gray-100">
                    {i + 1}
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    placeholder="0"
                    value={set.weight}
                    onChange={(e) => updateSet(i, "weight", e.target.value)}
                    className="col-span-4 bg-white border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-gray-900 font-bold p-3 text-center transition-all outline-none"
                  />
                  <input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="0"
                    value={set.reps}
                    onChange={(e) => updateSet(i, "reps", e.target.value)}
                    className="col-span-4 bg-white border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-gray-900 font-bold p-3 text-center transition-all outline-none"
                  />
                  <div className="col-span-1 text-sm font-bold text-gray-600 text-center">
                    {rowVol > 0 ? rowVol : "—"}
                  </div>
                  {sets.length > 1 ? (
                    <button
                      onClick={() => removeSet(i)}
                      className="col-span-1 text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors flex justify-center ml-2"
                    >
                      <LuTrash2 size={16} />
                    </button>
                  ) : <div className="col-span-1" />}
                </div>
              );
            })}
          </div>

          {/* Add Set + Submit */}
          <div className="flex sm:flex-row flex-col gap-4 pt-4 border-t border-gray-100">
            <button
              onClick={addSet}
              className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-sm font-bold bg-white text-gray-600 border-2 border-dashed border-gray-300 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
            >
              <LuPlus size={16} className="stroke-[3]" /> Add Set
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/30 transition-all disabled:opacity-50"
            >
              <LuZap size={16} className={loading ? "animate-pulse" : ""} />
              {loading ? "Logging..." : success ? "Logged! Log Again?" : "Log Workout"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}