import { Card, Color } from './Card';
import { UnoHand } from "./Hand";
import { UnoDeck } from "./Deck";
import { PlayDirection } from './PlayDirection';

export class UnoGame {
    players: UnoHand[] = [];         // The list of players
    currentPlayerIndex: number = 0;  // Index of the current player's turn
    drawPile: UnoDeck = new UnoDeck();
    discardPile: Card[] = [];
    bots: number[] = [];
    playDirection: PlayDirection = new PlayDirection();
    currentColor: Color | null = null;

    constructor(playerCount: number, botCount: number) {
        // 1) Create and deal hands
        for (let i = 0; i < playerCount + botCount; i++) {
            const hand = new UnoHand();
            for (let j = 0; j < 7; j++) {
                hand.drawCard(this.drawPile);
            }
            this.players.push(hand);
        }

        // 2) Flip the top card of the deck onto the discard pile
        const firstCard = this.drawPile.draw()!;
        this.discardPile.push(firstCard);

        // 3) Determine the initial color (if the first card is Wild or +4, pick a random color)
        if (
            firstCard.value.toLowerCase() === 'wild' ||
            firstCard.value.toLowerCase() === '+4' ||
            firstCard.value.toLowerCase() === 'wilddrawfour'
        ) {
            this.currentColor = this.selectRandomColor();
        } else {
            this.currentColor = firstCard.color;
        }

        // 4) Mark which players are bots
        for (let i = playerCount; i < playerCount + botCount; i++) {
            this.bots.push(i);
        }
    }

    currentPlayer(): UnoHand {
        return this.players[this.currentPlayerIndex];
    }

    /**
     * Attempt to play a card from the current player's hand.
     * If valid, update the next player (handle +2, +4, etc.)
     */
    playCard(card: Card, selectedColor?: Color): boolean {
        const currentPlayer = this.currentPlayer();

        // Attempt to remove the card from the player's hand (if playable)
        if (currentPlayer.playCard(card, this.discardPile, this.currentColor)) {
            // If success, handle special logic (draw 2, wild color, skip, etc.)
            this.updateNextPlayer(card, selectedColor);
            return true;
        }
        return false;
    }

    /**
     * Pick a random color (Red/Green/Blue/Yellow)
     */
    selectRandomColor(): Color {
        const colors: Color[] = [Color.Green, Color.Red, Color.Blue, Color.Yellow];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    /**
     * Handle the special logic of the card that was just played:
     *   +2, +4, wild +2, wild +4, reverse, skip, etc.
     */
    updateNextPlayer(card: Card, selectedColor?: Color): void {
        // The index of the "would-be" next player
        const nextPlayerIndex = this.playDirection.getNextPlayerIndex(
            this.currentPlayerIndex,
            this.players.length
        );

        const cardValue = card.value.toLowerCase();

        switch(cardValue) {

            // ======================
            // WILD (no draw)
            // ======================
            case 'wild':
                if (selectedColor) {
                    this.currentColor = selectedColor;
                }
                break;

            // ======================
            // WILD +4
            // ======================
            // If your `Card.value` for wild draw four is exactly "+4",
            // or "wilddrawfour", handle it here
            case '+4':
            case 'wilddrawfour':
                if (selectedColor) {
                    this.currentColor = selectedColor;
                }
                // Force next player to draw 4
                for (let i = 0; i < 4; i++) {
                    this.players[nextPlayerIndex].drawCard(this.drawPile);
                }
                // Skip next player's turn
                this.currentPlayerIndex = this.playDirection.getNextPlayerIndex(
                    nextPlayerIndex,
                    this.players.length
                );
                return; // end here

            // ======================
            // WILD +2 (Custom Card)
            // ======================
            // If you have a custom "wild+2" or "wilddrawtwo"
            case 'wild+2':
            case 'wilddrawtwo':
                if (selectedColor) {
                    this.currentColor = selectedColor;
                }
                // Next player draws 2
                for (let i = 0; i < 2; i++) {
                    this.players[nextPlayerIndex].drawCard(this.drawPile);
                }
                // Then skip that player's turn
                this.currentPlayerIndex = this.playDirection.getNextPlayerIndex(
                    nextPlayerIndex,
                    this.players.length
                );
                return;

            // ======================
            // Normal +2
            // ======================
            case '+2':
            case 'drawtwo':
                // For normal color-coded Draw 2 (e.g. Red +2)
                // The color on the card determines currentColor
                this.currentColor = card.color;
                // Next player draws 2
                for (let i = 0; i < 2; i++) {
                    this.players[nextPlayerIndex].drawCard(this.drawPile);
                }
                // skip that player
                this.currentPlayerIndex = this.playDirection.getNextPlayerIndex(
                    nextPlayerIndex,
                    this.players.length
                );
                return;

            // ======================
            // Reverse
            // ======================
            case 'reverse':
                // If 2 players, reverse == skip other
                if (this.players.length === 2) {
                    this.currentPlayerIndex = this.playDirection.getNextPlayerIndex(
                        this.currentPlayerIndex,
                        this.players.length
                    );
                    return;
                }
                // Else toggle direction
                this.playDirection.toggle();
                // The color is set to the card's color
                this.currentColor = card.color;
                break;

            // ======================
            // Skip
            // ======================
            case 'skip':
                // skip next
                this.currentColor = card.color;
                const skippedIndex = this.playDirection.getNextPlayerIndex(
                    nextPlayerIndex,
                    this.players.length
                );
                this.currentPlayerIndex = skippedIndex;
                return;

            // ======================
            // Default = normal card
            // ======================
            default:
                // Just set the color to match the card played
                this.currentColor = card.color;
                break;
        }

        // If we reach here, we haven't returned => normal next turn
        this.currentPlayerIndex = nextPlayerIndex;
    }

    /**
     * Check if it's currently a bot's turn
     */
    isBotTurn(): boolean {
        return this.bots.includes(this.currentPlayerIndex);
    }

    /**
     * e.g. "clockwise" or "anticlockwise"
     */
    getCurrentDirection(): string {
        return this.playDirection.getDirection();
    }

    /**
     * Return the index of the winner if any player has 0 cards. Otherwise null.
     */
    checkWinner(): number | null {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].cards.length === 0) {
                return i;
            }
        }
        return null;
    }
}
