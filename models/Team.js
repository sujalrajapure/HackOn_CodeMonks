const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'    // Array of User IDs
  }]
});

module.exports = mongoose.model('Team', TeamSchema);
