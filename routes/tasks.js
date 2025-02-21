const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Protect routes with authentication
const Task = require('../models/task');

// @route   POST /tasks
// @desc    Create a new task
// @access  Private (requires authentication)
router.post('/', auth, async (req, res) => {
  const { description, deadline, project } = req.body;

  try {
    const newTask = new Task({
      description,
      deadline,
      project,
      assignedTo: req.user.id  // Get user ID from the authenticated user
    });

    const task = await newTask.save();
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /tasks
// @desc    Get all tasks for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id }).populate('project'); // Populate the 'project' field
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /tasks/:id
// @desc    Update a task
// @access  Private
router.put('/:id', auth, async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }

        // Make sure user owns task
        if (task.assignedTo.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        task = await Task.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });

        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
