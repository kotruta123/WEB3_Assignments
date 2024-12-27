// src/Card.ts

/**
 * The colors of the cards: we keep 'wild' as a color for
 * the Wild and Wild Draw Four (and any custom wild variants).
 */
export enum Color {
    Red = 'red',
    Green = 'green',
    Blue = 'blue',
    Yellow = 'yellow',
    Wild = 'wild',  // used for special cards
}

/**
 * The possible values of UNO cards. We also keep the textual
 * versions for special cards:
 *
 *   - Digits: "0" through "9"
 *   - +2, skip, reverse
 *   - wild, +4 (wild draw four)
 *
 * In the original assignment, this was an enum. We keep it
 * as an enum for consistency.
 */
export enum Value {
    Zero = "0",
    One = "1",
    Two = "2",
    Three = "3",
    Four = "4",
    Five = "5",
    Six = "6",
    Seven = "7",
    Eight = "8",
    Nine = "9",
    DrawTwo = "+2",
    Skip = "skip",
    Reverse = "reverse",
    Wild = "wild",
    WildDrawFour = "+4",
}

/**
 * The point values for the various card types, used for scoring
 * after a hand is won.
 */
export enum Points {
    Zero = 0,
    One = 1,
    Two = 2,
    Three = 3,
    Four = 4,
    Five = 5,
    Six = 6,
    Seven = 7,
    Eight = 8,
    Nine = 9,
    DrawTwo = 20,
    Skip = 20,
    Reverse = 20,
    Wild = 50,
    WildDrawFour = 50,
}

/**
 * A Card object. We keep the same name "Card" from Assignment 1.
 */
export class Card {
    color: Color;
    value: Value;
    points?: Points;

    constructor(color: Color, value: Value, points?: Points) {
        this.color = color;
        this.value = value;
        this.points = points;
    }
}
