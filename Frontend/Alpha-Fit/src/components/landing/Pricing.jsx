import { Link } from "react-router-dom";
import { CheckIcon } from "./icons";

const plans = [
  {
    name: "Starter",
    price: "Free",
    features: ["Simple workout tracking", "Daily calorie goals", "Community access"],
    featured: false,
  },
  {
    name: "Alpha Pro",
    price: "$9.99/mo",
    features: ["AI Form Correction", "Advanced Progress Analytics", "Gamified Badges & Streaks", "Personalized Routines"],
    featured: true,
  },
  {
    name: "Elite",
    price: "$29.99/mo",
    features: ["1-on-1 Virtual Coaching", "Custom Meal Plans", "Priority AI Support"],
    featured: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-gray-50 border-t border-gray-100 relative overflow-hidden">
      {/* Decorative background blurs */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-blue-300/10 blur-[100px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-300/10 blur-[120px] rounded-full" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-sm font-bold tracking-widest text-indigo-600 uppercase mb-3">Upgrade Your Journey</h2>
          <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
            Find the perfect plan
          </h3>
          <p className="text-lg text-gray-600">Start for free to track the basics. Upgrade to Pro for the full AI and Gamification experience.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative rounded-3xl overflow-hidden transition-all duration-300 ${
                p.featured
                  ? "bg-linear-to-b from-blue-600 to-indigo-700 text-white shadow-2xl scale-100 md:scale-110 z-20 border-blue-500"
                  : "bg-white text-gray-900 border border-gray-200 shadow-md hover:shadow-lg"
              }`}
            >
              {p.featured && (
                <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-[10px] font-black uppercase tracking-widest py-1.5 px-4 rounded-bl-xl shadow-sm">
                  Most Popular
                </div>
              )}
              
              <div className="p-10 flex flex-col h-full">
                <h4 className={`text-xl font-bold mb-4 ${p.featured ? "text-blue-100" : "text-gray-500"}`}>
                  {p.name}
                </h4>
                <div className="text-5xl font-extrabold mb-8 flex items-end gap-1">
                  {p.price}
                  {p.price !== "Free" && <span className={`text-lg font-medium mb-1 ${p.featured ? "text-blue-200" : "text-gray-400"}`}>/mo</span>}
                </div>

                <ul className="space-y-5 mb-12 grow">
                  {p.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-3 text-base leading-tight"
                    >
                      <CheckIcon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${p.featured ? "text-blue-300" : "text-blue-600"}`} />
                      <span className={p.featured ? "text-blue-50" : "text-gray-600"}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/signup"
                  className={`py-4 px-6 rounded-xl text-center font-bold text-lg transition-all shadow-sm ${
                    p.featured
                      ? "bg-white text-blue-700 hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5"
                      : "bg-blue-50 text-blue-700 hover:bg-blue-100 hover:-translate-y-0.5"
                  }`}
                >
                  Join {p.name}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}