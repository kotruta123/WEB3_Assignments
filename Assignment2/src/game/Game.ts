import { Card, Color } from './Card';
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
    currentColor: Color | null = null;

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
        const firstCard = this.drawPile.draw()!;
        this.discardPile.push(firstCard);

        if(firstCard.value.toLowerCase() === 'wild' || firstCard.value.toLocaleLowerCase() === '+4') {
            this.currentColor = this.selectRandomColor();
        } else {
            this.currentColor = firstCard.color;
        }

        // Assign bot player indexes
        for (let i = playerCount; i < playerCount + botCount; i++) {
            this.bots.push(i);
        }
    }

    currentPlayer(): UnoHand {
        return this.players[this.currentPlayerIndex];
    }

    playCard(card: Card, selectedColor?: Color): boolean {
        const currentPlayer = this.currentPlayer();

        if (currentPlayer.playCard(card, this.discardPile, this.currentColor)) {
            this.updateNextPlayer(card, selectedColor);  // Handle special cards (e.g. +2)
            return true;
        }
        return false;
    }

    selectRandomColor(): Color {
        const colors: Color[] = [Color.Green, Color.Red, Color.Blue, Color.Yellow];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    updateNextPlayer(card: Card, selectedColor?: Color): void {
        // Handle special card logic, e.g., +2 cards

        const nextPlayerIndex = this.playDirection.getNextPlayerIndex(this.currentPlayerIndex, this.players.length);
        const cardValue = card.value.toLocaleLowerCase();

        switch(cardValue) {
            case 'wild':
                if(selectedColor) {
                    this.currentColor = selectedColor;
                }
                break;
            case '+4':
                if(selectedColor){
                    this.currentColor = selectedColor;
                }

                for(let i=0; i < 4; i++) {
                    this.players[nextPlayerIndex].drawCard(this.drawPile);
                }

                this.currentPlayerIndex = this.playDirection.getNextPlayerIndex(nextPlayerIndex, this.players.length);
                return; // return to prevent setting next player index again after switch
            case '+2':
                this.currentColor = card.color;
                for (let i = 0; i < 2; i++) {
                    this.players[nextPlayerIndex].drawCard(this.drawPile);
                }
                this.currentPlayerIndex = this.playDirection.getNextPlayerIndex(nextPlayerIndex, this.players.length);
                return; // return to prevent setting next player index again after switch
            case 'reverse':         
                if(this.players.length === 2) {
                    this.currentPlayerIndex = this.playDirection.getNextPlayerIndex(this.currentPlayerIndex, this.players.length);
                    return;
                }
                this.playDirection.toggle();
                break;
            case 'skip':
                const skippedPlayerIndex = this.playDirection.getNextPlayerIndex(nextPlayerIndex, this.players.length);
                this.currentPlayerIndex = skippedPlayerIndex;
                break;
            default:
                this.currentColor = card.color;
                break;
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
