import { Card } from './Card';
import {UnoHand} from "./Hand";
import {UnoDeck} from "./Deck"; // Assuming Card.ts is in the same directory
import { PlayDirection } from './PlayDirection';

export class UnoGame {
    players: UnoHand[] = [];   // List of players in the game
    currentPlayerIndex: number = 0;  // Index of the current player
    drawPile: UnoDeck = new UnoDeck();  // Deck from which cards are drawn
    discardPile: Card[] = [];  // The pile of cards that have been played
    bots: number[] = [];  // Array of bot player indexes
    playDirection: PlayDirection = new PlayDirection();

    constructor(playerCount: number, botCount: number) {
        // Create hands for the player(s) and bots
        for (let i = 0; i < playerCount + botCount; i++) {
            const hand = new UnoHand();
            for (let j = 0; j < 7; j++) {  // Deal 7 cards to each player
                hand.drawCard(this.drawPile);
            }
            this.players.push(hand);
        }
        // Add first card to the discard pile
        this.discardPile.push(this.drawPile.draw()!);

        // Assign bot player indexes
        for (let i = playerCount; i < playerCount + botCount; i++) {
            this.bots.push(i);
        }
    }

    currentPlayer(): UnoHand {
        return this.players[this.currentPlayerIndex];
    }

    playCard(card: Card): boolean {
        const currentPlayer = this.currentPlayer();

        if (currentPlayer.playCard(card, this.discardPile)) {
            this.updateNextPlayer(card);  // Handle special cards like +2
            return true;
        }
        return false;
    }

    updateNextPlayer(card: Card): void {
        // Handle special card logic, e.g., +2 cards

        const nextPlayerIndex = this.playDirection.getNextPlayerIndex(this.currentPlayerIndex, this.players.length);

        if (card.value === '+2') {
            // The next player draws 2 cards
            //const nextPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
            for (let i = 0; i < 2; i++) {
                this.players[nextPlayerIndex].drawCard(this.drawPile);
            }
        }
        else if (card.value === '+4'){
            // The next player draws 4 cards
           // const nextPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
            for(let i=0; i < 4; i++) {
                this.players[nextPlayerIndex].drawCard(this.drawPile);
            }
        }
        else if (card.value === 'reverse'){
            this.playDirection.toggle();
        }

        // Move to the next player
        //this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        this.currentPlayerIndex = nextPlayerIndex;
    }

    isBotTurn(): boolean {
        // Check if the current player is a bot
        return this.bots.includes(this.currentPlayerIndex);
    }

    getCurrentDirection(): string {
        return this.playDirection.getDirection();
    }

    checkWinner(): number | null {
        // Check if any player has run out of cards and won the game
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].cards.length === 0) {
                return i; // Return the index of the winner
            }
        }
        return null;  // Return null if no winner yet
    }
}
