import React, { useEffect, useState } from "react";

const MotivationBanner = () => {
  const [quote, setQuote] = useState({ q: "", a: "" });

  useEffect(() => {
    const directives = [
      { q: "Consistency is the only metric that matters.", a: "Core System" },
      { q: "Fatigue is just a data point. Keep going.", a: "Lab Overseer" },
      { q: "Fuel the machine. Precision in every macro.", a: "Nutrition Logic" },
      { q: "Mind over mass. The will is the strongest muscle.", a: "Cmd. Alpha" },
      { q: "Recovery is not weakness. It is calibration.", a: "Bio-Sync" },
      { q: "Execute the protocol without hesitation.", a: "Tactical Unit" },
      { q: "Your only competition is yesterday's logs.", a: "Data Archive" },
      { q: "Discipline outlasts motivation. Every single time.", a: "System Architect" },
      { q: "Adapt. Overcome. Repeat. The Alpha loop.", a: "Central Processing" }
    ];

    // Daily Seed Logic
    const today = new Date();
    const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const dailyIndex = dateSeed % directives.length;
    
    setQuote(directives[dailyIndex]);
  }, []);

  return (
    <div className="relative group overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-6 md:p-8">
      {/* Decorative accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-300 opacity-20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
          <span className="text-xs font-bold uppercase tracking-widest text-blue-100">
            Daily Directive
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
              "{quote.q}"
            </h2>
          </div>
          
          <div className="text-right shrink-0">
            <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-1">Source</p>
            <p className="text-sm font-semibold text-white uppercase border-b border-blue-400/50 pb-1">
              — {quote.a}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MotivationBanner;