import React from 'react';
import ProductCard from './ProductCard';
import { ProductGridSkeleton } from '../common/LoadingSkeleton';
import EmptyState from '../common/EmptyState';
import { PackageOpen } from 'lucide-react';

export const ProductGrid = ({
  products = [],
  isLoading = false,
  emptyTitle,
  emptyDescription,
  onResetFilters
}) => {
  if (isLoading) {
    return <ProductGridSkeleton count={6} />;
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        icon={PackageOpen}
        title={emptyTitle || 'No Products Found'}
        description={emptyDescription || 'No electronic products match your selected parameters. Try clearing your filters.'}
        actionLabel={onResetFilters ? 'Reset Filters' : undefined}
        onAction={onResetFilters}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {products.map((product) => (
        <ProductCard key={product.id || product.SKU} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
