import { Card, Color, Points, Value } from './Card';

export class UnoDeck {
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

        for (let color of [Color.Red, Color.Yellow, Color.Green, Color.Blue]) {
            for (let value of [
                Value.Zero,
                Value.One,
                Value.Two,
                Value.Three,
                Value.Four,
                Value.Five,
                Value.Six,
                Value.Seven,
                Value.Eight,
                Value.Nine,
                Value.DrawTwo,
                Value.Skip,
                Value.Reverse,
            ]) {
                this.cards.push(new Card(color, value, Points[value]));
                if (value !== Value.Zero) this.cards.push(new Card(color, value, Points[value]));
            }
        }

        for (let i = 0; i < 4; i++) {
            this.cards.push({ color: Color.Wild, value: Value.Wild });
            this.cards.push({ color: Color.Wild, value: Value.WildDrawFour });
        }

        this.shuffle();
    }
}
