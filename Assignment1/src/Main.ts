import { UnoGame } from './Game';
import { UnoHand } from './Hand';

const game = new UnoGame(3); // 3 players
while (game.checkWinner() === null) {
    const currentPlayer = game.currentPlayer() as UnoHand;

    // If player has one card left, they should call UNO
    if (currentPlayer.cards.length === 1) {
        currentPlayer.callUno(); // The player calls UNO
    }

    game.playTurn();
}

console.log(`Player ${game.checkWinner()} wins!`);
