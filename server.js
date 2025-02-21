// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');
// const uuid = require('uuid'); // For generating unique player IDs

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server);

// const PORT = process.env.PORT || 3000;

// app.use(express.static('public'));

// let players = {};
// let currentWord = '';
// let round = 0;
// const totalRounds = 5;

// // Sample words for the game
// const words = ['apple', 'banana', 'cherry', 'date', 'elderberry'];

// // Socket.io connection
// io.on('connection', (socket) => {
//     console.log('Player connected:', socket.id);

//     // Generate a unique player ID
//     const playerId = uuid.v4();
//     players[playerId] = { socketId: socket.id, score: 0 };
//     console.log(`Player ID: ${playerId} joined the game`);

//     // Start the game when two players are connected
//     if (Object.keys(players).length === 2) {
//         round = 0;
//         currentWord = words[Math.floor(Math.random() * words.length)];
//         io.emit('startGame', { word: currentWord });
//     }

//     // Handle answer submission
//     socket.on('submitAnswer', (data) => {
//         const { playerId, answer } = data;

//         // Simple scoring logic (you can enhance this)
//         const correctAnswers = ['fruit', 'red', 'sweet']; // Example synonyms for 'apple'
//         if (currentWord === 'apple' && correctAnswers.includes(answer.toLowerCase())) {
//             players[playerId].score += 1;
//         }

//         // Move to the next round
//         round++;
//         if (round < totalRounds) {
//             currentWord = words[Math.floor(Math.random() * words.length)];
//             io.emit('nextRound', { word: currentWord });
//         } else {
//             // End of game
//             const finalScores = {};
//             for (const id in players) {
//                 finalScores[id] = players[id].score;
//             }
//             io.emit('gameOver', { scores: finalScores });
//             players = {}; // Reset players for the next game
//             round = 0;
//         }
//     });

//     // Handle player disconnection
//     socket.on('disconnect', () => {
//         console.log('Player disconnected:', socket.id);
//         delete players[playerId];
//     });
// });

// // Start the server
// server.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;
const MONGO_URI = 'mongodb://localhost:27017/gameDB'; // Change this if using a cloud DB

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define Player Schema
const playerSchema = new mongoose.Schema({
    playerId: String,
    score: { type: Number, default: 0 }
});
const Player = mongoose.model('Player', playerSchema);

// Serve static files from 'public' directory
app.use(express.static('public'));

// Serve index.html on root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Socket.IO connection
io.on('connection', (socket) => {
    console.log('A player connected:', socket.id);

    socket.on('joinGame', async (playerId) => {
        console.log(`Player ${playerId} joined the game`);
        let player = await Player.findOne({ playerId });
        if (!player) {
            player = new Player({ playerId });
            await player.save();
        }
        io.emit('updateScores', await Player.find({}));
    });

    socket.on('submitAnswer', async (data) => {
        console.log(`Player ${data.playerId} submitted answer: ${data.answer}`);
        
        let player = await Player.findOne({ playerId: data.playerId });
        if (player) {
            player.score += 1; // Modify scoring logic as needed
            await player.save();
        }
        
        io.emit('updateScores', await Player.find({}));
    });

    socket.on('disconnect', () => {
        console.log('A player disconnected:', socket.id);
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});