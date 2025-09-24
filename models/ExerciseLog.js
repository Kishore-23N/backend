const mongoose = require('mongoose');

const exerciseLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String,
    required: true
  },
  exerciseId: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  intensity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true
  },
  caloriesBurned: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ExerciseLog', exerciseLogSchema);
