// routes/problem.js
const express = require('express');
const Problem = require('../models/Problem');
const auth = require('../middleware/auth');

const router = express.Router();

// Create a new problem
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, platformLink, code, topics } = req.body;
    const problem = new Problem({
      title,
      description,
      platformLink,
      code,
      topics,
      user: req.userId
    });
    await problem.save();
    res.status(201).json(problem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all problems for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const problems = await Problem.find({ user: req.userId });
    res.json(problems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single problem by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const problem = await Problem.findOne({ _id: req.params.id, user: req.userId });
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    res.json(problem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Update a problem
router.put('/:id', auth, async (req, res) => {
  try {
    const problem = await Problem.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    res.json(problem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a problem
router.delete('/:id', auth, async (req, res) => {
  try {
    const problem = await Problem.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    res.json({ message: 'Problem deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
