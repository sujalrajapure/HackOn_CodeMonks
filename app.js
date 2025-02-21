const express = require('express');
const connectDB = require('./config/database');
const cors = require('cors');
require('dotenv').config();  // Load environment variables

const app = express();

// Connect to Database
connectDB();
// app.js

app.use(cors()); // Enable CORS
app.use(express.json());
// Init Middleware
app.use(express.json({ extended: false }));  // for parsing application/json
app.use(cors()); // Enable CORS

// Serve static files from the 'public' directory
app.use(express.static('public')); // Add this line!!!

// Define Routes
// app.use('/auth', require('./routes/auth'));
// app.use('/tasks', require('./routes/tasks'));
// app.use('/projects', require('./routes/projects'));
// app.use('/users', require('./routes/users'));
// app.use('/teams', require('./routes/teams'));
const authRoutes = require('./routes/auth');
console.log('Type of authRoutes:', typeof authRoutes);

const tasksRoutes = require('./routes/tasks');
console.log('Type of tasksRoutes:', typeof tasksRoutes);

const projectsRoutes = require('./routes/projects');
console.log('Type of projectsRoutes:', typeof projectsRoutes);

const usersRoutes = require('./routes/users');
console.log('Type of usersRoutes:', typeof usersRoutes);

const teamsRoutes = require('./routes/teams');
console.log('Type of teamsRoutes:', typeof teamsRoutes);

// Check if they are valid middleware functions
app.use('/auth', authRoutes);
app.use('/tasks', tasksRoutes);
app.use('/projects', projectsRoutes);
app.use('/users', usersRoutes);
app.use('/teams', teamsRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
