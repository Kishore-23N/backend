const express = require('express');
const router = express.Router();
const FoodLog = require('../models/FoodLog');
const auth = require('../middleware/auth');

// Get food logs for a user
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const foodLogs = await FoodLog.find({ userId: req.params.userId })
      .sort({ date: -1, createdAt: -1 });
    res.json(foodLogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new food log and update daily progress
router.post('/', auth, async (req, res) => {
  try {
    const foodLog = new FoodLog(req.body);
    await foodLog.save();

    // Update DailyProgress caloriesConsumed
    const DailyProgress = require('../models/DailyProgress');
    const { userId, date, quantity } = req.body;
    // You may want to fetch calories from foodDatabase if available
    let caloriesAdded = 0;
    if (req.body.calories) {
      caloriesAdded = req.body.calories * quantity;
    } else {
      // fallback: just add quantity
      caloriesAdded = quantity;
    }
    await DailyProgress.findOneAndUpdate(
      { userId, date },
      { $inc: { caloriesConsumed: caloriesAdded } },
      { upsert: true, new: true }
    );

    res.status(201).json(foodLog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete food log
router.delete('/:id', auth, async (req, res) => {
  try {
    const foodLog = await FoodLog.findByIdAndDelete(req.params.id);
    if (!foodLog) {
      return res.status(404).json({ error: 'Food log not found' });
    }
    res.json({ message: 'Food log deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
