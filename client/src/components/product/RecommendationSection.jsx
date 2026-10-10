import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingDown, Layers, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import ProductCard from './ProductCard';
import Spinner from '../common/Spinner';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatters';

export const RecommendationSection = ({ productId, currentProduct }) => {
  const [recommendations, setRecommendations] = useState(null);
  const [activeTab, setActiveTab] = useState('similar');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchRecs = async () => {
      if (!productId) return;
      try {
        setLoading(true);
        setError(null);
        let res;
        if (typeof api.getProductRecommendations === 'function') {
          res = await api.getProductRecommendations(productId);
        }
        if (isMounted && res && res.data) {
          setRecommendations(res.data);
          // Auto-select tab with items if current has none
          const recs = res.data;
          if (recs.similarProducts?.length > 0) {
            setActiveTab('similar');
          } else if (recs.budgetAlternatives?.length > 0) {
            setActiveTab('budget');
          } else if (recs.relatedProducts?.length > 0) {
            setActiveTab('related');
          }
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'Unable to load recommendations');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchRecs();
    return () => {
      isMounted = false;
    };
  }, [productId]);

  if (loading) {
    return (
      <div className="py-12 border-t border-slate-800/80 flex flex-col items-center justify-center space-y-3">
        <Spinner size="md" />
        <p className="text-xs font-mono text-slate-400">Computing hardware affinity & recommendations...</p>
      </div>
    );
  }

  if (error || !recommendations) {
    return null;
  }

  const { similarProducts = [], budgetAlternatives = [], relatedProducts = [] } = recommendations;

  const totalRecs = similarProducts.length + budgetAlternatives.length + relatedProducts.length;
  if (totalRecs === 0) return null;

  const tabs = [
    {
      id: 'similar',
      label: 'Similar Products',
      icon: Layers,
      count: similarProducts.length,
      subtitle: `Matched by category (${currentProduct?.category || 'hardware'}), specifications & brand tier`,
      explanation: 'Products in the same category and price tier sharing core architectural specifications.'
    },
    {
      id: 'budget',
      label: 'Budget Alternatives',
      icon: TrendingDown,
      count: budgetAlternatives.length,
      subtitle: 'Comparable performance and specifications at a lower cost threshold',
      explanation: 'Vetted alternatives that deliver comparable core utility while reducing expenditure.'
    },
    {
      id: 'related',
      label: 'Complementary Hardware',
      icon: Zap,
      count: relatedProducts.length,
      subtitle: 'Sensors, modules, peripherals, and ecosystem companions',
      explanation: 'Hardware and accessories engineered to interface seamlessly with this product sector.'
    }
  ].filter(t => t.count > 0);

  if (tabs.length === 0) return null;

  // Active items
  let activeList = [];
  if (activeTab === 'similar') activeList = similarProducts;
  else if (activeTab === 'budget') activeList = budgetAlternatives;
  else if (activeTab === 'related') activeList = relatedProducts;

  const currentTabMeta = tabs.find(t => t.id === activeTab) || tabs[0];

  return (
    <section className="space-y-6 pt-10 border-t border-slate-800/80" aria-label="Product Recommendations">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono tracking-wider uppercase mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Intelligent Discovery Engine</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Recommended For You
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {currentTabMeta.subtitle}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 self-start md:self-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanatory Banner */}
      <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/70 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span>
            <strong className="text-white font-medium">Relevance Logic: </strong>
            {currentTabMeta.explanation}
          </span>
        </div>
        <span className="hidden sm:inline-block text-[11px] font-mono text-slate-500">
          Rule-based heuristic ranking
        </span>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {activeList.slice(0, 4).map((item) => {
          return (
            <div key={item.id || item._id} className="relative flex flex-col">
              {/* Savings callout for budget alternatives */}
              {activeTab === 'budget' && (item.budgetSavings > 0 || item.percentageCheaper > 0) && (
                <div className="mb-2 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold flex items-center justify-between">
                  <span>Saves {formatCurrency(item.budgetSavings)}</span>
                  <span className="text-[10px] bg-emerald-500 text-slate-950 px-1.5 py-0.2 rounded font-bold">
                    {item.percentageCheaper}% less
                  </span>
                </div>
              )}
              <ProductCard product={item} />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default RecommendationSection;
