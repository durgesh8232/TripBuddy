import React, { useState, useEffect } from "react";
import { 
  Luggage, 
  CheckCircle2, 
  Circle, 
  RotateCcw, 
  CheckCheck, 
  Sparkles 
} from "lucide-react";

export default function PackingChecklist({ packingList }) {
  const [checkedItems, setCheckedItems] = useState({});

  // Reset checked state when a new itinerary packingList is loaded
  useEffect(() => {
    setCheckedItems({});
  }, [packingList]);

  if (!packingList || packingList.length === 0) return null;

  // Flatten all items to compute total counts
  const allItems = packingList.flatMap((cat) =>
    (cat.items || []).map((item) => `${cat.category_name}:::${item}`)
  );

  const totalCount = allItems.length;
  const packedCount = Object.values(checkedItems).filter(Boolean).length;
  const progressPercent = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0;

  const toggleItem = (categoryName, item) => {
    const key = `${categoryName}:::${item}`;
    setCheckedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleCheckAll = () => {
    const allChecked = {};
    allItems.forEach((key) => {
      allChecked[key] = true;
    });
    setCheckedItems(allChecked);
  };

  const handleResetAll = () => {
    setCheckedItems({});
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
      {/* Header and Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <Luggage className="w-3.5 h-3.5" /> Smart Luggage Assistant
          </span>
          <h3 className="text-lg font-bold text-white mt-1">Interactive Packing Checklist</h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCheckAll}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white text-xs font-semibold transition"
          >
            <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Check All</span>
          </button>

          <button
            type="button"
            onClick={handleResetAll}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white text-xs font-semibold transition"
          >
            <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Progress Meter Bar */}
      <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Packing Progress</span>
          </span>
          <span className="font-bold text-emerald-400">
            {packedCount} of {totalCount} packed ({progressPercent}%)
          </span>
        </div>

        {/* Outer bar track */}
        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {progressPercent === 100 && (
          <p className="text-[11px] text-emerald-400 font-semibold pt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> All packed and ready for your adventure!
          </p>
        )}
      </div>

      {/* Categorized Checklist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {packingList.map((category, catIdx) => {
          const catItems = category.items || [];
          const catPackedCount = catItems.filter(
            (item) => checkedItems[`${category.category_name}:::${item}`]
          ).length;

          return (
            <div
              key={catIdx}
              className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/80 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  {category.category_name}
                </h4>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
                  {catPackedCount}/{catItems.length}
                </span>
              </div>

              <ul className="space-y-1.5">
                {catItems.map((item, itemIdx) => {
                  const key = `${category.category_name}:::${item}`;
                  const isChecked = !!checkedItems[key];

                  return (
                    <li
                      key={itemIdx}
                      onClick={() => toggleItem(category.category_name, item)}
                      className={`flex items-start gap-2.5 p-2 rounded-xl cursor-pointer select-none transition ${
                        isChecked
                          ? "bg-emerald-500/10 text-slate-400"
                          : "hover:bg-slate-900 text-slate-200"
                      }`}
                    >
                      <button
                        type="button"
                        className="mt-0.5 text-emerald-400 shrink-0 focus:outline-none"
                      >
                        {isChecked ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-500/20" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-600 hover:text-slate-400" />
                        )}
                      </button>

                      <span
                        className={`text-xs leading-snug transition ${
                          isChecked ? "line-through text-slate-500" : ""
                        }`}
                      >
                        {item}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}