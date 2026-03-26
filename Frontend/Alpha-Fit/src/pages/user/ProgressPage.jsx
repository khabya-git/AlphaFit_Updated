import React, { useState, useEffect } from "react";
import axios from "../../utils/axiosInstance";
import exerciseLibrary from "../../data/exerciseLibrary";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { LuTrendingUp, LuActivity, LuFlame, LuCalendar, LuDumbbell } from "react-icons/lu";

/* ======================================
   CUSTOM X AXIS (DATE + DAY)
====================================== */

const CustomXAxis = ({ x, y, payload }) => {
  if (!payload) return null;

  const label = payload.value;
  const day = payload.payload?.day || "";

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={10}
        textAnchor="middle"
        fill="#6b7280" // text-gray-500
        fontSize="10"
        fontWeight="600"
      >
        {label}
      </text>

      <text
        x={0}
        y={0}
        dy={22}
        textAnchor="middle"
        fill="#2563eb" // text-blue-600
        fontSize="9"
        fontWeight="bold"
      >
        {day}
      </text>
    </g>
  );
};

export default function ProgressPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMacro, setSelectedMacro] = useState("calories");
  const [weightInput, setWeightInput] = useState("");
  const [isSavingWeight, setIsSavingWeight] = useState(false);

  // ─── Strength Intel state ────────────────────────────────
  const [selectedStrengthExercise, setSelectedStrengthExercise] = useState("");
  const [strengthProgress, setStrengthProgress] = useState([]);
  const [strengthLoading, setStrengthLoading] = useState(false);

  // All exercises as a flat list from the library
  const allExercises = Object.values(exerciseLibrary).flat();

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/dashboard");
      setDashboardData(res.data.data);
    } catch (error) {
      console.error("System_Error: Progress data sync failed.", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch Strength Progress when exercise changes
  useEffect(() => {
    if (!selectedStrengthExercise) return;
    const fetch = async () => {
      setStrengthLoading(true);
      try {
        const res = await axios.get(`/workout/history`);
        const logs = res.data.data || [];
        // Filter by exercise name (using string since logs use string exercise field)
        const exerciseLower = selectedStrengthExercise.toLowerCase().trim();
        const filtered = logs
          .filter(l => {
            const exName = typeof l.exercise === "string"
              ? l.exercise
              : l.exercise?.name || "";
            return exName.toLowerCase() === exerciseLower;
          })
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .map(l => ({
            date: new Date(l.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
            volume: l.volume || 0,
            topSet: l.sets ? Math.max(...l.sets.map(s => s.weight)) : 0,
            sets: l.sets ? l.sets.length : 0,
            isPR: l.isPR,
          }));
        setStrengthProgress(filtered);
      } catch (e) {
        console.error("Strength fetch error", e);
      } finally {
        setStrengthLoading(false);
      }
    };
    fetch();
  }, [selectedStrengthExercise]);

  const handleSaveWeight = async () => {
    if (!weightInput || isNaN(weightInput) || Number(weightInput) <= 0) return;

    setIsSavingWeight(true);
    try {
      await axios.post("/dashboard/weight", { weight: Number(weightInput) });
      setWeightInput("");
      await fetchData(); // Refresh the chart completely
    } catch (error) {
      console.error("Failed to save weight", error);
    } finally {
      setIsSavingWeight(false);
    }
  };

  if (loading)
    return (
      <div className="p-8 text-blue-600 font-bold animate-pulse flex h-full items-center justify-center">
        Syncing Progress Data...
      </div>
    );

  const nutrition = dashboardData?.nutrition;
  const weight = dashboardData?.weight;

  const macroGoals = {
    protein: nutrition?.proteinGoal || 150,
    carbs: nutrition?.carbsGoal || 250,
    fat: nutrition?.fatGoal || 70,
  };

  return (
    <div className="space-y-8 font-sans animate-in fade-in duration-500 pb-10">

      {/* HEADER */}
      <div className="border-b border-gray-200 pb-6">
        <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <LuTrendingUp />
          </div>
          Progress & Trends
        </h2>
        <p className="text-sm font-medium text-gray-500 mt-2">
          Monitor your weight, nutrition intake, and strength performance over time.
        </p>
      </div>

      {/* SMART INSIGHTS */}
      <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm font-bold text-gray-600">
          <div className="bg-gray-50 p-4 rounded-xl">
            Weekly Change:{" "}
            <span className="text-blue-600 text-lg ml-2">
              {weight?.weeklyChange > 0 ? "+" : ""}{weight?.weeklyChange || 0}%
            </span>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl">
            Goal Completion:{" "}
            <span className="text-green-600 text-lg ml-2">
              {weight?.goalProgress || 0}%
            </span>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl">
            Calorie Target Hit:{" "}
            <span className="text-orange-500 text-lg ml-2">
              {nutrition?.caloriePercentage || 0}%
            </span>
          </div>
        </div>
      </div>

      {/* DAILY NUTRITION CIRCLES */}
      <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 sm:p-8">
        <h3 className="text-sm font-extrabold text-gray-900 mb-6 flex items-center gap-2">
          <div className="p-1.5 bg-orange-50 text-orange-500 rounded-md">
            <LuFlame size={16} />
          </div>
          Today's Overview
        </h3>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Calories */}
          <div className="text-center relative">
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie
                  data={[
                    { value: nutrition?.todayCalories || 0 },
                    {
                      value: Math.max(0, (nutrition?.calorieGoal || 2000) - (nutrition?.todayCalories || 0)),
                    },
                  ]}
                  dataKey="value"
                  innerRadius={45}
                  outerRadius={60}
                  stroke="none"
                  startAngle={90}
                  endAngle={-270}
                >
                  <Cell fill="#f97316" /> {/* orange-500 */}
                  <Cell fill="#f3f4f6" /> {/* gray-100 */}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-lg font-black text-gray-900">{nutrition?.todayCalories || 0}</span>
              <span className="text-[9px] font-bold text-gray-400 uppercase">kcal</span>
            </div>
            <p className="text-xs font-bold text-gray-600 mt-2">Calories</p>
          </div>

          {/* Protein */}
          <div className="text-center relative">
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie
                  data={[
                    { value: nutrition?.todayProtein || 0 },
                    {
                      value: Math.max(0, macroGoals.protein - (nutrition?.todayProtein || 0)),
                    },
                  ]}
                  dataKey="value"
                  innerRadius={45}
                  outerRadius={60}
                  stroke="none"
                  startAngle={90}
                  endAngle={-270}
                >
                  <Cell fill="#22c55e" /> {/* green-500 */}
                  <Cell fill="#f3f4f6" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-lg font-black text-gray-900">{nutrition?.todayProtein || 0}</span>
              <span className="text-[9px] font-bold text-gray-400 uppercase">g</span>
            </div>
            <p className="text-xs font-bold text-gray-600 mt-2">Protein</p>
          </div>

          {/* Carbs */}
          <div className="text-center relative">
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie
                  data={[
                    { value: nutrition?.todayCarbs || 0 },
                    {
                      value: Math.max(0, macroGoals.carbs - (nutrition?.todayCarbs || 0)),
                    },
                  ]}
                  dataKey="value"
                  innerRadius={45}
                  outerRadius={60}
                  stroke="none"
                  startAngle={90}
                  endAngle={-270}
                >
                  <Cell fill="#3b82f6" /> {/* blue-500 */}
                  <Cell fill="#f3f4f6" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-lg font-black text-gray-900">{nutrition?.todayCarbs || 0}</span>
              <span className="text-[9px] font-bold text-gray-400 uppercase">g</span>
            </div>
            <p className="text-xs font-bold text-gray-600 mt-2">Carbs</p>
          </div>

          {/* Fat */}
          <div className="text-center relative">
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie
                  data={[
                    { value: nutrition?.todayFat || 0 },
                    {
                      value: Math.max(0, macroGoals.fat - (nutrition?.todayFat || 0)),
                    },
                  ]}
                  dataKey="value"
                  innerRadius={45}
                  outerRadius={60}
                  stroke="none"
                  startAngle={90}
                  endAngle={-270}
                >
                  <Cell fill="#eab308" /> {/* yellow-500 */}
                  <Cell fill="#f3f4f6" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-lg font-black text-gray-900">{nutrition?.todayFat || 0}</span>
              <span className="text-[9px] font-bold text-gray-400 uppercase">g</span>
            </div>
            <p className="text-xs font-bold text-gray-600 mt-2">Fat</p>
          </div>

        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* WEEKLY MACRO SELECTION CHART */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-2">
              <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
                <LuActivity size={16} /> 
              </div>
              Weekly Macros
            </h3>
            <select
              title="Select Macro"
              name="macroSelect"
              value={selectedMacro}
              onChange={(e) => setSelectedMacro(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold p-2 outline-none rounded-lg focus:ring-2 focus:ring-blue-100 cursor-pointer transition-all"
            >
              <option value="calories">Calories</option>
              <option value="protein">Protein</option>
              <option value="carbs">Carbs</option>
              <option value="fats">Fats</option>
            </select>
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={nutrition?.weekly || []} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="period" tick={<CustomXAxis />} axisLine={false} tickLine={false} />
              <YAxis stroke="#9ca3af" fontSize={10} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
              {selectedMacro === "calories" && <Bar dataKey="calories" fill="#f97316" name="Calories" radius={[4, 4, 0, 0]} />}
              {selectedMacro === "protein" && <Bar dataKey="protein" fill="#22c55e" name="Protein" radius={[4, 4, 0, 0]} />}
              {selectedMacro === "carbs" && <Bar dataKey="carbs" fill="#3b82f6" name="Carbs" radius={[4, 4, 0, 0]} />}
              {selectedMacro === "fats" && <Bar dataKey="fats" fill="#eab308" name="Fats" radius={[4, 4, 0, 0]} />}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* WEEKLY MACRO TRENDS */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 sm:p-8">
          <h3 className="text-sm font-extrabold text-gray-900 mb-8 flex items-center gap-2">
             <div className="p-1.5 bg-purple-50 text-purple-600 rounded-md">
                <LuTrendingUp size={16} /> 
             </div>
             Weekly Trends
          </h3>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={nutrition?.weekly || []} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="period" tick={<CustomXAxis />} axisLine={false} tickLine={false} />
              <YAxis stroke="#9ca3af" fontSize={10} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
              <Legend wrapperStyle={{ fontSize: "11px", fontWeight: "bold", color: "#6b7280", paddingTop: "10px" }} iconType="circle" />

              <Line type="monotone" dataKey="calories" stroke="#f97316" strokeWidth={3} dot={{ strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="protein" stroke="#22c55e" strokeWidth={2} dot={{ strokeWidth: 2, r: 3 }} />
              <Line type="monotone" dataKey="carbs" stroke="#3b82f6" strokeWidth={2} dot={{ strokeWidth: 2, r: 3 }} />
              <Line type="monotone" dataKey="fats" stroke="#eab308" strokeWidth={2} dot={{ strokeWidth: 2, r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* WEIGHT TREND */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 sm:p-8 lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-2">
              <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
                <LuActivity size={16} /> 
              </div>
              Body Weight Trend
            </h3>

            {/* Weight Input Form */}
            <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
              <input
                type="number"
                step="0.1"
                min="0"
                placeholder="Log Today (kg)"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                className="bg-white border border-gray-200 text-gray-900 text-sm font-bold px-4 py-2 rounded-lg outline-none w-36 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                disabled={isSavingWeight}
              />
              <button
                onClick={handleSaveWeight}
                disabled={isSavingWeight || !weightInput}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {isSavingWeight ? "Saving..." : "Log Weight"}
              </button>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weight?.trend || []} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="date" stroke="#9ca3af" fontSize={10} tickMargin={10} axisLine={false} tickLine={false} />
              <YAxis stroke="#9ca3af" fontSize={10} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
              <Legend wrapperStyle={{ fontSize: "11px", fontWeight: "bold", paddingTop: "20px" }} iconType="circle" />

              <Line
                type="monotone"
                dataKey="weight"
                stroke="#d1d5db" // gray-300
                strokeWidth={2}
                dot={{ r: 3, fill: "#d1d5db", strokeWidth: 0 }}
                name="Log"
              />

              <Line
                type="monotone"
                dataKey="movingAvg"
                stroke="#2563eb" // blue-600
                strokeWidth={4}
                dot={false}
                activeDot={{ r: 6, fill: "#2563eb", stroke: "#e0e7ff", strokeWidth: 3 }}
                name="7-Day Average"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ─── MONTHLY MACRO TRENDS ─────────────────────── */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 sm:p-8 lg:col-span-2">
          <div className="mb-8">
            <h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-2 mb-1">
              <div className="p-1.5 bg-green-50 text-green-600 rounded-md">
                <LuCalendar size={16} /> 
              </div>
              Monthly Macro Dist
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              Weekly aggregates over the last 30 days
            </p>
          </div>

          {(nutrition?.monthly || []).length === 0 ? (
            <div className="h-[250px] flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <p className="text-sm font-bold text-gray-400">Not enough data to model trends.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={nutrition?.monthly || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="calGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="proGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="carbGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="fatGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#eab308" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="period" stroke="#9ca3af" fontSize={10} axisLine={false} tickLine={false} tickMargin={10} />
                <YAxis stroke="#9ca3af" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                <Legend wrapperStyle={{ fontSize: "11px", fontWeight: "bold", paddingTop: "20px" }} iconType="circle" />
                <Area type="monotone" dataKey="calories" name="Calories" stroke="#f97316" strokeWidth={2} fill="url(#calGrad2)" dot={{ r: 4, fill: "#f97316", strokeWidth: 0 }} />
                <Area type="monotone" dataKey="protein" name="Protein" stroke="#22c55e" strokeWidth={2} fill="url(#proGrad2)" dot={{ r: 4, fill: "#22c55e", strokeWidth: 0 }} />
                <Area type="monotone" dataKey="carbs" name="Carbs" stroke="#3b82f6" strokeWidth={2} fill="url(#carbGrad2)" dot={{ r: 4, fill: "#3b82f6", strokeWidth: 0 }} />
                <Area type="monotone" dataKey="fats" name="Fats" stroke="#eab308" strokeWidth={2} fill="url(#fatGrad2)" dot={{ r: 4, fill: "#eab308", strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

      </div>

      {/* ─── STRENGTH INTEL ─────────────────────────────── */}
      <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-2">
              <div className="p-1.5 bg-orange-50 text-orange-600 rounded-md">
                <LuDumbbell size={16} /> 
              </div>
              Strength History
            </h3>
            <p className="text-xs text-gray-500 font-medium mt-1">
              Analyze volume & top-set progression.
            </p>
          </div>
          <select
            value={selectedStrengthExercise}
            onChange={(e) => setSelectedStrengthExercise(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-gray-900 text-sm font-bold p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all cursor-pointer shadow-xs"
          >
            <option value="">-- Select Exercise --</option>
            {allExercises.map((ex) => (
              <option key={ex.name} value={ex.name}>{ex.name}</option>
            ))}
          </select>
        </div>

        {!selectedStrengthExercise ? (
          <div className="h-[250px] flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-sm font-bold text-gray-400">Select an exercise to view its history.</p>
          </div>
        ) : strengthLoading ? (
          <div className="h-[250px] flex items-center justify-center bg-gray-50 rounded-xl">
            <p className="text-sm font-bold text-blue-500 animate-pulse">Loading logs...</p>
          </div>
        ) : strengthProgress.length === 0 ? (
          <div className="h-[250px] flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-sm font-bold text-gray-400">No logs found for this exercise.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={strengthProgress} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="date" stroke="#9ca3af" fontSize={10} axisLine={false} tickLine={false} tickMargin={10} />
              <YAxis stroke="#9ca3af" fontSize={10} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                formatter={(val, name) => [val, name === "volume" ? "Volume (kg)" : name === "topSet" ? "Top Set (kg)" : name]}
              />
              <Legend wrapperStyle={{ fontSize: "11px", fontWeight: "bold", paddingTop: "20px" }} iconType="circle" />
              <Line type="monotone" dataKey="volume" name="Total Volume" stroke="#2563eb" strokeWidth={3} dot={(props) => {
                if (props.payload?.isPR) {
                  return <circle key={props.key} cx={props.cx} cy={props.cy} r={6} fill="#f59e0b" stroke="#fff" strokeWidth={2} />;
                }
                return <circle key={props.key} cx={props.cx} cy={props.cy} r={4} fill="#2563eb" strokeWidth={0} />;
              }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="topSet" name="Top Set" stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: "#10b981", strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        )}

        {strengthProgress.some(p => p.isPR) && (
          <p className="text-xs font-bold text-amber-500 mt-4 flex items-center gap-1 bg-amber-50 inline-flex px-3 py-1.5 rounded-lg border border-amber-100">
            🏆 Yellow points indicate Personal Records (PRs)
          </p>
        )}
      </div>

    </div>
  );
}