import { Card, Color, Value } from './Card';

export interface Deck {
    cards: Card[];
    draw(): Card | null;
    shuffle(): void;
    reset(): void;
}

export class UnoDeck implements Deck {
    cards: Card[] = [];

    constructor() {
        this.reset();
    }

    draw(): Card | null {
        return this.cards.length > 0 ? this.cards.pop() || null : null;
    }

    shuffle(): void {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    reset(): void {
        this.cards = [];

        // Add standard numbered and special cards
        for (let color of [Color.Red, Color.Yellow, Color.Green, Color.Blue]) {
            for (let value of [Value.Zero, Value.One, Value.Two, Value.Three, Value.Four, Value.Five, Value.Six, Value.Seven, Value.Eight, Value.Nine, Value.DrawTwo, Value.Skip, Value.Reverse]) {
                this.cards.push({ color, value });
                if (value !== Value.Zero) this.cards.push({ color, value }); // 2 of each card except 0
            }
        }

        // Add Wild and Wild Draw Four cards
        for (let i = 0; i < 4; i++) {
            this.cards.push({ color: Color.Wild, value: Value.Wild });
            this.cards.push({ color: Color.Wild, value: Value.WildDrawFour });
        }

        this.shuffle();
    }
}
