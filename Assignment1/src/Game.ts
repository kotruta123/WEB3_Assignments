import { Card } from './Card';
import { Deck, UnoDeck } from './Deck';
import { Hand, UnoHand } from './Hand';

export interface Game {
    players: Hand[];
    currentPlayerIndex: number;
    drawPile: Deck;
    discardPile: Card[];
    currentPlayer(): Hand;
    playTurn(): void;
    checkWinner(): number | null;
}

export class UnoGame implements Game {
    players: Hand[] = [];
    currentPlayerIndex: number = 0;
    drawPile: Deck = new UnoDeck();
    discardPile: Card[] = [];

    constructor(playerCount: number) {
        for (let i = 0; i < playerCount; i++) {
            const hand = new UnoHand();
            for (let j = 0; j < 7; j++) {
                hand.drawCard(this.drawPile);
            }
            this.players.push(hand);
        }

        // Set initial discard pile
        this.discardPile.push(this.drawPile.draw()!);
    }

    currentPlayer(): Hand {
        return this.players[this.currentPlayerIndex];
    }

    playTurn(): void {
        const currentPlayer = this.currentPlayer() as UnoHand;

        if (currentPlayer.hasPlayableCard(this.discardPile)) {
            for (let card of currentPlayer.cards) {
                if (currentPlayer.playCard(card, this.discardPile)) {
                    break;
                }
            }
        } else {
            currentPlayer.drawCard(this.drawPile);
        }

        // Check if the current player forgot to call UNO
        if (currentPlayer.forgotToCallUno()) {
            console.log(`Player ${this.currentPlayerIndex} forgot to call UNO! Drawing 4 cards as a penalty.`);
            for (let i = 0; i < 4; i++) {
                currentPlayer.drawCard(this.drawPile);
            }
        }

        // Reset the UNO call after the turn
        currentPlayer.resetUnoCall();

        // Move to the next player
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    }

    checkWinner(): number | null {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].cards.length === 0) {
                return i;
            }
        }
        return null;
    }
}
