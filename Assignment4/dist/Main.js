"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Game_1 = require("./Game");
const game = new Game_1.UnoGame(3); // 3 players
while (game.checkWinner() === null) {
    const currentPlayer = game.currentPlayer();
    // If player has one card left, they should call UNO
    if (currentPlayer.cards.length === 1) {
        currentPlayer.callUno(); // The player calls UNO
    }
    game.playTurn();
}
console.log(`Player ${game.checkWinner()} wins!`);
