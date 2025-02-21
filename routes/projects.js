const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Protect routes with authentication
const Project = require('../models/Project');

// @route   POST /projects
// @desc    Create a new project
// @access  Private (requires authentication)
router.post('/', auth, async (req, res) => {
  const { name, description, startDate, endDate, teamMembers } = req.body;

  try {
    const newProject = new Project({
      name,
      description,
      startDate,
      endDate,
      teamMembers
    });

    const project = await newProject.save();
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /projects
// @desc    Get all projects
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({ teamMembers: req.user.id }); // Filter for projects where the user is a team member
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /projects/:id
// @desc    Update a project
// @access  Private
router.put('/:id', auth, async (req, res) => {
    try {
        let project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }

        project = await Project.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });

        res.json(project);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
