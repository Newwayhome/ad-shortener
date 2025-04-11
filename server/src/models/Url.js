const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema({
  ip: String,
  country: String,
  browser: String,
  device: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const urlSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  originalUrl: {
    type: String,
    required: [true, 'Please provide the original URL'],
    trim: true
  },
  shortUrl: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  customAlias: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  clicks: [clickSchema],
  totalClicks: {
    type: Number,
    default: 0
  },
  earnings: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  expiresAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for faster queries
urlSchema.index({ shortUrl: 1 });
urlSchema.index({ user: 1 });
urlSchema.index({ customAlias: 1 });

// Method to calculate earnings based on clicks
urlSchema.methods.calculateEarnings = function() {
  const cpmRate = process.env.CPM_RATE || 2.5;
  return (this.totalClicks / 1000) * cpmRate;
};

module.exports = mongoose.model('Url', urlSchema); 