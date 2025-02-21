const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'  // Link to the Project model
  },
  status: {
    type: String,
    enum: ['To Do', 'In Progress', 'Completed'],
    default: 'To Do'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'     // Link to the User model
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Task', TaskSchema);
