// src/PlayDirection.ts

/**
 * The class from Assignment 1 that controls the direction.
 */
export class PlayDirection {
    private direction: number;

    constructor() {
        this.direction = 1; // 1 = clockwise, -1 = anticlockwise
    }

    /**
     * toggle(): flips direction from 1 to -1 or vice versa
     */
    toggle(): void {
        this.direction *= -1;
    }

    /**
     * getNextPlayerIndex(): given currentIndex and total players,
     * moves forward or backward by 1, with wraparound.
     */
    getNextPlayerIndex(currentIndex: number, playerCount: number): number {
        return (currentIndex + this.direction + playerCount) % playerCount;
    }

    /**
     * getDirection() => "clockwise" or "anticlockwise"
     */
    getDirection(): string {
        return this.direction === 1 ? "clockwise" : "anticlockwise";
    }
}
