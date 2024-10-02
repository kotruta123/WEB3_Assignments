export enum Color {
    Red = 'red',
    Green = 'green',
    Blue = 'blue',
    Yellow = 'yellow',
    Wild = 'wild',  // Add 'wild' for special cards
}

export enum Value {
    Zero = '0',
    One = '1',
    Two = '2',
    Three = '3',
    Four = '4',
    Five = '5',
    Six = '6',
    Seven = '7',
    Eight = '8',
    Nine = '9',
    DrawTwo = '+2',
    Skip = 'skip',
    Reverse = 'reverse',
    Wild = 'wild',
    WildDrawFour = '+4',
}

export class Card {
    color: Color;
    value: Value;

    constructor(color: Color, value: Value) {
        this.color = color;
        this.value = value;
    }
}
