const mongoose = require('mongoose');

const dailyProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String,
    required: true
  },
  weight: {
    type: Number,
    min: 30,
    max: 300
  },
  caloriesConsumed: {
    type: Number,
    default: 0,
    min: 0
  },
  caloriesBurned: {
    type: Number,
    default: 0,
    min: 0
  },
  waterIntake: {
    type: Number,
    default: 0,
    min: 0
  },
  mood: {
    type: String,
    enum: ['great', 'good', 'okay', 'tired', 'stressed'],
    default: 'okay'
  }
}, {
  timestamps: true
});

// Ensure unique combination of userId and date
dailyProgressSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyProgress', dailyProgressSchema);
