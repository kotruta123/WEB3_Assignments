"use strict";
// src/Deck.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnoDeck = void 0;
const Card_1 = require("./Card");
/**
 * A helper function to get the Points enum for a given Value enum.
 * This avoids "index expression is not of type 'number'" errors.
 */
function getPointsForValue(value) {
    switch (value) {
        case Card_1.Value.Zero: return Card_1.Points.Zero;
        case Card_1.Value.One: return Card_1.Points.One;
        case Card_1.Value.Two: return Card_1.Points.Two;
        case Card_1.Value.Three: return Card_1.Points.Three;
        case Card_1.Value.Four: return Card_1.Points.Four;
        case Card_1.Value.Five: return Card_1.Points.Five;
        case Card_1.Value.Six: return Card_1.Points.Six;
        case Card_1.Value.Seven: return Card_1.Points.Seven;
        case Card_1.Value.Eight: return Card_1.Points.Eight;
        case Card_1.Value.Nine: return Card_1.Points.Nine;
        case Card_1.Value.DrawTwo: return Card_1.Points.DrawTwo;
        case Card_1.Value.Skip: return Card_1.Points.Skip;
        case Card_1.Value.Reverse: return Card_1.Points.Reverse;
        case Card_1.Value.Wild: return Card_1.Points.Wild;
        case Card_1.Value.WildDrawFour: return Card_1.Points.WildDrawFour;
        default:
            // Fallback if something unexpected happens
            return Card_1.Points.Zero;
    }
}
/**
 * The UnoDeck class creates a full standard UNO deck,
 * allows drawing from it, shuffling, and resetting.
 */
class UnoDeck {
    constructor() {
        this.cards = [];
        this.reset();
    }
    /**
     * draw(): remove the top card from the deck
     * and return it, or null if empty.
     */
    draw() {
        return this.cards.length > 0 ? this.cards.pop() || null : null;
    }
    /**
     * shuffle(): in-place shuffle of the deck using Fisher-Yates
     */
    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }
    /**
     * reset(): recreate the standard UNO deck (108 cards),
     * then shuffle.
     */
    reset() {
        this.cards = [];
        // For each color (Red, Yellow, Green, Blue):
        for (let color of [Card_1.Color.Red, Card_1.Color.Yellow, Card_1.Color.Green, Card_1.Color.Blue]) {
            // 1 copy of Zero
            this.cards.push(new Card_1.Card(color, Card_1.Value.Zero, getPointsForValue(Card_1.Value.Zero)));
            // 2 copies each of 1..9
            for (let val of [
                Card_1.Value.One, Card_1.Value.Two, Card_1.Value.Three, Card_1.Value.Four, Card_1.Value.Five,
                Card_1.Value.Six, Card_1.Value.Seven, Card_1.Value.Eight, Card_1.Value.Nine,
            ]) {
                this.cards.push(new Card_1.Card(color, val, getPointsForValue(val)));
                this.cards.push(new Card_1.Card(color, val, getPointsForValue(val)));
            }
            // 2 copies each of the special color-based cards: +2, skip, reverse
            for (let val of [Card_1.Value.DrawTwo, Card_1.Value.Skip, Card_1.Value.Reverse]) {
                this.cards.push(new Card_1.Card(color, val, getPointsForValue(val)));
                this.cards.push(new Card_1.Card(color, val, getPointsForValue(val)));
            }
        }
        // 4 Wild cards
        for (let i = 0; i < 4; i++) {
            this.cards.push(new Card_1.Card(Card_1.Color.Wild, Card_1.Value.Wild, getPointsForValue(Card_1.Value.Wild)));
        }
        // 4 Wild Draw Four cards
        for (let i = 0; i < 4; i++) {
            this.cards.push(new Card_1.Card(Card_1.Color.Wild, Card_1.Value.WildDrawFour, getPointsForValue(Card_1.Value.WildDrawFour)));
        }
        this.shuffle();
    }
}
exports.UnoDeck = UnoDeck;
