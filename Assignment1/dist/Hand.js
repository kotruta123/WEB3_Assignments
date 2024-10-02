"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnoHand = void 0;
const Card_1 = require("./Card");
class UnoHand {
    constructor() {
        this.cards = [];
        this.calledUno = false;
    }
    drawCard(deck) {
        const card = deck.draw();
        if (card) {
            this.cards.push(card);
        }
    }
    playCard(card, discardPile) {
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
    callUno() {
        if (this.cards.length === 1) {
            this.calledUno = true;
            console.log("UNO!");
        }
        else {
            console.log("You can only call UNO when you have one card left.");
        }
    }
    hasPlayableCard(discardPile) {
        const topCard = discardPile[discardPile.length - 1];
        return this.cards.some(card => this.isPlayable(card, topCard));
    }
    forgotToCallUno() {
        return this.cards.length === 1 && !this.calledUno;
    }
    resetUnoCall() {
        this.calledUno = false; // Reset after each turn
    }
    isPlayable(card, topCard) {
        return card.color === topCard.color || card.value === topCard.value || card.color === Card_1.Color.Wild;
    }
}
exports.UnoHand = UnoHand;
