"use strict";
// src/PlayDirection.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayDirection = void 0;
/**
 * The class from Assignment 1 that controls the direction.
 */
class PlayDirection {
    constructor() {
        this.direction = 1; // 1 = clockwise, -1 = anticlockwise
    }
    /**
     * toggle(): flips direction from 1 to -1 or vice versa
     */
    toggle() {
        this.direction *= -1;
    }
    /**
     * getNextPlayerIndex(): given currentIndex and total players,
     * moves forward or backward by 1, with wraparound.
     */
    getNextPlayerIndex(currentIndex, playerCount) {
        return (currentIndex + this.direction + playerCount) % playerCount;
    }
    /**
     * getDirection() => "clockwise" or "anticlockwise"
     */
    getDirection() {
        return this.direction === 1 ? "clockwise" : "anticlockwise";
    }
}
exports.PlayDirection = PlayDirection;
