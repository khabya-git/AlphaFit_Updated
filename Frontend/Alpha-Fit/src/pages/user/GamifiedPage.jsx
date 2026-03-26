import React, { useEffect, useState } from "react";
import {
  LuTrophy,
  LuFlame,
  LuBadgeCheck,
  LuTarget,
} from "react-icons/lu";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState([]);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("daily");

  const fetchChallenges = async () => {
    try {
      const res = await axiosInstance.get("/challenges");

      setChallenges(res.data.challenges);
      setXp(res.data.xp);
      setLevel(res.data.level);
    } catch (error) {
      toast.error("Failed to load challenges");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const updateProgress = async (challengeId) => {
    try {
      await axiosInstance.post("/challenges/progress", {
        challengeId,
        increment: 1,
      });

      toast.success("Progress Updated!");
      fetchChallenges(); // refresh state
    } catch (error) {
      console.error("Progress update error:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-500">
        Loading Challenges...
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">

      {/* HEADER */}
      <header className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <LuTrophy />
          </div>
          Your Challenges
        </h2>

        <div className="flex gap-8">
          <div className="text-center sm:text-left">
            <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Level</p>
            <p className="text-3xl font-black text-gray-900">{level}</p>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Total XP</p>
            <p className="text-3xl font-black text-blue-600">{xp}</p>
          </div>
        </div>
      </header>

      {/* CHALLENGES */}
      <section>
        <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6 gap-4 border-b border-gray-200 pb-4">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <LuFlame className="text-orange-500" /> Active Goals
          </h3>

          <div className="flex bg-gray-100 p-1 rounded-lg">
            {["daily", "weekly", "monthly"].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 text-xs font-semibold capitalize rounded-md transition-all ${
                  selectedPeriod === period
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {challenges
            .filter((item) => item.challenge && (item.challenge.period || "daily") === selectedPeriod)
            .sort((a, b) => (a.challenge?.order || 0) - (b.challenge?.order || 0))
            .map((item) => {
            const ch = item.challenge;
            const percent = Math.min(
              (item.progress / ch.goal) * 100,
              100
            );
            const isComplete = item.status === "completed";

            return (
              <div
                key={item._id}
                className={`p-6 rounded-2xl border transition-all ${
                  isComplete
                    ? "border-green-200 bg-green-50/50"
                    : "border-gray-100 bg-white shadow-sm hover:shadow-md hover:border-blue-100"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-gray-900 leading-tight">
                    {ch.title}
                  </h4>
                  {isComplete ? (
                    <LuBadgeCheck className="text-green-500 text-xl shrink-0" />
                  ) : (
                    <LuTarget className="text-blue-500 text-xl shrink-0" />
                  )}
                </div>

                <p className="text-sm text-gray-500 mb-6 min-h-[40px]">
                  {ch.description}
                </p>

                {/* PROGRESS BAR */}
                <div className="w-full bg-gray-100 rounded-full h-2 mb-3 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isComplete ? "bg-green-500" : "bg-blue-600"
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="flex justify-between text-sm font-medium mb-6">
                  <span className="text-gray-600">
                    {item.progress} / {ch.goal}
                  </span>
                  <span className={isComplete ? "text-green-600 font-bold" : "text-blue-600 font-bold"}>
                    +{ch.points} XP
                  </span>
                </div>

                <button
                  disabled={isComplete}
                  onClick={() => updateProgress(ch._id)}
                  className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    isComplete
                      ? "bg-green-100 text-green-700 cursor-not-allowed"
                      : "bg-gray-50 text-gray-700 hover:bg-blue-600 hover:text-white border border-gray-200 hover:border-transparent"
                  }`}
                >
                  {isComplete ? "Completed" : "Log Progress"}
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}