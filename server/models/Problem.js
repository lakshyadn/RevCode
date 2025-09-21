// models/Problem.js
const mongoose = require('mongoose');

const ProblemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  platformLink: { type: String, default: '' },
  code: [
    {
      approachName: { type: String, default: '' },
      codeText: { type: String, default: '' },
      explanation: { type: String, default: '' }
    }
  ],
  topics: [{ type: String }], // e.g., ["Arrays", "Binary Search"]
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Problem', ProblemSchema);
