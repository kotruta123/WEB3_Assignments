import { Card, Color } from './Card';
import {UnoDeck} from "./Deck";

export class UnoHand {
    cards: Card[] = [];

    playCard(card: Card, discardPile: Card[], currentColor: Color | null): boolean {
        // Add logic to play a card, add it to the discard pile if valid
        if (this.isPlayable(card, discardPile[discardPile.length - 1], currentColor)) {
            this.cards = this.cards.filter(c => c !== card); // Remove the card from hand
            discardPile.push(card); // Add to discard pile
            return true;
        }
        return false;
    }

    isPlayable(card: Card, topCard: Card, currentColor: Color | null): boolean {
        // Wild cards can always be played
        if(card.value.toLowerCase() === 'wild' || card.value.toLocaleLowerCase() === '+4') {
            return true;
        }
        if(currentColor) {
            return card.color === currentColor || card.value === topCard.value;
        }
        // Check if the card can be played on top of the topCard
        return (
            card.color === topCard.color ||
            card.value === topCard.value ||
            card.color === Color.Wild // Correct comparison using the enum Color.Wild
        );
    }

    drawCard(deck: UnoDeck): void {
        const card = deck.draw();
        if (card) {
            this.cards.push(card);  // Add the drawn card to the player's hand
        }
    }
}
