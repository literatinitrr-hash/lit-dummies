const express = require('express');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');
const router = express.Router();


router.get('/leaderboard', async (req, res) => {
  const leaderboard = await User.find()
    .select('name totalPoints')
    .sort({ totalPoints: -1 })
    .limit(5);
    
  res.json({ success: true, leaderboard });
});


router.get('/me', authenticate, async (req, res) => {
  res.json({
  success: true,
  user: req.user
});
 
  res.json({ success: true, user });
});

module.exports = router;
