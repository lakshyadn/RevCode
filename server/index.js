// index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const problemRoutes = require('./routes/problem');


const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Debug dotenv
console.log("MONGO_URI:", process.env.MONGO_URI);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiter
const limiter = rateLimit({ windowMs: 15*60*1000, max: 100 });
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);

app.get('/', (req,res) => res.send('RevCode API is Running'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('✅ Connected to MongoDB');
        app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
    })
    .catch(err => console.error('MongoDB connection error:', err));
