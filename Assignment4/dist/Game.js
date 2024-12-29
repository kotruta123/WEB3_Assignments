"use strict";
// src/Game.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnoGame = void 0;
const Card_1 = require("./Card");
const Hand_1 = require("./Hand");
const Deck_1 = require("./Deck");
const PlayDirection_1 = require("./PlayDirection");
/**
 * The UnoGame class from Assignment 1, expanded with:
 *  - awarding points to the winner
 *  - handling "UNO" calls & penalty
 *  - a 'bots' array to mark which players are bots (optional)
 *  - a "currentColor" that can be changed by wild
 */
class UnoGame {
    constructor(playerCount, botCount, playerNames) {
        this.players = []; // each player's hand
        this.currentPlayerIndex = 0; // who is up
        this.drawPile = new Deck_1.UnoDeck();
        this.discardPile = [];
        this.bots = []; // which player indices are bots
        this.playDirection = new PlayDirection_1.PlayDirection();
        this.currentColor = null;
        // Track each player's total score, standard UNO up to 500 typically
        this.scores = [];
        // We track who forgot to say UNO (for the penalty check).
        // If a player plays a card and goes down to 1 without calling "UNO",
        // the next time they are discovered, they may get a 4-card penalty.
        // This is a simplified approach: you can store a boolean per player
        // or track if they said it.
        this.forgotUno = [];
        // Initialize players
        for (let i = 0; i < playerCount + botCount; i++) {
            const hand = new Hand_1.UnoHand();
            // draw 7
            for (let j = 0; j < 7; j++) {
                hand.drawCard(this.drawPile);
            }
            this.players.push(hand);
            this.scores.push(0);
            this.forgotUno.push(false);
        }
        // Mark who is a bot
        for (let i = playerCount; i < playerCount + botCount; i++) {
            this.bots.push(i);
        }
        // Flip top card to discard
        const firstCard = this.drawPile.draw();
        if (!firstCard)
            throw new Error("Deck was empty at start?!");
        this.discardPile.push(firstCard);
        // If first card is wild or +4, pick random color
        if (firstCard.value.toLowerCase() === 'wild' ||
            firstCard.value.toLowerCase() === '+4' ||
            firstCard.value.toLowerCase() === 'wilddrawfour') {
            this.currentColor = this.selectRandomColor();
        }
        else {
            this.currentColor = firstCard.color;
        }
    }
    /**
     * currentPlayer(): returns the current player's UnoHand
     */
    currentPlayer() {
        return this.players[this.currentPlayerIndex];
    }
    /**
     * playCard(): attempt to play the given card from the current player's hand.
     * If valid, remove from that player's hand, push to discard, handle specials.
     */
    playCard(card, selectedColor) {
        const currentPlayer = this.currentPlayer();
        // If the player had exactly 2 cards but did NOT call UNO, mark forgotUno
        if (currentPlayer.cards.length === 2 && !this.hasCalledUno(this.currentPlayerIndex)) {
            this.forgotUno[this.currentPlayerIndex] = true;
        }
        // Attempt to play
        const success = currentPlayer.playCard(card, this.discardPile, this.currentColor);
        if (success) {
            // If success, handle special logic
            this.updateNextPlayer(card, selectedColor);
            // If the player is now at 1 card, they must say UNO or risk penalty
            // We'll track that they haven't said it yet:
            // (But if the user calls sayUno() we set the array to false).
            // This is a simplified approach; you can also do it automatically in your UI.
        }
        return success;
    }
    /**
     * sayUno(): The current player calls UNO, so they are safe from the penalty.
     */
    sayUno() {
        this.forgotUno[this.currentPlayerIndex] = false;
    }
    /**
     * checkAndApplyUnoPenalty(): If a player forgot to say UNO (has only 1 card
     * and forgotUno is true), they must draw 4 cards immediately from the draw pile.
     */
    checkAndApplyUnoPenalty(playerIndex) {
        if (this.forgotUno[playerIndex]) {
            // draw 4
            for (let i = 0; i < 4; i++) {
                this.players[playerIndex].drawCard(this.drawPile);
            }
            // reset
            this.forgotUno[playerIndex] = false;
        }
    }
    /**
     * Called during `playCard()` to pick a random color for wild if none is chosen
     */
    selectRandomColor() {
        const colors = [Card_1.Color.Red, Card_1.Color.Green, Card_1.Color.Blue, Card_1.Color.Yellow];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    /**
     * updateNextPlayer(): handle special card logic, update color if wild, skip players if needed, etc.
     */
    updateNextPlayer(card, selectedColor) {
        const nextIndex = this.playDirection.getNextPlayerIndex(this.currentPlayerIndex, this.players.length);
        const value = card.value.toLowerCase();
        switch (value) {
            case 'wild':
                // If user didn't pick a color, pick random
                if (!selectedColor || selectedColor === Card_1.Color.Wild) {
                    this.currentColor = this.selectRandomColor();
                }
                else {
                    this.currentColor = selectedColor;
                }
                // move normal
                this.advanceTurn();
                break;
            case '+4':
            case 'wilddrawfour':
                // pick color
                if (!selectedColor || selectedColor === Card_1.Color.Wild) {
                    this.currentColor = this.selectRandomColor();
                }
                else {
                    this.currentColor = selectedColor;
                }
                // next player draws 4
                for (let i = 0; i < 4; i++) {
                    this.players[nextIndex].drawCard(this.drawPile);
                }
                // skip them
                this.advanceTurn(); // skip next
                this.advanceTurn(); // next next
                break;
            case '+2':
            case 'drawtwo':
                // set color
                this.currentColor = card.color;
                // next draws 2
                for (let i = 0; i < 2; i++) {
                    this.players[nextIndex].drawCard(this.drawPile);
                }
                // skip them
                this.advanceTurn();
                this.advanceTurn();
                break;
            case 'skip':
                this.currentColor = card.color;
                // skip next
                this.advanceTurn();
                this.advanceTurn();
                break;
            case 'reverse':
                // if 2 players, reverse == skip
                if (this.players.length === 2) {
                    this.currentColor = card.color;
                    this.advanceTurn();
                    this.advanceTurn();
                }
                else {
                    // toggle direction
                    this.playDirection.toggle();
                    // set color
                    this.currentColor = card.color;
                    // move to next
                    this.advanceTurn();
                }
                break;
            default:
                // normal card => just set the color and move on
                this.currentColor = card.color;
                this.advanceTurn();
                break;
        }
    }
    /**
     * Move the turn to the next player in the current direction,
     * and check UNO penalty on that new player.
     */
    advanceTurn() {
        this.currentPlayerIndex = this.playDirection.getNextPlayerIndex(this.currentPlayerIndex, this.players.length);
        // check if the *new* current player forgot to say UNO previously
        this.checkAndApplyUnoPenalty(this.currentPlayerIndex);
    }
    /**
     * isBotTurn(): returns true if current player is in the bots array
     */
    isBotTurn() {
        return this.bots.includes(this.currentPlayerIndex);
    }
    /**
     * getCurrentDirection(): "clockwise" or "anticlockwise"
     */
    getCurrentDirection() {
        return this.playDirection.getDirection();
    }
    /**
     * checkWinner(): if the current player has 0 cards, that player wins.
     * Then we do scoring, etc.
     */
    checkWinner() {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].cards.length === 0) {
                return i;
            }
        }
        return null;
    }
    /**
     * Award points to the winner (the sum of the points in all other players' hands),
     * standard UNO rule.
     */
    awardPointsToWinner(winnerIndex) {
        let sumPoints = 0;
        for (let i = 0; i < this.players.length; i++) {
            if (i !== winnerIndex) {
                // sum up the points in that player's hand
                for (let card of this.players[i].cards) {
                    sumPoints += card.points ?? 0;
                }
            }
        }
        this.scores[winnerIndex] += sumPoints;
    }
    /**
     * hasCalledUno(): check if a particular player has recently called UNO
     * or if they are safe from penalty.  In this example, we only track
     * forgotUno[...] to see if they *didn't* call. So we invert that.
     */
    hasCalledUno(playerIndex) {
        return !this.forgotUno[playerIndex];
    }
    /**
     * If a player can't (or won't) play, they must draw one card.
     */
    forceDraw() {
        const beforeCount = this.currentPlayer().cards.length;
        this.currentPlayer().drawCard(this.drawPile);
        const afterCount = this.currentPlayer().cards.length;
        // if they actually got a card, return true
        return afterCount > beforeCount;
    }
}
exports.UnoGame = UnoGame;
