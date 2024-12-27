// src/Hand.ts

import { Card, Color, Value } from './Card';
import { UnoDeck } from "./Deck";

/**
 * UnoHand from Assignment 1. We keep the same methods:
 *   - playCard()
 *   - isPlayable()
 *   - drawCard()
 *
 * We do not store the player's name here (that is in UnoGame).
 */
export class UnoHand {
    cards: Card[] = [];

    /**
     * Attempt to play a card from this hand onto the discard pile,
     * if it is playable given the current color or top discard.
     * This returns true if successful, or false if not playable.
     */
    playCard(card: Card, discardPile: Card[], currentColor: Color | null): boolean {
        const topCard = discardPile[discardPile.length - 1];

        if (this.isPlayable(card, topCard, currentColor)) {
            // remove from hand
            this.cards = this.cards.filter((c) => c !== card);
            // place on discard
            discardPile.push(card);
            return true;
        }

        return false;
    }

    /**
     * isPlayable(): decides if card can be placed on top of the discard
     * given the currentColor (which might be forced by a wild).
     */
    isPlayable(card: Card, topCard: Card, currentColor: Color | null): boolean {
        // Wild is always playable
        if (card.color === Color.Wild) {
            return true;
        }
        // Otherwise must match color or value
        if (currentColor) {
            // If a color was chosen due to a Wild, we must match that color or topCard's value
            return card.color === currentColor || card.value === topCard.value;
        } else {
            // If currentColor is null (maybe start of game?), rely on topCard color
            return card.color === topCard.color || card.value === topCard.value;
        }
    }

    /**
     * drawCard(): draw the top card from the deck and place in this hand
     */
    drawCard(deck: UnoDeck): void {
        const card = deck.draw();
        if (card) {
            this.cards.push(card);
        }
    }
}
