"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnoDeck = void 0;
const Card_1 = require("./Card");
class UnoDeck {
    constructor() {
        this.cards = [];
        this.reset();
    }
    draw() {
        return this.cards.length > 0 ? this.cards.pop() || null : null;
    }
    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }
    reset() {
        this.cards = [];
        // Add standard numbered and special cards
        for (let color of [Card_1.Color.Red, Card_1.Color.Yellow, Card_1.Color.Green, Card_1.Color.Blue]) {
            for (let value of [Card_1.Value.Zero, Card_1.Value.One, Card_1.Value.Two, Card_1.Value.Three, Card_1.Value.Four, Card_1.Value.Five, Card_1.Value.Six, Card_1.Value.Seven, Card_1.Value.Eight, Card_1.Value.Nine, Card_1.Value.DrawTwo, Card_1.Value.Skip, Card_1.Value.Reverse]) {
                this.cards.push({ color, value });
                if (value !== Card_1.Value.Zero)
                    this.cards.push({ color, value }); // 2 of each card except 0
            }
        }
        // Add Wild and Wild Draw Four cards
        for (let i = 0; i < 4; i++) {
            this.cards.push({ color: Card_1.Color.Wild, value: Card_1.Value.Wild });
            this.cards.push({ color: Card_1.Color.Wild, value: Card_1.Value.WildDrawFour });
        }
        this.shuffle();
    }
}
exports.UnoDeck = UnoDeck;
