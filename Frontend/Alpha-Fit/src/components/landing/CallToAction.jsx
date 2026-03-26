import { Link } from "react-router-dom";

export default function CallToAction() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Dynamic colorful background */}
      <div className="absolute inset-0 bg-linear-to-br from-indigo-900 via-blue-800 to-blue-900" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/30 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-500/30 blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 max-w-4xl relative z-10 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
          Ready to transform your life?
        </h2>
        <p className="text-xl text-blue-100 mb-10 leading-relaxed font-medium">
          Whether you want to lose weight, build muscle, or simply live healthier — AlphaFit provides the tools, insights, and motivation to get you there.
        </p>

        <Link
          to="/signup"
          className="inline-block bg-white text-blue-700 px-12 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
        >
          Create Free Account
        </Link>
        <p className="mt-6 text-sm text-blue-200 uppercase tracking-widest font-semibold font-sans">
          No credit card required
        </p>
      </div>
    </section>
  );
}