// src/index.ts

import { UnoGame } from './Game';
import { Card, Color, Value } from './Card';

function main() {
    // Create a 3-player game, 0 bots
    const game = new UnoGame(3, 0);

    console.log("Starting a new UNO game!");
    console.log("Initial scores:", game.scores);
    console.log("Current player is:", game.currentPlayerIndex);

    // Example usage:
    const currentHand = game.currentPlayer().cards;
    console.log("Current hand:", currentHand);

    // Attempt to play first card in current player's hand
    if (currentHand.length > 0) {
        const firstCard = currentHand[0];
        console.log("Trying to play:", firstCard);

        const played = game.playCard(firstCard, Color.Red /* pick color if it's wild */);
        console.log("Was it played?", played);

        // see who is next
        console.log("Next player index:", game.currentPlayerIndex);
    }

    // check winner
    const winner = game.checkWinner();
    if (winner !== null) {
        console.log("We have a winner! Player index:", winner);
        game.awardPointsToWinner(winner);
        console.log("Scores:", game.scores);
    }

    console.log("End of demo.");
}

main();
