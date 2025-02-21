const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Planning', 'In Progress', 'Completed'],
    default: 'Planning'
  },
  teamMembers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'    // Array of User IDs
  }]
});

module.exports = mongoose.model('Project', ProjectSchema);
