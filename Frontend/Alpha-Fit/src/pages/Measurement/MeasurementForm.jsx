import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import { LuUser, LuRuler, LuActivity, LuTarget, LuFlame, LuArrowRight, LuDumbbell } from "react-icons/lu";

const GENDER_OPTIONS = [
  { label: "MALE", value: "male" },
  { label: "FEMALE", value: "female" },
  { label: "OTHER", value: "other" },
  { label: "PRIVATE", value: "prefer_not_to_say" },
];

const ACTIVITY_OPTIONS = [
  { label: "SEDENTARY", value: "sedentary" },
  { label: "LIGHT", value: "light" },
  { label: "MODERATE", value: "moderate" },
  { label: "ACTIVE", value: "active" },
  { label: "EXTREME", value: "very_active" },
];

const GOAL_OPTIONS = [
  { label: "LOSE WEIGHT", value: "lose" },
  { label: "MAINTAIN", value: "maintain" },
  { label: "GAIN WEIGHT", value: "gain" },
];

const DIET_OPTIONS = [
  { label: "VEGETARIAN", value: "vegetarian" },
  { label: "NON-VEG", value: "non-vegetarian" },
  { label: "VEGAN", value: "vegan" },
  { label: "EGGETARIAN", value: "eggetarian" },
];

const RANGES = {
  age: { min: 10, max: 120, label: "10-120 YRS" },
  cm:  { min: 50, max: 250, label: "50-250 CM" },
  in:  { min: 20, max: 98,  label: "20-98 IN" },
  kg:  { min: 20, max: 250, label: "20-250 KG" },
  lb:  { min: 44, max: 550, label: "44-550 LB" },
};

