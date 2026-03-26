import React from "react";
import { LuFlame, LuTarget, LuActivity } from "react-icons/lu";

const toTitleCase = (str = "") =>
  str.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1));

export default function WorkoutDashboard({ workout }) {
  if (!workout) {
    return (
      <div className="h-[40vh] flex items-center justify-center text-gray-400">
        Loading analytics...
      </div>
    );
  }

  const {
    weeklyVolume = 0,
    weeklySessions = 0,
    streak = 0,
    recentPRs = [],
    exerciseProgress = []
  } = workout;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Workout Analytics</h2>
        <p className="text-sm font-medium text-gray-500">
          Track your weekly volume, consistency, and personal records.
        </p>
      </div>

      {/* ===================== */}
      {/* 1️⃣ Weekly Overview */}
      {/* ===================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<LuActivity size={20} />}
          label="Weekly Volume"
          value={`${weeklyVolume.toLocaleString()} kg`}
        />
        <StatCard
          icon={<LuTarget size={20} />}
          label="Weekly Sessions"
          value={weeklySessions}
        />
        <StatCard
          icon={<LuFlame size={20} />}
          label="Workout Streak"
          value={`${streak} days`}
          highlight={streak > 0}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* ===================== */}
        {/* 2️⃣ Recent PRs */}
        {/* ===================== */}
        <div className="bg-white border border-gray-100 shadow-sm p-6 sm:p-8 rounded-2xl">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
            <div className="p-2 bg-orange-50 text-orange-500 rounded-lg">
              <LuFlame size={20} />
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              Recent PRs
            </h2>
          </div>

          {recentPRs.length === 0 ? (
            <div className="py-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <p className="text-gray-500 text-sm font-semibold">
                No personal records yet.
              </p>
              <p className="text-gray-400 text-xs mt-1">Keep pushing your limits!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentPRs.map((pr) => (
                <div
                  key={pr._id}
                  className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
                >
                  <span className="font-bold text-gray-800">
                    {toTitleCase(pr.exercise)}
                  </span>
                  <span className="text-orange-600 font-extrabold bg-orange-50 px-3 py-1 rounded-md">
                    {pr.weight} kg
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ===================== */}
        {/* 3️⃣ Top Exercises */}
        {/* ===================== */}
        <div className="bg-white border border-gray-100 shadow-sm p-6 sm:p-8 rounded-2xl">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <LuTarget size={20} />
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              Top Exercises (Last 30 Days)
            </h2>
          </div>

          {exerciseProgress.length === 0 ? (
            <div className="py-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <p className="text-gray-500 text-sm font-semibold">
                No logged exercises yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {exerciseProgress.map((ex) => (
                <div
                  key={ex._id}
                  className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
                >
                  <span className="font-bold text-gray-800">
                    {toTitleCase(ex._id)}
                  </span>
                  <div className="text-right">
                    <p className="text-blue-600 font-extrabold">
                      {ex.maxWeight} kg
                    </p>
                    <p className="text-xs font-semibold text-gray-500 mt-0.5">
                      {ex.totalVolume.toLocaleString()} kg total
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, highlight }) {
  return (
    <div
      className={`p-6 sm:p-8 rounded-2xl border transition-all shadow-sm flex flex-col items-start ${
        highlight
          ? "border-orange-200 bg-orange-50/50 text-orange-600"
          : "border-gray-100 bg-white"
      }`}
    >
      <div className={`p-3 rounded-xl mb-4 ${highlight ? "bg-orange-100/50 text-orange-500" : "bg-gray-50 text-gray-500"}`}>
        {icon}
      </div>
      <p className={`text-xs uppercase font-bold tracking-wider mb-1 ${highlight ? "text-orange-500/80" : "text-gray-500"}`}>
        {label}
      </p>
      <p className={`text-3xl font-black ${highlight ? "text-orange-600" : "text-gray-900"}`}>
        {value}
      </p>
    </div>
  );
}