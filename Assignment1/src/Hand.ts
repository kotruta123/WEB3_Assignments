import {Card, Color} from './Card';
import { Deck } from './Deck';

export interface Hand {
    cards: Card[];
    drawCard(deck: Deck): void;
    playCard(card: Card, discardPile: Card[]): boolean;
    hasPlayableCard(discardPile: Card[]): boolean;
    callUno(): void;
    forgotToCallUno(): boolean;
    resetUnoCall(): void;
}

export class UnoHand implements Hand {
    cards: Card[] = [];
    private calledUno: boolean = false;

    drawCard(deck: Deck): void {
        const card = deck.draw();
        if (card) {
            this.cards.push(card);
        }
    }

    playCard(card: Card, discardPile: Card[]): boolean {
        const topCard = discardPile[discardPile.length - 1];
        if (this.isPlayable(card, topCard)) {
            discardPile.push(card);
            this.cards = this.cards.filter(c => c !== card);

            // Check if this is the second-to-last card
            if (this.cards.length === 1 && !this.calledUno) {
                console.log("You must call UNO!");
            }

            return true;
        }
        return false;
    }

    callUno(): void {
        if (this.cards.length === 1) {
            this.calledUno = true;
            console.log("UNO!");
        } else {
            console.log("You can only call UNO when you have one card left.");
        }
    }

    hasPlayableCard(discardPile: Card[]): boolean {
        const topCard = discardPile[discardPile.length - 1];
        return this.cards.some(card => this.isPlayable(card, topCard));
    }

    forgotToCallUno(): boolean {
        return this.cards.length === 1 && !this.calledUno;
    }

    resetUnoCall(): void {
        this.calledUno = false; // Reset after each turn
    }

    private isPlayable(card: Card, topCard: Card): boolean {
        return card.color === topCard.color || card.value === topCard.value || card.color === Color.Wild;
    }
}
