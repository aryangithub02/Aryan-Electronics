import React from 'react';
import { Tag, TrendingDown, ExternalLink, ShieldCheck, DollarSign } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const PriceInsightsCard = ({ priceInsights, productTitle }) => {
  if (!priceInsights || !priceInsights.lowestPrice) return null;

  const {
    hasComparison,
    sellerCount,
    lowestPrice,
    highestPrice,
    averagePrice,
    priceDifference,
    percentageSavings,
    bestSeller
  } = priceInsights;

  return (
    <div className="rounded-2xl bg-white p-5 border border-slate-200/90 shadow-2xs space-y-4 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              Price Comparison Insights
              {hasComparison && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {sellerCount} Sellers Analyzed
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-500">
              Live market spread and potential savings
            </p>
          </div>
        </div>

        {percentageSavings > 0 && (
          <div className="text-right">
            <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-2xs">
              Save up to {percentageSavings}%
            </span>
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs">
        <div>
          <span className="text-xs text-slate-500 font-medium block mb-0.5">Lowest Offer</span>
          <span className="text-sm sm:text-base font-bold text-emerald-700">
            {formatCurrency(lowestPrice)}
          </span>
        </div>
        <div className="border-x border-slate-200">
          <span className="text-xs text-slate-500 font-medium block mb-0.5">Market Average</span>
          <span className="text-sm sm:text-base font-bold text-slate-900">
            {formatCurrency(averagePrice)}
          </span>
        </div>
        <div>
          <span className="text-xs text-slate-500 font-medium block mb-0.5">Highest Offer</span>
          <span className="text-sm sm:text-base font-bold text-rose-600">
            {formatCurrency(highestPrice)}
          </span>
        </div>
      </div>

      {/* Savings Breakdown */}
      {hasComparison && priceDifference > 0 && bestSeller && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <div>
              <span className="text-slate-900 font-semibold">
                Best price found at <strong className="text-emerald-700">{typeof bestSeller === 'object' ? bestSeller.name : bestSeller}</strong>
              </span>
              <span className="text-xs text-slate-600 block">
                Saves {formatCurrency(priceDifference)} compared to highest listing
              </span>
            </div>
          </div>

          {typeof bestSeller === 'object' && bestSeller.url && bestSeller.url !== '#' && (
            <a
              href={bestSeller.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all shadow-2xs flex-shrink-0"
            >
              <span>View Deal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default PriceInsightsCard;
