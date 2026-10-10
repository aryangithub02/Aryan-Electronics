const mongoose = require('mongoose');

const specificationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true }
  },
  { _id: false }
);

const sellerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    price: { type: Number, default: null, min: 0 },
    availability: { type: String, default: null, trim: true },
    inStock: { type: Boolean, default: null },
    url: { type: String, default: '#' }
  },
  { _id: false }
);

const sourceSchema = new mongoose.Schema(
  {
    type: { type: String, trim: true },
    url: { type: String, trim: true }
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
      index: true
    },
    sector: {
      type: String,
      required: [true, 'Sector is required'],
      trim: true,
      index: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      index: true
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    price: {
      type: Number,
      default: null,
      min: [0, 'Price must be non-negative']
    },
    discountPercentage: {
      type: Number,
      default: 0,
      min: [0, 'Discount must be at least 0%'],
      max: [100, 'Discount cannot exceed 100%']
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating must be at least 0'],
      max: [5, 'Rating cannot exceed 5']
    },
    stock: {
      type: Number,
      default: null,
      min: [0, 'Stock cannot be negative']
    },
    SKU: {
      type: String,
      required: [true, 'SKU is required'],
      unique: true,
      trim: true
    },
    sku: {
      type: String,
      trim: true
    },
    images: {
      type: [String],
      default: []
    },
    thumbnail: {
      type: String,
      default: ''
    },
    specifications: {
      type: [specificationSchema],
      default: []
    },
    rawSpecifications: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    features: {
      type: [String],
      default: []
    },
    useCases: {
      type: [String],
      default: []
    },
    sellers: {
      type: [sellerSchema],
      default: []
    },
    sources: {
      type: [sourceSchema],
      default: []
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true
    },
    isTrending: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Compound indexes for optimal performance in filtering, sorting & recommendations
productSchema.index({ sector: 1, category: 1 });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ brand: 1, rating: -1 });
productSchema.index({ isFeatured: 1, rating: -1 });
productSchema.index({ isTrending: 1, rating: -1 });

// Virtual calculation for discounted price
productSchema.virtual('discountedPrice').get(function () {
  if (this.price === null || this.price === undefined) return null;
  if (!this.discountPercentage) return this.price;
  const discounted = this.price * (1 - this.discountPercentage / 100);
  return Math.round(discounted * 100) / 100;
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

module.exports = Product;
