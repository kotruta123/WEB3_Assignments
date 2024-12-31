const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    gameId: { type: String, required: true, unique: true },
    players: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            socketId: { type: String },
            hand: [{ color: String, value: String }],
            score: { type: Number, default: 0 },
        }
    ],
    deck: [{ color: String, value: String }],
    discardPile: [{ color: String, value: String }],
    currentTurn: { type: String }, // socketId
    direction: { type: String, default: 'clockwise' },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Game = mongoose.model('Game', gameSchema);
