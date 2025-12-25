const express = require('express');
const User = require('../models/User');
const Point = require('../models/Point');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/users/:id/points',
  authenticate,
  authorize(['admin']),     
  async (req, res) => {
    try {
      const { points, reason } = req.body;
      const targetUser = await User.findById(req.params.id);
      if (!targetUser) {
        return res.status(404).json({ success: false, msg: 'User not found' });
      }

      const point = new Point({
        userId: req.params.id,
        points,
        reason,
        givenBy: req.user._id
      });
      await point.save();

      targetUser.totalPoints += points;
      await targetUser.save();

      res.json({
        success: true,
        msg: `+${points} points added to ${targetUser.name}`,
        newTotal: targetUser.totalPoints
      });
    } catch (err) {
      res.status(500).json({ success: false, msg: err.message });
    }
  }
);

router.get(
  '/users',
  authenticate,
  authorize(['admin']),   
  async (req, res) => {
    const users = await User.find()
      .select('name email totalPoints role')
      .sort({ totalPoints: -1 });
    res.json({ success: true, users });
  }
);

module.exports = router;
