import React, { useState } from 'react';
import { Award, Info, ChevronDown, ChevronUp, CheckCircle, ShieldCheck } from 'lucide-react';

export const ProductScoreCard = ({ product }) => {
  const [showFormulaDetails, setShowFormulaDetails] = useState(false);

  if (!product || typeof product.discoveryScore !== 'number') return null;

  const score = product.discoveryScore;
  const breakdown = product.discoveryScoreBreakdown || {};

  // Color scheme based on score tier
  const getScoreTheme = (s) => {
    if (s >= 85) return { bg: 'bg-emerald-50/70', border: 'border-emerald-200', text: 'text-emerald-700', badge: 'Exceptional Value', badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    if (s >= 75) return { bg: 'bg-blue-50/70', border: 'border-blue-200', text: 'text-blue-700', badge: 'High Match', badgeBg: 'bg-blue-100 text-blue-800 border-blue-300' };
    if (s >= 65) return { bg: 'bg-amber-50/70', border: 'border-amber-200', text: 'text-amber-700', badge: 'Solid Quality', badgeBg: 'bg-amber-100 text-amber-800 border-amber-300' };
    return { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700', badge: 'Standard Spec', badgeBg: 'bg-slate-100 text-slate-800 border-slate-300' };
  };

  const theme = getScoreTheme(score);

  const metrics = [
    { label: 'Customer Rating', value: breakdown.ratingScore ?? 70, weight: '30%' },
    { label: 'Price Value', value: breakdown.priceScore ?? 70, weight: '25%' },
    { label: 'Availability', value: breakdown.availabilityScore ?? 80, weight: '20%' },
    { label: 'Spec Depth', value: breakdown.specScore ?? 60, weight: '15%' },
    { label: 'Seller Trust', value: breakdown.sellerScore ?? 70, weight: '10%' }
  ];

  return (
    <div className={`rounded-2xl p-5 border ${theme.border} ${theme.bg} shadow-2xs space-y-4 font-sans`}>
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs text-blue-600">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              Aryan Discovery Score
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${theme.badgeBg}`}>
                {theme.badge}
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Algorithmic hardware discovery & spec suitability index
            </p>
          </div>
        </div>

        {/* Big Score Display */}
        <div className="text-right">
          <div className="flex items-baseline justify-end gap-1">
            <span className={`text-3xl font-black ${theme.text}`}>{score}</span>
            <span className="text-xs text-slate-500 font-semibold">/100</span>
          </div>
        </div>
      </div>

      {/* Human-Readable Explanation */}
      {product.discoveryExplanation && (
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs text-xs text-slate-700 leading-relaxed flex items-start gap-2.5">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <span className="font-medium">{product.discoveryExplanation}</span>
        </div>
      )}

      {/* Breakdown Progress Bars */}
      <div className="space-y-2.5 pt-2 border-t border-slate-200/80">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {metrics.map((m) => (
            <div key={m.label} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600 font-medium">{m.label} <span className="text-slate-400">({m.weight})</span></span>
                <span className="text-slate-900 font-bold">{m.value}%</span>
              </div>
              <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${m.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Methodology Accordion */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowFormulaDetails(!showFormulaDetails)}
          className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 font-medium transition-colors"
        >
          <Info className="w-3.5 h-3.5 text-blue-600" />
          <span>Transparency & Methodology</span>
          {showFormulaDetails ? <ChevronUp className="w-3.5 h-3.5 ml-1" /> : <ChevronDown className="w-3.5 h-3.5 ml-1" />}
        </button>

        {showFormulaDetails && (
          <div className="mt-2.5 p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs text-xs text-slate-600 space-y-2 leading-relaxed">
            <p>
              <strong className="text-slate-900 font-semibold">Internal Discovery Formula:</strong> Weighted combination of customer ratings (30%), price value vs category median (25%), verified availability (20%), specification depth (15%), and seller ecosystem quality (10%).
            </p>
            <p className="text-slate-400 text-[11px] italic">
              Notice: This score is calculated by the Aryan Electronics discovery algorithm to assist product evaluation and does not represent an endorsement from the device manufacturer. Missing attributes use neutral baseline imputation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductScoreCard;
