const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    min: 13,
    max: 120
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true
  },
  height: {
    type: Number,
    required: true,
    min: 100,
    max: 250
  },
  weight: {
    type: Number,
    required: true,
    min: 30,
    max: 300
  },
  activityLevel: {
    type: String,
    enum: ['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active'],
    required: true
  },
  goal: {
    type: String,
    enum: ['lose_weight', 'maintain_weight', 'gain_weight', 'build_muscle'],
    required: true
  },
  targetWeight: {
    type: Number,
    min: 30,
    max: 300
  },
  bmi: {
    type: Number,
    required: true
  },
  dailyCalories: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
