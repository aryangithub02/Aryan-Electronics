const mongoose = require('mongoose');

const analyticsEventSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      required: [true, 'Event type is required'],
      enum: ['product_view', 'search', 'compare', 'wishlist_add', 'saved_add'],
      index: true
    },
    productId: {
      type: String,
      trim: true,
      index: true
    },
    productTitle: {
      type: String,
      trim: true
    },
    sector: {
      type: String,
      trim: true,
      index: true
    },
    category: {
      type: String,
      trim: true,
      index: true
    },
    brand: {
      type: String,
      trim: true,
      index: true
    },
    query: {
      type: String,
      trim: true,
      index: true
    },
    sessionId: {
      type: String,
      trim: true
    },
    convertedFromSearch: {
      type: Boolean,
      default: false
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: false
  }
);

// Compound indexes for analytics aggregations
analyticsEventSchema.index({ eventType: 1, createdAt: -1 });
analyticsEventSchema.index({ query: 1, eventType: 1 });
analyticsEventSchema.index({ sector: 1, eventType: 1 });
analyticsEventSchema.index({ brand: 1, eventType: 1 });

const AnalyticsEvent =
  mongoose.models.AnalyticsEvent ||
  mongoose.model('AnalyticsEvent', analyticsEventSchema);

module.exports = AnalyticsEvent;
