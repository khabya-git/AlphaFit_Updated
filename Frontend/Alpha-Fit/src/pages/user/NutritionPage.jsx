import React, { useState, useEffect, useCallback } from "react";
import Papa from "papaparse";
import axios from "axios";
import axiosInstance from "../../utils/axiosInstance";
import { 
  LuSearch, LuPlus, LuX, LuLoader, 
  LuUtensilsCrossed, LuFlame, LuDumbbell 
} from "react-icons/lu";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const cleanFoodName = (name) => {
  if (!name) return "";
  return name.replace(/\s*\([^)]*\)/g, '').trim();
};

const extractBaseUnit = (name) => {
  const match = name?.match(/\(([^)]+)\)/);
  return match ? match[1] : "1 serving / unit";
};

const getEstimatedWeight = (name) => {
  const n = (name || "").toLowerCase();
  
  if (n.includes("100g") || n.includes("grams")) return null;
  
  // Specific Overrides
  if (n.includes("poha")) return "~100g";
  if (n.includes("biryani")) return "~250g";
  if (n.includes("pizza") || n.includes("slice")) return "~40g";
  if (n.includes("burger")) return "~150g";
  if (n.includes("sandwich")) return "~120g";
  
  // Generic matchers
  if (n.includes("cup")) return "~150g";
  if (n.includes("serving")) return "~200g";
  if (n.includes("piece") || n.includes("pc")) return "~50g";
  if (n.includes("glass")) return "~250ml";
  if (n.includes("tbsp")) return "~15g";
  if (n.includes("tsp")) return "~5g";
  
  if (!name.includes("(")) return "~100g"; // Assumed default serving
  
  return null;
};

