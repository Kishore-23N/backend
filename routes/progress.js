const express = require('express');
const router = express.Router();
const DailyProgress = require('../models/DailyProgress');
const auth = require('../middleware/auth');

// Get daily progress for a user
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const progress = await DailyProgress.find({ userId: req.params.userId })
      .sort({ date: 1 });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get progress for specific date
router.get('/user/:userId/date/:date', auth, async (req, res) => {
  try {
    const progress = await DailyProgress.findOne({
      userId: req.params.userId,
      date: req.params.date
    });
    if (!progress) {
      return res.status(404).json({ error: 'Progress not found for this date' });
    }
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create or update daily progress
router.post('/', auth, async (req, res) => {
  try {
    const { userId, date, ...updateData } = req.body;
    
    // Check if progress already exists for this user and date
    const existingProgress = await DailyProgress.findOne({ userId, date });
    
    if (existingProgress) {
      // Update existing progress
      const updatedProgress = await DailyProgress.findOneAndUpdate(
        { userId, date },
        updateData,
        { new: true, runValidators: true }
      );
      res.json(updatedProgress);
    } else {
      // Create new progress
      const newProgress = new DailyProgress({ userId, date, ...updateData });
      await newProgress.save();
      res.status(201).json(newProgress);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update specific progress entry
router.put('/:id', auth, async (req, res) => {
  try {
    const progress = await DailyProgress.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!progress) {
      return res.status(404).json({ error: 'Progress not found' });
    }
    res.json(progress);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
