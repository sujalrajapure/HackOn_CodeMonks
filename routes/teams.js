const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Protect routes with authentication
const ActivityLog = require('../models/Activitylog');

// @route   GET /users/:id/activity
// @desc    Get activity log for a specific user
// @access  Private
router.get('/:id/activity', auth, async (req, res) => {
    try {
        const activity = await ActivityLog.find({ user: req.params.id }).populate('task'); // Populate the 'task' field
        res.json(activity);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
