const { User } = require('./database/user-schema');
const { Game } = require('./database/game-schema');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const PORT = 8080;

const server = http.createServer(app);

// Socket init
const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:5174',
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

//Midleware

app.use(cors({
    origin: 'http://localhost:5174', // default Vue.js origin
    credentials: true,
}));
app.use(express.json());

// Socket.io Event Handling
io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);

    //Join game
    socket.on('joinGame', (gameId) => {
        socket.join(gameId);
        console.log(`Socket ${socket.id} joined game ${gameId}`);
        socket.emit('joinedGame', gameId);
    })

    socket.on('playerAction', (data) => {
        const { gameId, action, payload } = data;

        // const updatedGameState = updateGameState(gameId, action, payload);

        // Game state
        const updatedGameState = {};

        // Broadcast the updated game state to all players in the room
        io.to(gameId).emit('updateGameState', updatedGameState);
    });

    // Handle player disconnection
    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
        // Notify others and update game state
    });
})


app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    if(email === '123@gmail.com' && password === '123') {
        return res.status(200).json({
            user: {
                id: 1,
                name: 'User',
                email: '123',
            },
        });
    } else {
        return res.status(401).json({message: 'Invalid'})
    }
});

app.post('/api/auth/register', async (req, res) => {
    const { username, email, password } = req.body;

    if(!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required'});
    }

    try {
        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(400).json({ message: 'Email already exists'});
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Create new user
        const newUser = new User({
            username, 
            email,
            passwordHash,
        });

        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ userId: newUser._id }, 'your-secret-key', { expiresIn: '1h' });

        res.status(201).json({
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
            },
            token,
        });
    } catch(error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

server.listen(PORT, () => {
    console.log(`Express running on: http://localhost:${PORT}`);
  });