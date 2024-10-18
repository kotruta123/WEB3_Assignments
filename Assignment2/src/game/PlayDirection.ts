export class PlayDirection {
    private direction: number;

    constructor() {
        this.direction = 1;
    }

    toggle(): void {
        this.direction *= -1;
    }

    getNextPlayerIndex(currentIndex: number, playerCount: number): number {
        return (currentIndex + this.direction + playerCount) % playerCount;
    }

    getDirection(): string {
        return this.direction === 1 ? "clockwise" : "anticlockwise";
    }
}
