export enum Color {
    Red = "Red",
    Yellow = "Yellow",
    Green = "Green",
    Blue = "Blue",
    Wild = "Wild",
}

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
    DrawTwo = "Draw Two",
    Skip = "Skip",
    Reverse = "Reverse",
    Wild = "Wild",
    WildDrawFour = "Wild Draw Four"
}

export interface Card {
    color: Color;
    value: Value;
}
