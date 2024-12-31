import { io } from 'socket.io-client';
const socket = io('http://localhost:8080', {
  withCredentials: true,
});

// Join a game
socket.emit('joinGame', gameId);

// Listen for game state updates
socket.on('updateGameState', (gameState) => {
 
});

// Emit player actions
const playCard = (card) => {
  socket.emit('playerAction', { gameId, action: 'playCard', card });
};
