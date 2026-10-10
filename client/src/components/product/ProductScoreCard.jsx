import React, { useState } from 'react';
import { Award, Info, ChevronDown, ChevronUp, CheckCircle, ShieldCheck } from 'lucide-react';

export const ProductScoreCard = ({ product }) => {
  const [showFormulaDetails, setShowFormulaDetails] = useState(false);

  if (!product || typeof product.discoveryScore !== 'number') return null;

  const score = product.discoveryScore;
  const breakdown = product.discoveryScoreBreakdown || {};

  // Color scheme based on score tier
  const getScoreTheme = (s) => {
    if (s >= 85) return { bg: 'from-emerald-500/20 to-teal-500/20', border: 'border-emerald-500/40', text: 'text-emerald-400', badge: 'Exceptional Value' };
    if (s >= 75) return { bg: 'from-cyan-500/20 to-blue-500/20', border: 'border-cyan-500/40', text: 'text-cyan-400', badge: 'High Match' };
    if (s >= 65) return { bg: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-500/40', text: 'text-amber-400', badge: 'Solid Quality' };
    return { bg: 'from-slate-800/40 to-slate-900/40', border: 'border-slate-700', text: 'text-slate-300', badge: 'Standard Spec' };
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
    <div className={`rounded-2xl p-5 border bg-gradient-to-br ${theme.bg} ${theme.border} space-y-4 backdrop-blur-md`}>
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800 text-cyan-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              Aryan Discovery Score
              <span className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full border ${theme.border} ${theme.text}`}>
                {theme.badge}
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">
              Algorithmic hardware discovery & spec suitability index
            </p>
          </div>
        </div>

        {/* Big Score Display */}
        <div className="text-right">
          <div className="flex items-baseline justify-end gap-1 font-mono">
            <span className={`text-3xl font-black ${theme.text}`}>{score}</span>
            <span className="text-xs text-slate-500 font-medium">/100</span>
          </div>
        </div>
      </div>

      {/* Human-Readable Explanation */}
      {product.discoveryExplanation && (
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 leading-relaxed flex items-start gap-2 font-sans">
          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <span>{product.discoveryExplanation}</span>
        </div>
      )}

      {/* Breakdown Progress Bars */}
      <div className="space-y-2 pt-1 border-t border-slate-800/60">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          {metrics.map((m) => (
            <div key={m.label} className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>{m.label} <span className="text-slate-600">({m.weight})</span></span>
                <span className="text-slate-200 font-bold">{m.value}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-brand-500 rounded-full transition-all duration-500"
                  style={{ width: `${m.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Methodology Accordion */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => setShowFormulaDetails(!showFormulaDetails)}
          className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 font-mono transition-colors"
        >
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span>Transparency & Methodology</span>
          {showFormulaDetails ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
        </button>

        {showFormulaDetails && (
          <div className="mt-2.5 p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-[11px] text-slate-400 space-y-1.5 leading-relaxed font-sans">
            <p>
              <strong className="text-white">Internal Discovery Formula:</strong> Weighted combination of customer ratings (30%), price value vs category median (25%), verified availability (20%), specification depth (15%), and seller ecosystem quality (10%).
            </p>
            <p className="text-slate-500 italic">
              Notice: This score is calculated by the Aryan Electronics discovery algorithm to assist product evaluation and does not represent an endorsement from the device manufacturer. Missing attributes use neutral baseline imputation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductScoreCard;
