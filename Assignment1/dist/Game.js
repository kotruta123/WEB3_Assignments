"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnoGame = void 0;
const Deck_1 = require("./Deck");
const Hand_1 = require("./Hand");
class UnoGame {
    constructor(playerCount) {
        this.players = [];
        this.currentPlayerIndex = 0;
        this.drawPile = new Deck_1.UnoDeck();
        this.discardPile = [];
        for (let i = 0; i < playerCount; i++) {
            const hand = new Hand_1.UnoHand();
            for (let j = 0; j < 7; j++) {
                hand.drawCard(this.drawPile);
            }
            this.players.push(hand);
        }
        // Set initial discard pile
        this.discardPile.push(this.drawPile.draw());
    }
    currentPlayer() {
        return this.players[this.currentPlayerIndex];
    }
    playTurn() {
        const currentPlayer = this.currentPlayer();
        if (currentPlayer.hasPlayableCard(this.discardPile)) {
            for (let card of currentPlayer.cards) {
                if (currentPlayer.playCard(card, this.discardPile)) {
                    break;
                }
            }
        }
        else {
            currentPlayer.drawCard(this.drawPile);
        }
        // Check if the current player forgot to call UNO
        if (currentPlayer.forgotToCallUno()) {
            console.log(`Player ${this.currentPlayerIndex} forgot to call UNO! Drawing 4 cards as a penalty.`);
            for (let i = 0; i < 4; i++) {
                currentPlayer.drawCard(this.drawPile);
            }
        }
        // Reset the UNO call after the turn
        currentPlayer.resetUnoCall();
        // Move to the next player
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    }
    checkWinner() {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].cards.length === 0) {
                return i;
            }
        }
        return null;
    }
}
exports.UnoGame = UnoGame;
