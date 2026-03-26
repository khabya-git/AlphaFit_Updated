import { Link } from "react-router-dom";
import { DumbbellIcon, FlameIcon, TrophyIcon } from "./icons";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-24 pb-12 overflow-hidden bg-gray-50">
      {/* Dynamic Background Blurs */}
      <div className="absolute top-0 right-0 w-full md:w-1/2 h-full bg-linear-to-bl from-blue-100/50 via-indigo-50/30 to-transparent pointer-events-none" />
      <div className="absolute top-20 right-20 w-72 h-72 bg-purple-300/20 blur-[100px] rounded-full pointer-events-none mix-blend-multiply" />
      <div className="absolute bottom-10 right-1/3 w-96 h-96 bg-cyan-300/20 blur-[120px] rounded-full pointer-events-none mix-blend-multiply" />

      <div className="container mx-auto px-6 max-w-7xl grid lg:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* TEXT CONTENT */}
        <div className="text-center lg:text-left mt-10 lg:mt-0 relative z-20">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 bg-white/60 backdrop-blur-md shadow-xs text-blue-700 text-sm font-semibold mb-8">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
              </span>
              Your Ultimate Fitness Companion
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] mb-6 tracking-tight">
              Get Fit. <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">Track Daily.</span> <br className="hidden md:block"/> Stay Motivated.
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Experience the all-in-one ecosystem for your health. Track nutrition, analyze workouts with AI, and gamify your progress to achieve your dream physique.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link to="/signup" className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                Start For Free
              </Link>
              <a href="#features" className="w-full sm:w-auto bg-white text-gray-700 border border-gray-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 hover:shadow-md transition-all duration-300">
                See Features
              </a>
            </div>
          </div>
        </div>
        
        {/* DYNAMIC SHOWCASE UI */}
        <div className="hidden lg:flex justify-center items-center relative h-[600px] w-full">
            {/* Center Main Dashboard Mock */}
            <div className="absolute w-[340px] h-[480px] bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 z-20 flex flex-col justify-between animate-in fade-in zoom-in-95 duration-1000 delay-150">
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h4 className="font-bold text-gray-900">Today's Plan</h4>
                      <p className="text-xs text-gray-500">Full Body Workout</p>
                    </div>
                    <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                      <DumbbellIcon className="w-5 h-5" />
                    </div>
                  </div>
                  
                  {/* Mock Progress */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                       <span className="font-semibold text-gray-700">Activity Ring</span>
                       <span className="font-bold text-indigo-600">84%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3">
                       <div className="bg-linear-to-r from-indigo-500 to-blue-500 h-3 rounded-full" style={{ width: '84%' }}></div>
                    </div>
                  </div>

                  {/* Mock Exercise Item */}
                  <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-4 mb-3 border border-gray-100">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-xs flex items-center justify-center text-gray-600">
                       <span className="font-bold text-sm">3x12</span>
                    </div>
                    <div>
                      <h5 className="font-bold text-gray-800 text-sm">Bench Press</h5>
                      <p className="text-xs text-gray-500">Chest, Triceps</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-4 border border-gray-100">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-xs flex items-center justify-center text-gray-600">
                       <span className="font-bold text-sm">4x10</span>
                    </div>
                    <div>
                      <h5 className="font-bold text-gray-800 text-sm">Squats</h5>
                      <p className="text-xs text-gray-500">Quads, Glutes</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold text-sm shadow-md">
                    Complete Workout
                  </button>
                </div>
            </div>

            {/* Floating Nutrition Card */}
            <div className="absolute -left-12 bottom-24 w-48 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 z-30 animate-[bounce_8s_infinite]">
               <div className="flex items-center gap-3 mb-2">
                 <div className="bg-orange-100 p-2 rounded-full text-orange-500"><FlameIcon className="w-4 h-4"/></div>
                 <h5 className="font-bold text-gray-800 text-sm">Calories</h5>
               </div>
               <p className="text-2xl font-black text-gray-900">1,840</p>
               <p className="text-xs text-gray-500">of 2,500 kcal goal</p>
            </div>

            {/* Floating Gamification Card */}
            <div className="absolute -right-8 top-32 w-56 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 z-10 animate-[bounce_9s_infinite_reverse]">
               <div className="flex items-center gap-3">
                 <div className="bg-yellow-100 p-2 rounded-full text-yellow-600"><TrophyIcon className="w-5 h-5"/></div>
                 <div>
                   <h5 className="font-bold text-gray-800 text-xs uppercase tracking-wider">Current Streak</h5>
                   <p className="text-xl font-bold text-gray-900">14 Days 🔥</p>
                 </div>
               </div>
            </div>
        </div>

      </div>
    </section>
  );
}