export default function MeasurementForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    age: "", height: "", heightUnit: "cm", weight: "", weightUnit: "kg",
    gender: "", activityLevel: "", goal: "", dietaryPreferences: "",
  });
  
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const blockBadKeys = (e) => {
    if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (fieldErrors[name]) setFieldErrors({ ...fieldErrors, [name]: "" });
  };

  const toggleUnit = (key) => {
    const fieldToClear = key === 'heightUnit' ? 'height' : 'weight';
    setFormData(prev => ({
      ...prev,
      [key]: key === 'heightUnit' 
        ? (prev.heightUnit === 'cm' ? 'in' : 'cm') 
        : (prev.weightUnit === 'kg' ? 'lb' : 'kg')
    }));
    // Clear the error for that field specifically when unit changes
    setFieldErrors(prev => ({ ...prev, [fieldToClear]: "" }));
  };

  const bmi = useMemo(() => {
    let h = parseFloat(formData.height || "0");
    let w = parseFloat(formData.weight || "0");
    if (formData.heightUnit === "in") h *= 2.54;
    if (formData.weightUnit === "lb") w *= 0.453592;
    if (!h || !w) return "0.0";
    return (w / (h / 100) ** 2).toFixed(1);
  }, [formData.height, formData.heightUnit, formData.weight, formData.weightUnit]);

  const filledCount = [
    formData.age, formData.height, formData.weight,
    formData.gender, formData.activityLevel, formData.goal, formData.dietaryPreferences
  ].filter(v => v !== "").length;

  const progressPct = Math.round((filledCount / 7) * 100);

  const validate = () => {
    const errors = {};
    const age = parseInt(formData.age, 10);
    const h = parseFloat(formData.height);
    const w = parseFloat(formData.weight);

    const hRange = RANGES[formData.heightUnit];
    const wRange = RANGES[formData.weightUnit];

    if (!formData.age) errors.age = "AGE REQUIRED";
    else if (age < RANGES.age.min || age > RANGES.age.max) errors.age = `RANGE: ${RANGES.age.label}`;
    
    if (!formData.height) errors.height = "HEIGHT REQUIRED";
    else if (h < hRange.min || h > hRange.max) errors.height = `RANGE: ${hRange.label}`;
    
    if (!formData.weight) errors.weight = "WEIGHT REQUIRED";
    else if (w < wRange.min || w > wRange.max) errors.weight = `RANGE: ${wRange.label}`;

    if (!formData.gender) errors.gender = "GENDER REQUIRED";
    if (!formData.activityLevel) errors.activityLevel = "ACTIVITY REQUIRED";
    if (!formData.goal) errors.goal = "GOAL REQUIRED";
    if (!formData.dietaryPreferences) errors.dietaryPreferences = "DIET REQUIRED";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("CHECK PARAMETERS");
      return;
    }
    setLoading(true);
    let heightCm = parseFloat(formData.height);
    let weightKg = parseFloat(formData.weight);
    if (formData.heightUnit === "in") heightCm *= 2.54;
    if (formData.weightUnit === "lb") weightKg *= 0.453592;

    try {
      await axiosInstance.post("/measurements", {
        ...formData,
        height: heightCm,
        weight: weightKg,
      });
      
      toast.success("BIO-DATA SYNCED SUCCESSFULLY");
      setTimeout(() => navigate("/user/dashboard"), 1000);
    } catch (err) {
      toast.error(err?.response?.data?.message || "SYNC FAILED");
    } finally {
      setLoading(false);
    }
  };

  const ErrorLabel = ({ field }) =>
    fieldErrors[field] ? (
      <span className="text-xs font-semibold text-rose-500 mt-1 block animate-in slide-in-from-top-1">
        {fieldErrors[field]}
      </span>
    ) : null;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 relative font-sans selection:bg-blue-200 selection:text-blue-900">
      
      <div className="relative z-10 w-full max-w-4xl animate-in fade-in zoom-in-95 duration-500">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                <LuUser />
              </div>
              Fitness Profile
            </h2>
            <p className="text-sm font-semibold text-gray-500 mt-2 ml-1">Let's set up your biometric parameters</p>
          </div>
          
          <div className="w-full md:w-64 bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
            <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
              <span>Profile Setup</span>
              <span className="text-blue-600">{progressPct}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-700 ease-out rounded-full" 
                style={{ width: `${progressPct}%` }} 
              />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-3xl p-8 md:p-12 shadow-sm">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {/* AGE */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-500 tracking-wider flex items-center gap-2">
                <LuUser className="text-gray-400" /> Age
              </label>
              <input 
                type="number" 
                name="age" 
                value={formData.age} 
                onChange={handleChange} 
                onKeyDown={blockBadKeys} 
                placeholder="24" 
                className={`w-full bg-gray-50 border ${fieldErrors.age ? 'border-rose-300 focus:border-rose-500 ring-rose-100' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'} rounded-xl py-3 px-4 text-gray-900 outline-none font-semibold focus:ring-4 transition-all`} 
              />
              <ErrorLabel field="age" />
            </div>

            {/* HEIGHT */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-500 tracking-wider flex items-center gap-2">
                <LuRuler className="text-gray-400" /> Height
              </label>
              <div className="flex gap-3">
                <input 
                  type="number" 
                  name="height" 
                  value={formData.height} 
                  onChange={handleChange} 
                  placeholder="175" 
                  className={`flex-1 bg-gray-50 border ${fieldErrors.height ? 'border-rose-300 focus:border-rose-500 ring-rose-100' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'} rounded-xl py-3 px-4 text-gray-900 outline-none font-semibold focus:ring-4 transition-all`} 
                />
                <button 
                  type="button" 
                  onClick={() => toggleUnit('heightUnit')} 
                  className="bg-blue-50 text-blue-600 border border-blue-100 px-5 rounded-xl text-sm font-bold hover:bg-blue-600 hover:text-white transition-colors uppercase w-20 shrink-0 shadow-sm"
                >
                  {formData.heightUnit}
                </button>
              </div>
              <ErrorLabel field="height" />
            </div>

            {/* WEIGHT */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-500 tracking-wider flex items-center gap-2">
                <LuDumbbell className="text-gray-400" /> Weight
              </label>
              <div className="flex gap-3">
                <input 
                  type="number" 
                  name="weight" 
                  value={formData.weight} 
                  onChange={handleChange} 
                  placeholder="75" 
                  className={`flex-1 bg-gray-50 border ${fieldErrors.weight ? 'border-rose-300 focus:border-rose-500 ring-rose-100' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'} rounded-xl py-3 px-4 text-gray-900 outline-none font-semibold focus:ring-4 transition-all`} 
                />
                <button 
                  type="button" 
                  onClick={() => toggleUnit('weightUnit')} 
                  className="bg-blue-50 text-blue-600 border border-blue-100 px-5 rounded-xl text-sm font-bold hover:bg-blue-600 hover:text-white transition-colors uppercase w-20 shrink-0 shadow-sm"
                >
                  {formData.weightUnit}
                </button>
              </div>
              <ErrorLabel field="weight" />
            </div>

            {/* BMI PREVIEW */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-blue-500 tracking-wider flex items-center gap-2">
                <LuActivity /> BMI Index
              </label>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex justify-between items-center shadow-inner">
                <span className="text-4xl font-black text-blue-600">{bmi}</span>
                <div className="text-right text-[10px] font-bold text-blue-400 uppercase tracking-widest leading-relaxed">
                  <span>Auto-calculated</span><br/>
                  <span>Live Sync</span>
                </div>
              </div>
            </div>

            {/* GENDER */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-500 tracking-wider flex items-center gap-2">
                <LuUser className="text-gray-400" /> Gender
              </label>
              <select 
                name="gender" 
                value={formData.gender} 
                onChange={handleChange} 
                className={`w-full bg-gray-50 border ${fieldErrors.gender ? 'border-rose-300 focus:border-rose-500 ring-rose-100' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'} rounded-xl py-3 px-4 text-gray-900 outline-none font-semibold focus:ring-4 transition-all cursor-pointer appearance-none`}
              >
                <option value="" disabled hidden>Select Gender</option>
                {GENDER_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ErrorLabel field="gender" />
            </div>

            {/* ACTIVITY LEVEL */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-500 tracking-wider flex items-center gap-2">
                <LuActivity className="text-gray-400" /> Activity Level
              </label>
              <select 
                name="activityLevel" 
                value={formData.activityLevel} 
                onChange={handleChange} 
                className={`w-full bg-gray-50 border ${fieldErrors.activityLevel ? 'border-rose-300 focus:border-rose-500 ring-rose-100' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'} rounded-xl py-3 px-4 text-gray-900 outline-none font-semibold focus:ring-4 transition-all cursor-pointer appearance-none`}
              >
                <option value="" disabled hidden>Select Activity</option>
                {ACTIVITY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ErrorLabel field="activityLevel" />
            </div>

            {/* GOAL */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-500 tracking-wider flex items-center gap-2">
                <LuTarget className="text-gray-400" /> Goal
              </label>
              <select 
                name="goal" 
                value={formData.goal} 
                onChange={handleChange} 
                className={`w-full bg-gray-50 border ${fieldErrors.goal ? 'border-rose-300 focus:border-rose-500 ring-rose-100' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'} rounded-xl py-3 px-4 text-gray-900 outline-none font-semibold focus:ring-4 transition-all cursor-pointer appearance-none`}
              >
                <option value="" disabled hidden>Select Goal</option>
                {GOAL_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ErrorLabel field="goal" />
            </div>

            {/* DIET */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-500 tracking-wider flex items-center gap-2">
                <LuFlame className="text-gray-400" /> Diet Preference
              </label>
              <select 
                name="dietaryPreferences" 
                value={formData.dietaryPreferences} 
                onChange={handleChange} 
                className={`w-full bg-gray-50 border ${fieldErrors.dietaryPreferences ? 'border-rose-300 focus:border-rose-500 ring-rose-100' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'} rounded-xl py-3 px-4 text-gray-900 outline-none font-semibold focus:ring-4 transition-all cursor-pointer appearance-none`}
              >
                <option value="" disabled hidden>Select Diet</option>
                {DIET_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ErrorLabel field="dietaryPreferences" />
            </div>
          </div>

          <div className="mt-12">
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]"
            >
              {loading ? "Saving Profile..." : "Complete Profile Sync"}
              {!loading && <LuArrowRight className="text-xl" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// import React, { useState, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";

// const GENDER_OPTIONS = [
//   { label: "MALE", value: "male" },
//   { label: "FEMALE", value: "female" },
//   { label: "OTHER", value: "other" },
//   { label: "PRIVATE", value: "prefer_not_to_say" },
// ];

// const ACTIVITY_OPTIONS = [
//   { label: "SEDENTARY", value: "sedentary" },
//   { label: "LIGHT", value: "light" },
//   { label: "MODERATE", value: "moderate" },
//   { label: "ACTIVE", value: "active" },
//   { label: "EXTREME", value: "very_active" },
// ];

// const GOAL_OPTIONS = [
//   { label: "LOSE WEIGHT", value: "lose" },
//   { label: "MAINTAIN", value: "maintain" },
//   { label: "GAIN WEIGHT", value: "gain" },
// ];

// const DIET_OPTIONS = [
//   { label: "VEGETARIAN", value: "vegetarian" },
//   { label: "NON-VEG", value: "non-vegetarian" },
//   { label: "VEGAN", value: "vegan" },
//   { label: "EGGETARIAN", value: "eggetarian" },
// ];

// export default function MeasurementForm() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     age: "",
//     height: "",
//     heightUnit: "cm",
//     weight: "",
//     weightUnit: "kg",
//     gender: "",
//     activityLevel: "",
//     goal: "",
//     dietaryPreferences: "",
//   });
  
//   const [fieldErrors, setFieldErrors] = useState({});
//   const [loading, setLoading] = useState(false);

//   const blockBadKeys = (e) => {
//     if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//     if (fieldErrors[name]) setFieldErrors({ ...fieldErrors, [name]: "" });
//   };

//   // NEW: Toggle Function for Units
//   const toggleUnit = (key) => {
//     setFormData(prev => ({
//       ...prev,
//       [key]: key === 'heightUnit' 
//         ? (prev.heightUnit === 'cm' ? 'in' : 'cm') 
//         : (prev.weightUnit === 'kg' ? 'lb' : 'kg')
//     }));
//   };

//   const bmi = useMemo(() => {
//     let h = parseFloat(formData.height || "0");
//     let w = parseFloat(formData.weight || "0");
//     if (formData.heightUnit === "in") h *= 2.54;
//     if (formData.weightUnit === "lb") w *= 0.453592;
//     if (!h || !w) return "0.0";
//     return (w / (h / 100) ** 2).toFixed(1);
//   }, [formData.height, formData.heightUnit, formData.weight, formData.weightUnit]);

//   const filledCount = [
//     formData.age, formData.height, formData.weight,
//     formData.gender, formData.activityLevel, formData.goal, formData.dietaryPreferences
//   ].filter(v => v !== "").length;

//   const progressPct = Math.round((filledCount / 7) * 100);

//   const validate = () => {
//     const errors = {};
//     const age = parseInt(formData.age, 10);
//     let h = parseFloat(formData.height);
//     let w = parseFloat(formData.weight);
//     if (formData.heightUnit === "in") h *= 2.54;
//     if (formData.weightUnit === "lb") w *= 0.453592;

//     if (!formData.age) errors.age = "AGE REQUIRED";
//     else if (age < 10 || age > 120) errors.age = "RANGE: 10-120 YRS";
//     if (!formData.height) errors.height = "HEIGHT REQUIRED";
//     else if (h < 50 || h > 250) errors.height = "OUT OF RANGE";
//     if (!formData.weight) errors.weight = "WEIGHT REQUIRED";
//     else if (w < 20 || w > 300) errors.weight = "OUT OF RANGE";
//     if (!formData.gender) errors.gender = "GENDER REQUIRED";
//     if (!formData.activityLevel) errors.activityLevel = "ACTIVITY REQUIRED";
//     if (!formData.goal) errors.goal = "GOAL REQUIRED";
//     if (!formData.dietaryPreferences) errors.dietaryPreferences = "DIET REQUIRED";

//     setFieldErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) {
//       toast.error("CHECK PARAMETERS");
//       return;
//     }
//     setLoading(true);
//     let heightCm = parseFloat(formData.height);
//     let weightKg = parseFloat(formData.weight);
//     if (formData.heightUnit === "in") heightCm *= 2.54;
//     if (formData.weightUnit === "lb") weightKg *= 0.453592;

//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch("http://localhost:8000/api/measurements", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ ...formData, height: heightCm, weight: weightKg }),
//       });
//       if (response.ok) {
//         toast.success("BIO-DATA SYNCED");
//         setTimeout(() => navigate("/"), 1000);
//       } else {
//         const data = await response.json();
//         toast.error(data.message || "SYNC FAILED");
//       }
//     } catch (err) {
//       toast.error("CONNECTION ERROR");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const ErrorLabel = ({ field }) => fieldErrors[field] ? (
//     <span className="text-[9px] font-black text-rose-500 animate-pulse mt-1 block tracking-tighter uppercase">
//       {`// ERR: ${fieldErrors[field]}`}
//     </span>
//   ) : null;

//   return (
//     <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 relative font-sans overflow-x-hidden selection:bg-rose-500 selection:text-white">
//       {/* Background Grid */}
//       <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
//            style={{ backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
//       <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-900/10 blur-[150px] rounded-full" />
      
//       <div className="relative z-10 w-full max-w-4xl">
//         <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
//           <div className="text-left">
//              <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">
//               Physical <span className="text-rose-600">Parameters</span>
//             </h2>
//             <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.4em] mt-2">Biometric Profile Analysis</p>
//           </div>
//           <div className="w-full md:w-72 bg-neutral-900 border border-white/10 p-4">
//             <div className="flex justify-between text-[9px] font-black text-white/60 uppercase tracking-widest mb-2">
//               <span>SYNC PROGRESS</span>
//               <span className="text-rose-500">{progressPct}%</span>
//             </div>
//             <div className="h-1 bg-white/5 overflow-hidden"><div className="h-full bg-rose-600 transition-all duration-700" style={{ width: `${progressPct}%` }} /></div>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className="bg-neutral-900/80 border border-white/10 p-8 md:p-12 relative shadow-2xl backdrop-blur-sm">
//           <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-rose-600" />
//           <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-rose-600" />

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
//             {/* Age */}
//             <div className="space-y-1 border-b border-white/5 pb-2">
//               <label className="text-[10px] font-black uppercase tracking-widest text-rose-500">Subject Age</label>
//               <input type="number" name="age" value={formData.age} onChange={handleChange} onKeyDown={blockBadKeys} placeholder="24" 
//                 className={`w-full bg-transparent py-2 text-white outline-none font-bold uppercase ${fieldErrors.age ? 'text-rose-500' : ''}`} />
//               <ErrorLabel field="age" />
//             </div>

//             {/* Height with Click Toggle */}
//             <div className="space-y-1 border-b border-white/5 pb-2">
//               <label className="text-[10px] font-black uppercase tracking-widest text-rose-500">Vertical Stature</label>
//               <div className="flex gap-4 items-center">
//                 <input type="number" name="height" value={formData.height} onChange={handleChange} placeholder="175" className="flex-1 bg-transparent py-2 text-white outline-none font-bold" />
//                 <button 
//                   type="button"
//                   onClick={() => toggleUnit('heightUnit')}
//                   className="bg-white/5 border border-white/10 px-4 py-1 text-[10px] font-black text-rose-500 hover:bg-rose-600 hover:text-white transition-all uppercase italic"
//                 >
//                   {formData.heightUnit}
//                 </button>
//               </div>
//               <ErrorLabel field="height" />
//             </div>

//             {/* Weight with Click Toggle */}
//             <div className="space-y-1 border-b border-white/5 pb-2">
//               <label className="text-[10px] font-black uppercase tracking-widest text-rose-500">Mass Displacement</label>
//               <div className="flex gap-4 items-center">
//                 <input type="number" name="weight" value={formData.weight} onChange={handleChange} placeholder="75" className="flex-1 bg-transparent py-2 text-white outline-none font-bold" />
//                 <button 
//                   type="button"
//                   onClick={() => toggleUnit('weightUnit')}
//                   className="bg-white/5 border border-white/10 px-4 py-1 text-[10px] font-black text-rose-500 hover:bg-rose-600 hover:text-white transition-all uppercase italic"
//                 >
//                   {formData.weightUnit}
//                 </button>
//               </div>
//               <ErrorLabel field="weight" />
//             </div>

//             {/* BMI Preview */}
//             <div className="space-y-2">
//               <label className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Calculated Index (BMI)</label>
//               <div className="bg-black/50 border border-white/5 p-4 flex justify-between items-center group">
//                 <span className="text-3xl font-black italic text-white group-hover:text-cyan-400 transition-colors">{bmi}</span>
//                 <div className="text-right leading-tight tracking-widest"><span className="text-[8px] text-white/30 block">DIAGNOSTIC DATA</span><span className="text-[8px] text-white/30 block">SYNC: LIVE</span></div>
//               </div>
//             </div>

//             {/* Dropdowns */}
//             {[
//               { label: "GENETIC GENDER", name: "gender", options: GENDER_OPTIONS },
//               { label: "KINETIC OUTPUT", name: "activityLevel", options: ACTIVITY_OPTIONS },
//               { label: "OBJECTIVE PROTOCOL", name: "goal", options: GOAL_OPTIONS },
//               { label: "FUEL PREFERENCE", name: "dietaryPreferences", options: DIET_OPTIONS }
//             ].map((s) => (
//               <div key={s.name} className="space-y-1 border-b border-white/5 pb-2">
//                 <label className="text-[10px] font-black uppercase tracking-widest text-rose-500">{s.label}</label>
//                 <select name={s.name} value={formData[s.name]} onChange={handleChange} className="w-full bg-transparent py-2 text-white outline-none font-bold uppercase cursor-pointer">
//                   <option value="" className="bg-neutral-900">SELECT DATA</option>
//                   {s.options.map(o => <option key={o.value} value={o.value} className="bg-neutral-900">{o.label}</option>)}
//                 </select>
//                 <ErrorLabel field={s.name} />
//               </div>
//             ))}
//           </div>

//           <button type="submit" disabled={loading} className="w-full mt-12 group relative py-6 bg-rose-600 text-white font-black uppercase tracking-[0.3em] italic overflow-hidden transition-all hover:bg-white hover:text-black disabled:opacity-50">
//             <span className="relative z-10 uppercase">{loading ? "INITIALIZING SYNC..." : "SYNC BIOMETRIC DATA"}</span>
//             <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// import React, { useState, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";

// const GENDER_OPTIONS = [
//   { label: "MALE", value: "male" },
//   { label: "FEMALE", value: "female" },
//   { label: "OTHER", value: "other" },
//   { label: "PRIVATE", value: "prefer_not_to_say" },
// ];

// const ACTIVITY_OPTIONS = [
//   { label: "SEDENTARY", value: "sedentary" },
//   { label: "LIGHT", value: "light" },
//   { label: "MODERATE", value: "moderate" },
//   { label: "ACTIVE", value: "active" },
//   { label: "EXTREME", value: "very_active" },
// ];

// const GOAL_OPTIONS = [
//   { label: "LOSE WEIGHT", value: "lose" },
//   { label: "MAINTAIN", value: "maintain" },
//   { label: "GAIN WEIGHT", value: "gain" },
// ];

// const DIET_OPTIONS = [
//   { label: "VEGETARIAN", value: "vegetarian" },
//   { label: "NON-VEG", value: "non-vegetarian" },
//   { label: "VEGAN", value: "vegan" },
//   { label: "EGGETARIAN", value: "eggetarian" },
// ];

// export default function MeasurementForm() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     age: "",
//     height: "",
//     heightUnit: "cm",
//     weight: "",
//     weightUnit: "kg",
//     gender: "",
//     activityLevel: "",
//     goal: "",
//     dietaryPreferences: "",
//   });
  
//   // NEW: Field-specific error state
//   const [fieldErrors, setFieldErrors] = useState({});
//   const [loading, setLoading] = useState(false);

//   const blockBadKeys = (e) => {
//     if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//     // Clear error for a field once the user starts typing again
//     if (fieldErrors[name]) {
//       setFieldErrors({ ...fieldErrors, [name]: "" });
//     }
//   };

//   const bmi = useMemo(() => {
//     let h = parseFloat(formData.height || "0");
//     let w = parseFloat(formData.weight || "0");
//     if (formData.heightUnit === "in") h = h * 2.54;
//     if (formData.weightUnit === "lb") w = w * 0.453592;
//     if (!h || !w) return "0.0";
//     return (w / (h / 100) ** 2).toFixed(1);
//   }, [formData.height, formData.heightUnit, formData.weight, formData.weightUnit]);

//   const filledCount = [
//     formData.age, formData.height, formData.weight,
//     formData.gender, formData.activityLevel, formData.goal, formData.dietaryPreferences
//   ].filter(v => v !== "").length;

//   const progressPct = Math.round((filledCount / 7) * 100);

//   const validate = () => {
//     const errors = {};
//     const age = parseInt(formData.age, 10);
//     let h = parseFloat(formData.height);
//     let w = parseFloat(formData.weight);

//     if (formData.heightUnit === "in") h *= 2.54;
//     if (formData.weightUnit === "lb") w *= 0.453592;

//     if (!formData.age) errors.age = "AGE REQUIRED";
//     else if (age < 10 || age > 120) errors.age = "RANGE: 10-120 YRS";

//     if (!formData.height) errors.height = "HEIGHT REQUIRED";
//     else if (h < 50 || h > 250) errors.height = "RANGE: 50-250 CM";

//     if (!formData.weight) errors.weight = "WEIGHT REQUIRED";
//     else if (w < 20 || w > 300) errors.weight = "RANGE: 20-300 KG";

//     if (!formData.gender) errors.gender = "GENDER REQUIRED";
//     if (!formData.activityLevel) errors.activityLevel = "ACTIVITY LEVEL REQUIRED";
//     if (!formData.goal) errors.goal = "GOAL REQUIRED";
//     if (!formData.dietaryPreferences) errors.dietaryPreferences = "DIET PREFERENCE REQUIRED";

//     setFieldErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) {
//       toast.error("SYSTEM ALERT: CHECK PARAMETERS");
//       return;
//     }

//     setLoading(true);
//     let heightCm = parseFloat(formData.height);
//     let weightKg = parseFloat(formData.weight);
//     if (formData.heightUnit === "in") heightCm *= 2.54;
//     if (formData.weightUnit === "lb") weightKg *= 0.453592;

//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch("http://localhost:8000/api/measurements", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ ...formData, height: heightCm, weight: weightKg }),
//       });

//       if (response.ok) {
//         toast.success("BIO-DATA SYNCED SUCCESSFULLY");
//         setTimeout(() => navigate("/"), 1000);
//       } else {
//         const data = await response.json();
//         toast.error(data.message || "SYNC FAILED");
//       }
//     } catch (err) {
//       toast.error("CONNECTION ERROR");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Helper component for error display
//   const ErrorLabel = ({ field }) => fieldErrors[field] ? (
//     <span className="text-[9px] font-black text-rose-500 animate-pulse mt-1 block tracking-tighter">
//       {`// ERR: ${fieldErrors[field]}`}
//     </span>
//   ) : null;

//   return (
//     <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 relative font-sans overflow-x-hidden">
//       <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
//            style={{ backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
//       <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-900/10 blur-[150px] rounded-full" />
      
//       <div className="relative z-10 w-full max-w-4xl">
//         <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
//           <div className="text-left">
//              <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">
//               Physical <span className="text-rose-600">Parameters</span>
//             </h2>
//             <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.4em] mt-2">Biometric Profile Analysis</p>
//           </div>
//           <div className="w-full md:w-72 bg-neutral-900 border border-white/10 p-4">
//             <div className="flex justify-between text-[9px] font-black text-white/60 uppercase tracking-widest mb-2">
//               <span>SYNC PROGRESS</span>
//               <span className="text-rose-500">{progressPct}%</span>
//             </div>
//             <div className="h-1 bg-white/5 overflow-hidden"><div className="h-full bg-rose-600 transition-all duration-700" style={{ width: `${progressPct}%` }} /></div>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className="bg-neutral-900/80 border border-white/10 p-8 md:p-12 relative shadow-2xl backdrop-blur-sm">
//           <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-rose-600" />
//           <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-rose-600" />

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
//             {/* Age */}
//             <div className="space-y-1 border-b border-white/5 pb-2">
//               <label className="text-[10px] font-black uppercase tracking-widest text-rose-500">Subject Age</label>
//               <input type="number" name="age" value={formData.age} onChange={handleChange} onKeyDown={blockBadKeys} placeholder="24" 
//                 className={`w-full bg-transparent py-2 text-white outline-none font-bold uppercase ${fieldErrors.age ? 'text-rose-500' : ''}`} />
//               <ErrorLabel field="age" />
//             </div>

//             {/* Height */}
//             <div className="space-y-1 border-b border-white/5 pb-2">
//               <label className="text-[10px] font-black uppercase tracking-widest text-rose-500">Vertical Stature</label>
//               <div className="flex gap-2">
//                 <input type="number" name="height" value={formData.height} onChange={handleChange} placeholder="175" className="flex-1 bg-transparent py-2 text-white outline-none font-bold" />
//                 <select name="heightUnit" value={formData.heightUnit} onChange={handleChange} className="bg-black text-[10px] font-black text-rose-500 outline-none uppercase">
//                   <option value="cm">CM</option><option value="in">IN</option>
//                 </select>
//               </div>
//               <ErrorLabel field="height" />
//             </div>

//             {/* Weight */}
//             <div className="space-y-1 border-b border-white/5 pb-2">
//               <label className="text-[10px] font-black uppercase tracking-widest text-rose-500">Mass Displacement</label>
//               <div className="flex gap-2">
//                 <input type="number" name="weight" value={formData.weight} onChange={handleChange} placeholder="75" className="flex-1 bg-transparent py-2 text-white outline-none font-bold" />
//                 <select name="weightUnit" value={formData.weightUnit} onChange={handleChange} className="bg-black text-[10px] font-black text-rose-500 outline-none uppercase">
//                   <option value="kg">KG</option><option value="lb">LB</option>
//                 </select>
//               </div>
//               <ErrorLabel field="weight" />
//             </div>

//             {/* BMI Preview */}
//             <div className="space-y-2">
//               <label className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Calculated Index (BMI)</label>
//               <div className="bg-black/50 border border-white/5 p-4 flex justify-between items-center">
//                 <span className="text-3xl font-black italic text-white">{bmi}</span>
//                 <div className="text-right leading-tight"><span className="text-[8px] text-white/30 block tracking-widest">DIAGNOSTIC DATA</span><span className="text-[8px] text-white/30 block">SYNC: LIVE</span></div>
//               </div>
//             </div>

//             {/* Dropdowns */}
//             {[
//               { label: "GENETIC GENDER", name: "gender", options: GENDER_OPTIONS },
//               { label: "KINETIC OUTPUT", name: "activityLevel", options: ACTIVITY_OPTIONS },
//               { label: "OBJECTIVE PROTOCOL", name: "goal", options: GOAL_OPTIONS },
//               { label: "FUEL PREFERENCE", name: "dietaryPreferences", options: DIET_OPTIONS }
//             ].map((s) => (
//               <div key={s.name} className="space-y-1 border-b border-white/5 pb-2">
//                 <label className="text-[10px] font-black uppercase tracking-widest text-rose-500">{s.label}</label>
//                 <select name={s.name} value={formData[s.name]} onChange={handleChange} className="w-full bg-transparent py-2 text-white outline-none font-bold uppercase">
//                   <option value="" className="bg-neutral-900">UNSPECIFIED</option>
//                   {s.options.map(o => <option key={o.value} value={o.value} className="bg-neutral-900">{o.label}</option>)}
//                 </select>
//                 <ErrorLabel field={s.name} />
//               </div>
//             ))}
//           </div>

//           <button type="submit" disabled={loading} className="w-full mt-12 group relative py-6 bg-rose-600 text-white font-black uppercase tracking-[0.3em] italic overflow-hidden transition-all hover:bg-white hover:text-black disabled:opacity-50">
//             <span className="relative z-10 uppercase">{loading ? "SYNCING..." : "SYNC BIOMETRIC DATA"}</span>
//             <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// import React, { useState, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";

// const GENDER_OPTIONS = [
//   { label: "MALE", value: "male" },
//   { label: "FEMALE", value: "female" },
//   { label: "OTHER", value: "other" },
//   { label: "PRIVATE", value: "prefer_not_to_say" },
// ];

// const ACTIVITY_OPTIONS = [
//   { label: "SEDENTARY", value: "sedentary" },
//   { label: "LIGHT", value: "light" },
//   { label: "MODERATE", value: "moderate" },
//   { label: "ACTIVE", value: "active" },
//   { label: "EXTREME", value: "very_active" },
// ];

// const GOAL_OPTIONS = [
//   { label: "LOSE WEIGHT", value: "lose" },
//   { label: "MAINTAIN", value: "maintain" },
//   { label: "GAIN WEIGHT", value: "gain" },
// ];

// const DIET_OPTIONS = [
//   { label: "VEGETARIAN", value: "vegetarian" },
//   { label: "NON-VEG", value: "non-vegetarian" },
//   { label: "VEGAN", value: "vegan" },
//   { label: "EGGETARIAN", value: "eggetarian" },
// ];

// export default function MeasurementForm() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     age: "",
//     height: "",
//     heightUnit: "cm",
//     weight: "",
//     weightUnit: "kg",
//     gender: "",
//     activityLevel: "",
//     goal: "",
//     dietaryPreferences: "",
//   });
//   const [error, setError] = useState("");

//   const blockBadKeys = (e) => {
//     if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const bmi = useMemo(() => {
//     let h = parseFloat(formData.height || "0");
//     let w = parseFloat(formData.weight || "0");
//     if (formData.heightUnit === "in") h = h * 2.54;
//     if (formData.weightUnit === "lb") w = w * 0.453592;
//     if (!h || !w) return "0.0";
//     return (w / (h / 100) ** 2).toFixed(1);
//   }, [formData.height, formData.heightUnit, formData.weight, formData.weightUnit]);

//   // FIX: Exclude units from count and only check the 7 primary fields
//   const filledCount = [
//     formData.age,
//     formData.height,
//     formData.weight,
//     formData.gender,
//     formData.activityLevel,
//     formData.goal,
//     formData.dietaryPreferences,
//   ].filter(v => v !== "").length;

//   const progressPct = Math.round((filledCount / 7) * 100);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     let heightCm = parseFloat(formData.height);
//     let weightKg = parseFloat(formData.weight);
//     if (formData.heightUnit === "in") heightCm = heightCm * 2.54;
//     if (formData.weightUnit === "lb") weightKg = weightKg * 0.453592;

//     const age = parseInt(formData.age, 10);
//     if (age < 10 || age > 120) return setError("AGE MUST BE 10-120");
//     if (heightCm < 50 || heightCm > 250) return setError("HEIGHT OUT OF RANGE");
//     if (weightKg < 20 || weightKg > 200) return setError("WEIGHT OUT OF RANGE");
//     if (!formData.gender || !formData.activityLevel || !formData.goal || !formData.dietaryPreferences) {
//       return setError("ALL PARAMETERS REQUIRED");
//     }

//     const dataToSend = { ...formData, height: heightCm, weight: weightKg };

//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch("http://localhost:8000/api/measurements", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(dataToSend),
//       });

//       if (response.ok) {
//         toast.success("BIO-DATA SYNCED SUCCESSFULLY");
//         setTimeout(() => navigate("/"), 1000);
//       } else {
//         const data = await response.json().catch(() => ({}));
//         setError(data.message || "SYNC FAILED");
//       }
//     } catch (err) {
//       setError("SYSTEM ERROR: UNABLE TO CONNECT");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 relative font-sans overflow-x-hidden">
//       <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
//            style={{ backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
//       <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-900/10 blur-[150px] rounded-full" />
//       <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-900/10 blur-[150px] rounded-full" />

//       <div className="relative z-10 w-full max-w-4xl">
//         <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
//           <div className="text-left">
//              <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">
//               Physical <span className="text-rose-600">Parameters</span>
//             </h2>
//             <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.4em] mt-2">Biometric Profile Analysis</p>
//           </div>
          
//           <div className="w-full md:w-72 bg-neutral-900 border border-white/10 p-4">
//             <div className="flex justify-between text-[9px] font-black text-white/60 uppercase tracking-widest mb-2">
//               <span>SYNC PROGRESS</span>
//               <span className="text-rose-500">{progressPct}%</span>
//             </div>
//             <div className="h-1 bg-white/5 overflow-hidden">
//               <div 
//                 className="h-full bg-rose-600 transition-all duration-700 ease-out"
//                 style={{ width: `${progressPct}%` }}
//               />
//             </div>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className="bg-neutral-900/80 border border-white/10 p-8 md:p-12 relative shadow-2xl backdrop-blur-sm">
//           <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-rose-600" />
//           <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-rose-600" />

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
//             <div className="space-y-2 border-b border-white/5 pb-2">
//               <label className="text-[10px] font-black uppercase tracking-widest text-rose-500">Subject Age</label>
//               <input type="number" name="age" value={formData.age} onChange={handleChange} onKeyDown={blockBadKeys} placeholder="24" className="w-full bg-transparent py-2 text-white outline-none placeholder:text-white/5 font-bold uppercase" />
//             </div>

//             <div className="space-y-2 border-b border-white/5 pb-2">
//               <label className="text-[10px] font-black uppercase tracking-widest text-rose-500">Vertical Stature</label>
//               <div className="flex gap-2">
//                 <input type="number" name="height" value={formData.height} onChange={handleChange} onKeyDown={blockBadKeys} placeholder="175" className="flex-1 bg-transparent py-2 text-white outline-none placeholder:text-white/5 font-bold" />
//                 <select name="heightUnit" value={formData.heightUnit} onChange={handleChange} className="bg-black text-[10px] font-black text-rose-500 outline-none uppercase cursor-pointer">
//                   <option value="cm">CM</option>
//                   <option value="in">IN</option>
//                 </select>
//               </div>
//             </div>

//             <div className="space-y-2 border-b border-white/5 pb-2">
//               <label className="text-[10px] font-black uppercase tracking-widest text-rose-500">Mass Displacement</label>
//               <div className="flex gap-2">
//                 <input type="number" name="weight" value={formData.weight} onChange={handleChange} onKeyDown={blockBadKeys} placeholder="75" className="flex-1 bg-transparent py-2 text-white outline-none placeholder:text-white/5 font-bold" />
//                 <select name="weightUnit" value={formData.weightUnit} onChange={handleChange} className="bg-black text-[10px] font-black text-rose-500 outline-none uppercase cursor-pointer">
//                   <option value="kg">KG</option>
//                   <option value="lb">LB</option>
//                 </select>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <label className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Calculated Index (BMI)</label>
//               <div className="bg-black/50 border border-white/5 p-4 flex justify-between items-center">
//                 <span className="text-3xl font-black italic text-white">{bmi}</span>
//                 <div className="text-right">
//                   <span className="text-[8px] text-white/30 block">DIAGNOSTIC DATA</span>
//                   <span className="text-[8px] text-white/30 block">SYNC: LIVE</span>
//                 </div>
//               </div>
//             </div>

//             {[
//               { label: "GENETIC GENDER", name: "gender", options: GENDER_OPTIONS },
//               { label: "KINETIC OUTPUT", name: "activityLevel", options: ACTIVITY_OPTIONS },
//               { label: "OBJECTIVE PROTOCOL", name: "goal", options: GOAL_OPTIONS },
//               { label: "FUEL PREFERENCE", name: "dietaryPreferences", options: DIET_OPTIONS }
//             ].map((select) => (
//               <div key={select.name} className="space-y-2 border-b border-white/5 pb-2">
//                 <label className="text-[10px] font-black uppercase tracking-widest text-rose-500">{select.label}</label>
//                 <select name={select.name} value={formData[select.name]} onChange={handleChange} className="w-full bg-transparent py-2 text-white outline-none font-bold uppercase cursor-pointer">
//                   <option value="" className="bg-neutral-900 text-white/20">UNSPECIFIED</option>
//                   {select.options.map((o) => (
//                     <option key={o.value} value={o.value} className="bg-neutral-900 text-white">{o.label}</option>
//                   ))}
//                 </select>
//               </div>
//             ))}
//           </div>

//           <button type="submit" className="w-full mt-12 group relative py-6 bg-rose-600 text-white font-black uppercase tracking-[0.3em] italic overflow-hidden hover:bg-white hover:text-black transition-all">
//             <span className="relative z-10">SYNC BIOMETRIC DATA</span>
//             <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// import React, { useState, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";

// const GENDER_OPTIONS = [
//   { label: "MALE", value: "male" },
//   { label: "FEMALE", value: "female" },
//   { label: "OTHER", value: "other" },
//   { label: "PRIVATE", value: "prefer_not_to_say" },
// ];

// const ACTIVITY_OPTIONS = [
//   { label: "SEDENTARY", value: "sedentary" },
//   { label: "LIGHT", value: "light" },
//   { label: "MODERATE", value: "moderate" },
//   { label: "ACTIVE", value: "active" },
//   { label: "EXTREME", value: "very_active" },
// ];

// const GOAL_OPTIONS = [
//   { label: "LOSE WEIGHT", value: "lose" },
//   { label: "MAINTAIN", value: "maintain" },
//   { label: "GAIN WEIGHT", value: "gain" },
// ];

// const DIET_OPTIONS = [
//   { label: "VEGETARIAN", value: "vegetarian" },
//   { label: "NON-VEG", value: "non-vegetarian" },
//   { label: "VEGAN", value: "vegan" },
//   { label: "EGGETARIAN", value: "eggetarian" },
// ];

// export default function MeasurementForm() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     age: "",
//     height: "",
//     heightUnit: "cm",
//     weight: "",
//     weightUnit: "kg",
//     gender: "",
//     activityLevel: "",
//     goal: "",
//     dietaryPreferences: "",
//   });
//   const [error, setError] = useState("");

//   const blockBadKeys = (e) => {
//     if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const bmi = useMemo(() => {
//     let h = parseFloat(formData.height || "0");
//     let w = parseFloat(formData.weight || "0");
//     if (formData.heightUnit === "in") h = h * 2.54;
//     if (formData.weightUnit === "lb") w = w * 0.453592;
//     if (!h || !w) return "0.0";
//     return (w / (h / 100) ** 2).toFixed(1);
//   }, [formData.height, formData.heightUnit, formData.weight, formData.weightUnit]);

//   const filledCount = Object.values(formData).filter(v => v !== "").length;
//   const progressPct = Math.round((filledCount / 9) * 100);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     let heightCm = parseFloat(formData.height);
//     let weightKg = parseFloat(formData.weight);
//     if (formData.heightUnit === "in") heightCm = heightCm * 2.54;
//     if (formData.weightUnit === "lb") weightKg = weightKg * 0.453592;

//     const age = parseInt(formData.age, 10);
//     if (age < 10 || age > 120) return setError("AGE MUST BE 10-120");
//     if (heightCm < 50 || heightCm > 250) return setError("HEIGHT OUT OF RANGE");
//     if (weightKg < 20 || weightKg > 200) return setError("WEIGHT OUT OF RANGE");
//     if (!formData.gender || !formData.activityLevel || !formData.goal || !formData.dietaryPreferences) {
//       return setError("ALL PARAMETERS REQUIRED");
//     }

//     const dataToSend = { ...formData, height: heightCm, weight: weightKg };

//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch("http://localhost:8000/api/measurements", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(dataToSend),
//       });

//       if (response.ok) {
//         toast.success("BIO-DATA SYNCED SUCCESSFULLY");
//         setTimeout(() => navigate("/"), 1000);
//       } else {
//         const data = await response.json().catch(() => ({}));
//         setError(data.message || "SYNC FAILED");
//       }
//     } catch (err) {
//       setError("SYSTEM ERROR: UNABLE TO CONNECT");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 relative font-sans overflow-x-hidden">
//       {/* Static Industrial Background Styling */}
//       <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
//            style={{ backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
//       <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-900/10 blur-[150px] rounded-full" />
//       <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-900/10 blur-[150px] rounded-full" />

//       <div className="relative z-10 w-full max-w-4xl">
//         {/* Header Section */}
//         <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
//           <div className="text-left">
//              <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">
//               Physical <span className="text-rose-600">Parameters</span>
//             </h2>
//             <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.4em] mt-2">Biometric Profile Analysis</p>
//           </div>
          
//           <div className="w-full md:w-72 bg-neutral-900 border border-white/10 p-4">
//             <div className="flex justify-between text-[9px] font-black text-white/60 uppercase tracking-widest mb-2">
//               <span>SYNC PROGRESS</span>
//               <span className="text-rose-500">{progressPct}%</span>
//             </div>
//             <div className="h-1 bg-white/5 overflow-hidden">
//               <div 
//                 className="h-full bg-rose-600 transition-all duration-700 ease-out"
//                 style={{ width: `${progressPct}%` }}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Form Container */}
//         <form onSubmit={handleSubmit} className="bg-neutral-900/80 border border-white/10 p-8 md:p-12 relative shadow-2xl backdrop-blur-sm">
//           {/* Visual Accents */}
//           <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-rose-600" />
//           <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-rose-600" />

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            
//             {/* Age */}
//             <div className="space-y-2 border-b border-white/5 pb-2">
//               <label className="text-[10px] font-black uppercase tracking-widest text-rose-500">Subject Age</label>
//               <input
//                 type="number"
//                 name="age"
//                 value={formData.age}
//                 onChange={handleChange}
//                 onKeyDown={blockBadKeys}
//                 placeholder="24"
//                 className="w-full bg-transparent py-2 text-white outline-none placeholder:text-white/5 font-bold uppercase"
//               />
//             </div>

//             {/* Height */}
//             <div className="space-y-2 border-b border-white/5 pb-2">
//               <label className="text-[10px] font-black uppercase tracking-widest text-rose-500">Vertical Stature</label>
//               <div className="flex gap-2">
//                 <input
//                   type="number"
//                   name="height"
//                   value={formData.height}
//                   onChange={handleChange}
//                   onKeyDown={blockBadKeys}
//                   placeholder="175"
//                   className="flex-1 bg-transparent py-2 text-white outline-none placeholder:text-white/5 font-bold"
//                 />
//                 <select name="heightUnit" value={formData.heightUnit} onChange={handleChange} className="bg-black text-[10px] font-black text-rose-500 outline-none uppercase cursor-pointer">
//                   <option value="cm">CM</option>
//                   <option value="in">IN</option>
//                 </select>
//               </div>
//             </div>

//             {/* Weight */}
//             <div className="space-y-2 border-b border-white/5 pb-2">
//               <label className="text-[10px] font-black uppercase tracking-widest text-rose-500">Mass Displacement</label>
//               <div className="flex gap-2">
//                 <input
//                   type="number"
//                   name="weight"
//                   value={formData.weight}
//                   onChange={handleChange}
//                   onKeyDown={blockBadKeys}
//                   placeholder="75"
//                   className="flex-1 bg-transparent py-2 text-white outline-none placeholder:text-white/5 font-bold"
//                 />
//                 <select name="weightUnit" value={formData.weightUnit} onChange={handleChange} className="bg-black text-[10px] font-black text-rose-500 outline-none uppercase cursor-pointer">
//                   <option value="kg">KG</option>
//                   <option value="lb">LB</option>
//                 </select>
//               </div>
//             </div>

//             {/* BMI Preview (Technical Look) */}
//             <div className="space-y-2">
//               <label className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Calculated Index (BMI)</label>
//               <div className="bg-black/50 border border-white/5 p-4 flex justify-between items-center group">
//                 <span className="text-3xl font-black italic text-white group-hover:text-cyan-400 transition-colors">{bmi}</span>
//                 <div className="text-right">
//                   <span className="text-[8px] text-white/30 block leading-tight">DIAGNOSTIC DATA</span>
//                   <span className="text-[8px] text-white/30 block leading-tight">SYNC STATUS: LIVE</span>
//                 </div>
//               </div>
//             </div>

//             {/* Custom Selectors Mapping */}
//             {[
//               { label: "GENETIC GENDER", name: "gender", options: GENDER_OPTIONS },
//               { label: "KINETIC OUTPUT", name: "activityLevel", options: ACTIVITY_OPTIONS },
//               { label: "OBJECTIVE PROTOCOL", name: "goal", options: GOAL_OPTIONS },
//               { label: "FUEL PREFERENCE", name: "dietaryPreferences", options: DIET_OPTIONS }
//             ].map((select) => (
//               <div key={select.name} className="space-y-2 border-b border-white/5 pb-2">
//                 <label className="text-[10px] font-black uppercase tracking-widest text-rose-500">{select.label}</label>
//                 <select
//                   name={select.name}
//                   value={formData[select.name]}
//                   onChange={handleChange}
//                   className="w-full bg-transparent py-2 text-white outline-none font-bold uppercase cursor-pointer"
//                 >
//                   <option value="" className="bg-neutral-900 text-white/20 italic">UNSPECIFIED</option>
//                   {select.options.map((o) => (
//                     <option key={o.value} value={o.value} className="bg-neutral-900 text-white">{o.label}</option>
//                   ))}
//                 </select>
//               </div>
//             ))}
//           </div>

//           {/* System Alerts */}
//           {error && (
//             <div className="mt-12 bg-rose-600/10 border border-rose-600/50 p-4 text-rose-500 text-[10px] font-black uppercase tracking-widest text-center animate-pulse">
//               [ ALERT: {error} ]
//             </div>
//           )}

//           {/* Action Button */}
//           <button
//             type="submit"
//             className="w-full mt-12 group relative py-6 bg-rose-600 text-white font-black uppercase tracking-[0.3em] italic overflow-hidden transition-all hover:bg-white hover:text-black"
//           >
//             <span className="relative z-10">SYNC BIOMETRIC DATA</span>
//             <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }


// import React, { useState, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";

// const GENDER_OPTIONS = [
//   { label: "Male", value: "male" },
//   { label: "Female", value: "female" },
//   { label: "Other", value: "other" },
//   { label: "Prefer not to say", value: "prefer_not_to_say" },
// ];

// const ACTIVITY_OPTIONS = [
//   { label: "Sedentary", value: "sedentary" },
//   { label: "Light", value: "light" },
//   { label: "Moderate", value: "moderate" },
//   { label: "Active", value: "active" },
//   { label: "Very Active", value: "very_active" },
// ];

// const GOAL_OPTIONS = [
//   { label: "Lose Weight", value: "lose" },
//   { label: "Maintain Weight", value: "maintain" },
//   { label: "Gain Weight", value: "gain" },
// ];

// const DIET_OPTIONS = [
//   { label: "Vegetarian", value: "vegetarian" },
//   { label: "Non-Vegetarian", value: "non-vegetarian" },
//   { label: "Vegan", value: "vegan" },
//   { label: "Eggetarian", value: "eggetarian" },
// ];

// export default function MeasurementForm() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     age: "",
//     height: "",
//     heightUnit: "cm",
//     weight: "",
//     weightUnit: "kg",
//     gender: "",
//     activityLevel: "",
//     goal: "",
//     dietaryPreferences: "",
//   });
//   const [error, setError] = useState("");

//   const blockBadKeys = (e) => {
//     if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const bmi = useMemo(() => {
//     let h = parseFloat(formData.height || "0");
//     let w = parseFloat(formData.weight || "0");

//     // Convert inches to cm if needed
//     if (formData.heightUnit === "in") h = h * 2.54;
//     if (formData.weightUnit === "lb") w = w * 0.453592;

//     if (!h || !w) return "-";
//     return (w / (h / 100) ** 2).toFixed(1);
//   }, [
//     formData.height,
//     formData.heightUnit,
//     formData.weight,
//     formData.weightUnit,
//   ]);

//   const filledCount = [
//     formData.age,
//     formData.height,
//     formData.weight,
//     formData.gender,
//     formData.activityLevel,
//     formData.goal,
//     formData.dietaryPreferences,
//   ].filter(Boolean).length;

//   const progressPct = Math.round((filledCount / 7) * 100);

//   // Gradient colors based on percentage
//   const progressColor =
//     progressPct < 40
//       ? "from-red-400 to-red-600"
//       : progressPct < 70
//       ? "from-yellow-400 to-yellow-600"
//       : "from-green-400 to-green-600";

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     let heightCm = parseFloat(formData.height);
//     let weightKg = parseFloat(formData.weight);

//     // Convert if needed
//     if (formData.heightUnit === "in") heightCm = heightCm * 2.54;
//     if (formData.weightUnit === "lb") weightKg = weightKg * 0.453592;

//     // Validation
//     const age = parseInt(formData.age, 10);
//     if (age < 10 || age > 120) {
//       return setError("Age must be 10-120 years");
//     }
//     if (formData.heightUnit === "cm" && (heightCm < 50 || heightCm > 250)) {
//       return setError("Height must be between 50-250 cm");
//     }
//     if (formData.heightUnit === "in" && (heightCm < 50 || heightCm > 250)) {
//       return setError("Height must be between ~19.7-98.4 inches");
//     }

//     if (formData.weightUnit === "kg" && (weightKg < 20 || weightKg > 200)) {
//       return setError("Weight must be between 20-200 kg");
//     }
//     if (formData.weightUnit === "lb" && (weightKg < 20 || weightKg > 200)) {
//       return setError("Weight must be between ~44-440 lbs");
//     }

//     if (!formData.gender) 
//       return setError("Please select a gender");

//     if (!formData.activityLevel)
//       return setError("Please select activity level");

//     if (!formData.goal) 
//       return setError("Please select goal");

//     if (!formData.dietaryPreferences)
//       return setError("Please select dietary preference");

//     const dataToSend = {
//     ...formData,
//     height: heightCm,      // converted value
//     weight: weightKg,      // converted value
//   };

//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch("http://localhost:8000/api/measurements", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(dataToSend),
//       });

//       if (response.ok) {
//         toast.success("Fitness profile saved successfully!");       
//         setTimeout(() => navigate("/"), 1000);
//       } else {
//         const data = await response.json().catch(() => ({}));
//         setError(data.message || "Failed to save measurement");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Something went wrong!");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-cyan-50">
//       <form
//         onSubmit={handleSubmit}
//         className="w-full max-w-4xl bg-white/40 backdrop-blur-md border border-white/30 rounded-3xl shadow-xl p-8 md:p-12 space-y-6"
//       >
//         {/* Header */}
//         <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
//           <div>
//             <h2 className="text-3xl font-extrabold text-gray-900">
//               Fitness Profile
//             </h2>
//             <p className="text-gray-700">
//               Complete details to personalize fitness plans
//             </p>
//           </div>
//           <div className="w-full md:w-64">
//             <div className="flex justify-between text-xs font-medium text-gray-600 mb-1">
//               <span>Profile completeness</span>
//               <span>{progressPct}%</span>
//             </div>
//             <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
//               <div
//                 className={`h-full bg-gradient-to-r ${progressColor} transition-all duration-500`}
//                 style={{ width: `${progressPct}%` }}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Form Fields */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-baseline">
//           <label className="md:col-span-1 font-semibold text-gray-800">
//             Age
//           </label>
//           <input
//             type="number"
//             name="age"
//             value={formData.age}
//             onChange={handleChange}
//             onKeyDown={blockBadKeys}
//             min={10}
//             max={120}
//             placeholder="e.g., 24"
//             className="md:col-span-2 rounded-xl border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-pink-400"
//             required
//           />

//           <label className="md:col-span-1 font-semibold text-gray-800">
//             Height
//           </label>
//           <div className="md:col-span-2 flex gap-3">
//             <input
//               type="number"
//               name="height"
//               value={formData.height}
//               onChange={handleChange}
//               onKeyDown={blockBadKeys}
//               min={10}
//               max={250}
//               placeholder="e.g., 175"
//               className="flex-1 rounded-xl border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-pink-400"
//               required
//             />
//             <select
//               name="heightUnit"
//               value={formData.heightUnit}
//               onChange={handleChange}
//               className="rounded-xl border border-gray-300 px-3 outline-none focus:ring-2 focus:ring-pink-400"
//             >
//               <option value="cm">cm</option>
//               <option value="in">in</option>
//             </select>
//           </div>

//           <label className="md:col-span-1 font-semibold text-gray-800">
//             Weight
//           </label>
//           <div className="md:col-span-2 flex gap-3">
//             <input
//               type="number"
//               name="weight"
//               value={formData.weight}
//               onChange={handleChange}
//               onKeyDown={blockBadKeys}
//               min={10}
//               max={500}
//               placeholder="e.g., 70"
//               className="flex-1 rounded-xl border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-pink-400"
//               required
//             />
//             <select
//               name="weightUnit"
//               value={formData.weightUnit}
//               onChange={handleChange}
//               className="rounded-xl border border-gray-300 px-3 outline-none focus:ring-2 focus:ring-pink-400"
//             >
//               <option value="kg">kg</option>
//               <option value="lb">lb</option>
//             </select>
//           </div>

//           <label className="md:col-span-1 font-semibold text-gray-800">
//             Gender
//           </label>
//           <select
//             name="gender"
//             value={formData.gender}
//             onChange={handleChange}
//             className="md:col-span-2 rounded-xl border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-pink-400"
//             required
//           >
//             <option value="">Select Gender</option>
//             {GENDER_OPTIONS.map((g) => (
//               <option key={g.value} value={g.value}>
//                 {g.label}
//               </option>
//             ))}
//           </select>

//           <label className="md:col-span-1 font-semibold text-gray-800">
//             Activity Level
//           </label>
//           <select
//             name="activityLevel"
//             value={formData.activityLevel}
//             onChange={handleChange}
//             className="md:col-span-2 rounded-xl border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-pink-400"
//             required
//           >
//             <option value="">Select Activity Level</option>
//             {ACTIVITY_OPTIONS.map((a) => (
//               <option key={a.value} value={a.value}>
//                 {a.label}
//               </option>
//             ))}
//           </select>

//           <label className="md:col-span-1 font-semibold text-gray-800">
//             Goal
//           </label>
//           <select
//             name="goal"
//             value={formData.goal}
//             onChange={handleChange}
//             className="md:col-span-2 rounded-xl border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-pink-400"
//             required
//           >
//             <option value="">Select Goal</option>
//             {GOAL_OPTIONS.map((g) => (
//               <option key={g.value} value={g.value}>
//                 {g.label}
//               </option>
//             ))}
//           </select>

//           <label className="md:col-span-1 font-semibold text-gray-800">
//             Dietary Preference
//           </label>
//           <select
//             name="dietaryPreferences"
//             value={formData.dietaryPreferences}
//             onChange={handleChange}
//             className="md:col-span-2 rounded-xl border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-pink-400"
//             required
//           >
//             <option value="">Select Dietary Preference</option>
//             {DIET_OPTIONS.map((d) => (
//               <option key={d.value} value={d.value}>
//                 {d.label}
//               </option>
//             ))}
//           </select>

//           {/* BMI Preview */}
//           <label className="md:col-span-1 font-semibold text-gray-800">
//             BMI Preview
//           </label>
//           <div className="md:col-span-2 rounded-xl border border-gray-200 bg-white/30 p-3 text-gray-700">
//             <p>
//               BMI: <span className="font-semibold">{bmi}</span>
//             </p>
//             <p className="text-xs text-gray-500">
//               BMI is an estimate; athletes may have higher values.
//             </p>
//           </div>

//           {/* Error */}
//           {error && (
//             <div className="md:col-span-3 rounded-xl border border-red-300 bg-red-50 text-red-700 p-3">
//               {error}
//             </div>
//           )}
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold py-3 rounded-full shadow-lg hover:shadow-xl transition"
//         >
//           Save Profile
//         </button>
//       </form>
//     </div>
//   );
// }
