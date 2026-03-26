import { ActivityIcon, TrophyIcon, BotIcon, FlameIcon, ChartIcon, DumbbellIcon } from "./icons";

const featuresList = [
  {
    icon: <BotIcon />,
    color: "bg-indigo-100 text-indigo-600",
    title: "AI Pose Detection",
    desc: "Use your device's camera to get real-time neural coaching and form correction to avoid injuries.",
  },
  {
    icon: <FlameIcon />,
    color: "bg-orange-100 text-orange-600",
    title: "Nutrition Tracking",
    desc: "Log your daily meals, analyze macros, and stay on top of your personalized calorie goals effortlessly.",
  },
  {
    icon: <TrophyIcon />,
    color: "bg-yellow-100 text-yellow-600",
    title: "Gamified Fitness",
    desc: "Earn badges, maintain burning streaks, and compete with friends to stay motivated every single day.",
  },
  {
    icon: <DumbbellIcon />,
    color: "bg-rose-100 text-rose-600",
    title: "Custom Workouts",
    desc: "Access daily curated routines or build personalized workout plans that target your specific muscle groups.",
  },
  {
    icon: <ChartIcon />,
    color: "bg-blue-100 text-blue-600",
    title: "Progress Analytics",
    desc: "Visualize your journey with detailed charts tracking your weight, consistency, and strength gains over time.",
  },
  {
    icon: <ActivityIcon />,
    color: "bg-emerald-100 text-emerald-600",
    title: "Holistic Health",
    desc: "Monitor your water intake, capture daily progress photos, and stay sharp with daily motivational boosts.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white relative">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        
        <div className="mb-20 text-center max-w-3xl mx-auto">
          <h2 className="text-sm font-bold tracking-widest text-blue-600 uppercase mb-3">Explore The Ecosystem</h2>
          <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            Everything you need for a <br className="hidden md:block"/> complete transformation
          </h3>
          <p className="text-xl text-gray-600">
            AlphaFit isn't just a tracker. It's a suite of powerful, easy-to-use tools designed to keep you consistent, informed, and motivated.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresList.map((f, i) => (
            <div
              key={i}
              className="group p-8 bg-white rounded-3xl border border-gray-100 shadow-xs hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 ${f.color.split(' ')[0]} rounded-bl-full -z-10 opacity-30 group-hover:scale-110 transition-transform duration-500`} />
              
              <div className={`${f.color} mb-6 w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner`}>
                <div className="w-8 h-8">
                  {f.icon}
                </div>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                {f.title}
              </h4>
              <p className="text-gray-600 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}