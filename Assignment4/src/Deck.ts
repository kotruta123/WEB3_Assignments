// src/Deck.ts

import { Card, Color, Value, Points } from "./Card";

/**
 * A helper function to get the Points enum for a given Value enum.
 * This avoids "index expression is not of type 'number'" errors.
 */
function getPointsForValue(value: Value): Points {
    switch (value) {
        case Value.Zero:         return Points.Zero;
        case Value.One:          return Points.One;
        case Value.Two:          return Points.Two;
        case Value.Three:        return Points.Three;
        case Value.Four:         return Points.Four;
        case Value.Five:         return Points.Five;
        case Value.Six:          return Points.Six;
        case Value.Seven:        return Points.Seven;
        case Value.Eight:        return Points.Eight;
        case Value.Nine:         return Points.Nine;
        case Value.DrawTwo:      return Points.DrawTwo;
        case Value.Skip:         return Points.Skip;
        case Value.Reverse:      return Points.Reverse;
        case Value.Wild:         return Points.Wild;
        case Value.WildDrawFour: return Points.WildDrawFour;
        default:
            // Fallback if something unexpected happens
            return Points.Zero;
    }
}

/**
 * The UnoDeck class creates a full standard UNO deck,
 * allows drawing from it, shuffling, and resetting.
 */
export class UnoDeck {
    cards: Card[] = [];

    constructor() {
        this.reset();
    }

    /**
     * draw(): remove the top card from the deck
     * and return it, or null if empty.
     */
    draw(): Card | null {
        return this.cards.length > 0 ? this.cards.pop() || null : null;
    }

    /**
     * shuffle(): in-place shuffle of the deck using Fisher-Yates
     */
    shuffle(): void {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    /**
     * reset(): recreate the standard UNO deck (108 cards),
     * then shuffle.
     */
    reset(): void {
        this.cards = [];

        // For each color (Red, Yellow, Green, Blue):
        for (let color of [Color.Red, Color.Yellow, Color.Green, Color.Blue]) {
            // 1 copy of Zero
            this.cards.push(new Card(color, Value.Zero, getPointsForValue(Value.Zero)));

            // 2 copies each of 1..9
            for (let val of [
                Value.One, Value.Two, Value.Three, Value.Four, Value.Five,
                Value.Six, Value.Seven, Value.Eight, Value.Nine,
            ]) {
                this.cards.push(new Card(color, val, getPointsForValue(val)));
                this.cards.push(new Card(color, val, getPointsForValue(val)));
            }

            // 2 copies each of the special color-based cards: +2, skip, reverse
            for (let val of [Value.DrawTwo, Value.Skip, Value.Reverse]) {
                this.cards.push(new Card(color, val, getPointsForValue(val)));
                this.cards.push(new Card(color, val, getPointsForValue(val)));
            }
        }

        // 4 Wild cards
        for (let i = 0; i < 4; i++) {
            this.cards.push(new Card(Color.Wild, Value.Wild, getPointsForValue(Value.Wild)));
        }

        // 4 Wild Draw Four cards
        for (let i = 0; i < 4; i++) {
            this.cards.push(new Card(Color.Wild, Value.WildDrawFour, getPointsForValue(Value.WildDrawFour)));
        }

        this.shuffle();
    }
}