export default function NutritionPage() {
  const navigate= useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [localFoods, setLocalFoods] = useState([]);
  const [addingFood, setAddingFood] = useState(false);

  // Modal State for Quantity
  const [selectedFoodForQuantity, setSelectedFoodForQuantity] = useState(null);
  const [quantityInput, setQuantityInput] = useState(1);

  // 01. DATABASE INITIALIZATION

  useEffect(() => {
  const fetchFoods = async () => {
    try {
      const response = await axiosInstance.get("/food");
      setLocalFoods(response.data.data);
      setSearchResults(response.data.data.slice(0, 15));
    } catch (error) {
      console.error(error);
      toast.error("Failed to load food database");
    }
  };

  fetchFoods();
}, []);

  const categories = ["all", "Protein", "Carbs", "Vegetables", "Fruits", "Dairy", "Snacks", "Beverages"];

  // 02. LINEAR SEARCH LOGIC
  const handleSearch = useCallback((query, category) => {
    setIsSearching(true);
    setTimeout(() => {
      let filtered = localFoods;

      if (category !== "all") {
        filtered = filtered.filter(f => {
          if (f.category && f.category !== "Other") return f.category === category;
          
          // Fallback Auto Classifier since DB defaults to "Other"
          const n = (f.name || "").toLowerCase();
          if (category === "Fruits" && (n.includes("banana") || n.includes("apple") || n.includes("mango") || n.includes("orange") || n.includes("grapes") || n.includes("papaya") || n.includes("pineapple") || n.includes("watermelon") || n.includes("kiwi") || n.includes("guava") || n.includes("pear") || n.includes("cherry") || n.includes("strawberry") || n.includes("blueberry") || n.includes("pomegranate"))) return true;
          if (category === "Beverages" && (n.includes("tea") || n.includes("coffee") || n.includes("lassi") || n.includes("milk"))) return true;
          if (category === "Dairy" && (n.includes("paneer") || n.includes("milk") || n.includes("doi") || n.includes("shrikhand") || n.includes("kheer") || n.includes("kulfi") || n.includes("sandesh") || n.includes("rasmalai"))) return true;
          if (category === "Vegetables" && (n.includes("salad") || n.includes("tomato") || n.includes("onion") || n.includes("bhindi") || n.includes("gobi") || n.includes("chana") || n.includes("rajma") || n.includes("sprouts"))) return true;
          if (category === "Snacks" && (n.includes("chips") || n.includes("samosa") || n.includes("bhel") || n.includes("puri") || n.includes("tikki") || n.includes("roll") || n.includes("frankie") || n.includes("dabeli") || n.includes("momos") || n.includes("chaat"))) return true;
          if (category === "Protein" && (f.protein >= 15 || n.includes("chicken") || n.includes("egg") || n.includes("fish") || n.includes("beef") || n.includes("mutton") || n.includes("soya") || n.includes("dal") || n.includes("paneer"))) return true;
          if (category === "Carbs" && ((f.carbs && f.carbs >= 30) || n.includes("rice") || n.includes("chapati") || n.includes("roti") || n.includes("naan") || n.includes("dosa") || n.includes("idli") || n.includes("oats") || n.includes("maggi") || n.includes("chowmein") || n.includes("pav") || n.includes("kulcha") || n.includes("bhature") || n.includes("poha") || n.includes("upma") || n.includes("biryani"))) return true;
          
          return false;
        });
      }

      if (query.trim().length >= 2) {
        filtered = filtered.filter((food) => {
          const name = (food.name || "").toLowerCase();
          return name.includes(query.toLowerCase());
        });
      }

      // Dynamic Sorting based on category
      if (category === "Protein") {
        filtered.sort((a, b) => (b.protein || 0) - (a.protein || 0));
      } else if (category === "Carbs") {
        filtered.sort((a, b) => (b.carbs || 0) - (a.carbs || 0));
      } else {
        // Sort alphabetically for others
        filtered.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      }

      setSearchResults(filtered.slice(0, 50));  
      setIsSearching(false);
    }, 300);
  }, [localFoods]);

  const handlePrepareAdd = (food) => {
    setSelectedFoodForQuantity(food);
    setQuantityInput(1);
  };

  const handleConfirmAdd = async () => {
    if (!selectedFoodForQuantity || quantityInput <= 0) return;
    try {
      setAddingFood(true);
      const food = selectedFoodForQuantity;
      const qty = Number(quantityInput);

      await axiosInstance.post("/dashboard/nutrition", {
        foodId: food._id,
        quantity: qty,
      });

      toast.success(`Logged ${qty}x ${food.name}!`);
      
      // Close modal
      setSelectedFoodForQuantity(null);
      setQuantityInput(1);

    } catch (error) {
      console.error("Nutrition Add Error:", error);
      toast.error(error?.response?.data?.message || "Failed to log food");
    } finally {
      setAddingFood(false);
    }
  };

  useEffect(() => {
    handleSearch(searchQuery, selectedCategory);
  }, [searchQuery, selectedCategory, handleSearch]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 h-full flex flex-col relative font-sans overflow-hidden animate-in fade-in duration-500">
      
      {/* 01. HEADER */}
      <div className="mb-8 border-b border-gray-100 pb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <LuUtensilsCrossed />
          </div>
          Food Diary
        </h1>
        <p className="text-sm font-medium text-gray-500 mt-2">
          Search and log your meals for today.
        </p>
      </div>

      <div className="space-y-6 flex-1 flex flex-col">
        {/* CATEGORY FILTER */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide py-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 text-xs font-bold capitalize rounded-full whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* SEARCH INPUT */}
        <div className="relative">
          <LuSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for foods..."
            className="w-full pl-14 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-sm"
          />
        </div>

        {/* 04. DATA READOUTS */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
          {isSearching ? (
            <div className="py-20 flex flex-col items-center">
              <LuLoader className="w-8 h-8 animate-spin mb-4 text-blue-600" />
              <p className="text-sm font-bold text-gray-500">Searching...</p>
            </div>
          ) : searchResults.length > 0 ? (
            searchResults.map((food, index) => (
              <div key={index} className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between group shadow-xs hover:shadow-md hover:border-blue-100 transition-all">
                
                {/* DISPLAY */}
                <div className="flex-1 flex flex-col md:flex-row md:items-center gap-3 md:gap-8">
                  <div className="w-48 truncate">
                    <h3 className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition-colors truncate">
                      {cleanFoodName(food.name)}
                    </h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5 tracking-wider">
                       {extractBaseUnit(food.name)} {getEstimatedWeight(food.name) && `(${getEstimatedWeight(food.name)})`}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 md:border-l md:border-gray-100 md:pl-6">
                    {/* CALORIES */}
                    <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                      <LuFlame size={14} className="text-orange-500" />
                      <span className="text-xs font-bold text-gray-700">{food.calories}<span className="text-[10px] text-gray-500 ml-0.5 font-medium">kcal</span></span>
                    </div>

                    {/* PROTEIN */}
                    <div className="flex items-center gap-1.5 bg-green-50 px-2 py-1 rounded-md">
                      <LuDumbbell size={14} className="text-green-600" />
                      <span className="text-xs font-bold text-green-700">{food.protein}<span className="text-[10px] text-green-600/70 ml-0.5 font-medium">g</span></span>
                    </div>

                    {/* FATS */}
                    <div className="flex items-center gap-1.5 bg-yellow-50 px-2 py-1 rounded-md">
                      <div className="text-[10px] font-black text-yellow-600 leading-none">F</div>
                      <span className="text-xs font-bold text-yellow-700">{food.fats }<span className="text-[10px] text-yellow-600/70 ml-0.5 font-medium">g</span></span>
                    </div>

                    {/* CARBS */}
                    <div className="flex items-center gap-1.5 bg-blue-50 px-2 py-1 rounded-md">
                      <div className="text-[10px] font-black text-blue-600 leading-none">C</div>
                      <span className="text-xs font-bold text-blue-700">{food.carbs}<span className="text-[10px] text-blue-600/70 ml-0.5 font-medium">g</span></span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handlePrepareAdd(food)}
                  disabled={addingFood}
                  className="mt-4 md:mt-0 md:ml-4 p-3 rounded-lg bg-gray-50 text-gray-500 hover:bg-blue-600 hover:text-white transition-all group shrink-0 border border-gray-100 hover:border-blue-600 shadow-xs"
                >
                  <LuPlus className="group-hover:scale-110 transition-transform w-5 h-5" />
                </button>
              </div>
            ))
          ) : (
             <div className="py-20 text-center text-gray-400">
               <div className="bg-gray-50 p-6 rounded-full inline-block mb-4">
                 <LuUtensilsCrossed className="w-8 h-8 text-gray-300" />
               </div>
               <p className="text-sm font-semibold">No foods found.</p>
               <p className="text-xs mt-1">Try searching for something else.</p>
             </div>
          )}
        </div>
      </div>

      {/* QUANTITY OVERLAY MODAL */}
      {selectedFoodForQuantity && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white shadow-2xl rounded-2xl p-6 sm:p-8 max-w-sm w-full relative">
            <button
              onClick={() => setSelectedFoodForQuantity(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors"
            >
              <LuX className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-extrabold text-gray-900 mb-1 pr-8">
              {cleanFoodName(selectedFoodForQuantity.name)}
            </h2>
            <p className="text-xs font-semibold text-gray-500 mb-6 flex items-center gap-2">
              Base: {extractBaseUnit(selectedFoodForQuantity.name)}
              {getEstimatedWeight(selectedFoodForQuantity.name) && (
                <span className="bg-gray-50 border border-gray-100 text-gray-400 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide">
                  {getEstimatedWeight(selectedFoodForQuantity.name)}
                </span>
              )}
            </p>
            
            {/* Dynamic macros preview */}
            <div className="grid grid-cols-4 gap-3 mb-8">
              <div className="text-center bg-gray-50 rounded-xl p-3 border border-gray-100">
                <p className="text-[10px] font-bold text-gray-500 mb-1 uppercase">CAL</p>
                <p className="text-base font-black text-gray-900">{Math.round(selectedFoodForQuantity.calories * (quantityInput || 0))}</p>
              </div>
              <div className="text-center bg-gray-50 rounded-xl p-3 border border-gray-100">
                <p className="text-[10px] font-bold text-gray-500 mb-1 uppercase">PRO</p>
                <p className="text-base font-black text-gray-900">{Math.round(selectedFoodForQuantity.protein * (quantityInput || 0))}g</p>
              </div>
              <div className="text-center bg-gray-50 rounded-xl p-3 border border-gray-100">
                <p className="text-[10px] font-bold text-gray-500 mb-1 uppercase">CRB</p>
                <p className="text-base font-black text-gray-900">{Math.round(selectedFoodForQuantity.carbs * (quantityInput || 0))}g</p>
              </div>
              <div className="text-center bg-gray-50 rounded-xl p-3 border border-gray-100">
                <p className="text-[10px] font-bold text-gray-500 mb-1 uppercase">FAT</p>
                <p className="text-base font-black text-gray-900">{Math.round(selectedFoodForQuantity.fats * (quantityInput || 0))}g</p>
              </div>
            </div>

            <div className="mb-8">
              <label className="text-sm font-bold text-gray-700 mb-2 block">
                Quantity
              </label>
              <div className="flex bg-gray-50 border border-gray-200 rounded-xl overflow-hidden focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500 transition-all">
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={quantityInput}
                  onChange={(e) => setQuantityInput(e.target.value === "" ? "" : parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-transparent text-gray-900 font-bold px-4 py-3.5 focus:outline-none text-lg"
                />
                <div className="flex items-center px-5 bg-gray-100 border-l border-gray-200 text-sm font-extrabold text-blue-700 whitespace-nowrap select-none">
                  × {extractBaseUnit(selectedFoodForQuantity.name)}
                </div>
              </div>
            </div>
            <button
              onClick={handleConfirmAdd}
              disabled={addingFood}
              className="w-full bg-blue-600 text-white font-bold p-4 rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/30 flex justify-center items-center gap-2"
            >
              {addingFood ? <LuLoader className="animate-spin w-5 h-5" /> : <LuPlus className="w-5 h-5" />}
              {addingFood ? "Logging..." : "Log to Diary"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}