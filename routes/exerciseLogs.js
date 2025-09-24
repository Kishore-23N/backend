const express = require('express');
const router = express.Router();
const ExerciseLog = require('../models/ExerciseLog');
const auth = require('../middleware/auth');

// Get exercise logs for a user
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const exerciseLogs = await ExerciseLog.find({ userId: req.params.userId })
      .sort({ date: -1, createdAt: -1 });
    res.json(exerciseLogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new exercise log and update daily progress
router.post('/', auth, async (req, res) => {
  try {
    const exerciseLog = new ExerciseLog(req.body);
    await exerciseLog.save();

    // Update DailyProgress caloriesBurned
    const DailyProgress = require('../models/DailyProgress');
    const { userId, date, caloriesBurned } = req.body;
    await DailyProgress.findOneAndUpdate(
      { userId, date },
      { $inc: { caloriesBurned: caloriesBurned } },
      { upsert: true, new: true }
    );

    res.status(201).json(exerciseLog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete exercise log
router.delete('/:id', auth, async (req, res) => {
  try {
    const exerciseLog = await ExerciseLog.findByIdAndDelete(req.params.id);
    if (!exerciseLog) {
      return res.status(404).json({ error: 'Exercise log not found' });
    }
    res.json({ message: 'Exercise log deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
