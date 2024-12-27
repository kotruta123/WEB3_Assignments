// tests/uno.test.ts
import { UnoGame } from "../src/Game";
import { Card, Color, Value, Points } from "../src/Card";

describe("UNO Game Tests", () => {
    test("Game initializes with correct number of players and bots", () => {
        const game = new UnoGame(2, 1);
        expect(game.players.length).toBe(3); // 2 humans + 1 bot
        expect(game.scores.length).toBe(3);  // scores array matches player count
    });

    test("Each player starts with 7 cards", () => {
        const game = new UnoGame(3, 0);
        for (let i = 0; i < game.players.length; i++) {
            expect(game.players[i].cards.length).toBe(7);
        }
    });

    test("Playing a valid card removes it from hand and adds it to discard", () => {
        const game = new UnoGame(2, 0);

        // Force top discard so the next card is definitely playable:
        game.discardPile = [ new Card(Color.Red, Value.Three, Points.Three) ];

        // Insert a matching red card into current player's hand:
        const validCard = new Card(Color.Red, Value.Seven, Points.Seven);
        game.currentPlayer().cards.push(validCard);
        const initialHandSize = game.currentPlayer().cards.length;

        // Try to play it without specifying a wild color (not needed for a normal red card)
        const wasPlayed = game.playCard(validCard);
        expect(wasPlayed).toBe(true);

        // If played successfully, the hand should shrink by 1
        expect(game.currentPlayer().cards.length).toBe(initialHandSize - 1);

        // And top of discard is now that card
        expect(game.discardPile[game.discardPile.length - 1]).toBe(validCard);
    });

    test("Playing an unplayable card should fail and not remove it from the hand", () => {
        const game = new UnoGame(2, 0);

        // Suppose top discard is Red 3
        game.discardPile = [ new Card(Color.Red, Value.Three, Points.Three) ];

        // Insert a Blue 7 in current player's hand
        const unplayableCard = new Card(Color.Blue, Value.Seven, Points.Seven);
        game.currentPlayer().cards.push(unplayableCard);
        const initialHandSize = game.currentPlayer().cards.length;

        // Attempt to play it as if it were wild => no color override needed, it's not wild
        // Or pass Color.Red but the card is not wild => still not matching color or value
        const wasPlayed = game.playCard(unplayableCard, Color.Red);
        expect(wasPlayed).toBe(false); // Should fail

        // Check the hand size is unchanged
        expect(game.currentPlayer().cards.length).toBe(initialHandSize);
        // Check discard top is still Red 3
        expect(game.discardPile[game.discardPile.length - 1].value).toBe(Value.Three);
    });

    test("If a player cannot (or will not) play, forceDraw() adds exactly 1 card", () => {
        const game = new UnoGame(2, 0);
        const beforeCount = game.currentPlayer().cards.length;

        game.forceDraw();
        const afterCount = game.currentPlayer().cards.length;

        expect(afterCount).toBe(beforeCount + 1);
    });

    test("Skip card causes the next player to lose a turn (3 players)", () => {
        const game = new UnoGame(3, 0);

        // Force top discard so skip is definitely playable:
        game.discardPile = [ new Card(Color.Blue, Value.Five, Points.Five) ];

        const skipCard = new Card(Color.Blue, Value.Skip, Points.Skip);
        game.currentPlayer().cards.push(skipCard);

        const currentIndex = game.currentPlayerIndex;
        game.playCard(skipCard); // should skip next player

        // With 3 players, skipping next means we advance by 2 steps
        // next => (currentIndex + 1) mod 3
        // skip => ( (currentIndex + 1) + 1 ) mod 3 => currentIndex + 2
        const expectedNext = (currentIndex + 2) % 3;
        expect(game.currentPlayerIndex).toBe(expectedNext);
    });

    test("+2 card forces the next player to draw 2 and skip turn", () => {
        const game = new UnoGame(3, 0);

        // Force top discard to Red so +2 is playable
        game.discardPile = [ new Card(Color.Red, Value.Three, Points.Three) ];

        const draw2Card = new Card(Color.Red, Value.DrawTwo, Points.DrawTwo);
        game.currentPlayer().cards.push(draw2Card);

        const currentIndex = game.currentPlayerIndex;
        const nextIndex = (currentIndex + 1) % 3;
        const beforeCount = game.players[nextIndex].cards.length;

        game.playCard(draw2Card); // +2

        const afterCount = game.players[nextIndex].cards.length;
        // next player drew 2
        expect(afterCount).toBe(beforeCount + 2);

        // They are also skipped => new current index is (nextIndex + 1) mod 3
        const expectedNext = (nextIndex + 1) % 3;
        expect(game.currentPlayerIndex).toBe(expectedNext);
    });

    test("+4 card forces the next player to draw 4 and skip turn", () => {
        const game = new UnoGame(3, 0);

        // We can play +4 on anything, but let's set top discard to Red 3 anyway
        game.discardPile = [ new Card(Color.Red, Value.Three, Points.Three) ];

        // Insert a Wild +4
        const plus4Card = new Card(Color.Wild, Value.WildDrawFour, Points.WildDrawFour);
        game.currentPlayer().cards.push(plus4Card);

        const currentIndex = game.currentPlayerIndex;
        const nextIndex = (currentIndex + 1) % 3;
        const beforeCount = game.players[nextIndex].cards.length;

        // Choose color => say Green
        game.playCard(plus4Card, Color.Green);

        const afterCount = game.players[nextIndex].cards.length;
        expect(afterCount).toBe(beforeCount + 4);

        // skip them => new current index is nextIndex+1 mod 3
        const expectedNext = (nextIndex + 1) % 3;
        expect(game.currentPlayerIndex).toBe(expectedNext);
    });

    test("Reverse toggles direction if more than 2 players, or acts like skip if only 2 players", () => {
        // Case A: 3 players
        const game3 = new UnoGame(3, 0);

        // Force top discard to Red so Reverse is playable
        game3.discardPile = [ new Card(Color.Red, Value.Five, Points.Five) ];

        const reverseCard3 = new Card(Color.Red, Value.Reverse, Points.Reverse);
        game3.currentPlayer().cards.push(reverseCard3);

        const currentIndex3 = game3.currentPlayerIndex;
        game3.playCard(reverseCard3);
        // Expect direction changed => getCurrentDirection() => anticlockwise
        expect(game3.getCurrentDirection()).toBe("anticlockwise");

        // new currentPlayerIndex => next player in reversed direction
        // normally it would be (current + 1) if direction was 1
        // but now direction is -1 => new index is (current - 1 + 3) % 3 => currentIndex3 + 2 mod 3
        const expected3 = (currentIndex3 + 2) % 3;
        expect(game3.currentPlayerIndex).toBe(expected3);

        // Case B: 2 players => reverse == skip
        const game2 = new UnoGame(2, 0);

        // Force top discard
        game2.discardPile = [ new Card(Color.Blue, Value.Six, Points.Six) ];

        const reverseCard2 = new Card(Color.Blue, Value.Reverse, Points.Reverse);
        game2.currentPlayer().cards.push(reverseCard2);

        const currentIndex2 = game2.currentPlayerIndex;
        game2.playCard(reverseCard2);
        // skip => same player goes again
        expect(game2.currentPlayerIndex).toBe(currentIndex2);
    });

    test("checkWinner() returns the first index with 0 cards", () => {
        const game = new UnoGame(2, 0);
        expect(game.checkWinner()).toBe(null);

        // Force player 1 to have 0 cards
        game.players[1].cards = [];
        // Now check
        expect(game.checkWinner()).toBe(1);
    });

    test("awardPointsToWinner() sums the points in other players' hands", () => {
        const game = new UnoGame(2, 0);

        // Suppose player0 is the winner, so we fill player1's hand with 9, +2, +4
        game.players[1].cards = [
            new Card(Color.Blue, Value.Nine, Points.Nine),
            new Card(Color.Red, Value.DrawTwo, Points.DrawTwo),
            new Card(Color.Wild, Value.WildDrawFour, Points.WildDrawFour),
        ];
        // total = 9 + 20 + 50 = 79

        game.awardPointsToWinner(0);
        expect(game.scores[0]).toBe(79);
    });

    test("awardPointsToWinner() multiple times accumulates scores", () => {
        const game = new UnoGame(3, 0);

        // Round 1: player 2 wins, players 0 & 1 each have 1 card
        game.players[0].cards = [
            new Card(Color.Green, Value.Five, Points.Five),
        ];
        game.players[1].cards = [
            new Card(Color.Blue, Value.DrawTwo, Points.DrawTwo),
        ];
        // total = 5 + 20 = 25
        game.awardPointsToWinner(2);
        expect(game.scores[2]).toBe(25);

        // Round 2: player 1 wins, players 0 & 2 have leftover
        game.players[0].cards = [
            new Card(Color.Red, Value.Nine, Points.Nine),
        ];
        game.players[2].cards = [
            new Card(Color.Wild, Value.Wild, Points.Wild),
            new Card(Color.Blue, Value.Reverse, Points.Reverse),
        ];
        // total = 9 + 50 + 20 = 79
        game.awardPointsToWinner(1);
        expect(game.scores[1]).toBe(79);

        // Check that player 2 still has 25 from before
        expect(game.scores[2]).toBe(25);
    });

    test("UNO penalty: if player goes to 1 card without calling sayUno(), they draw 4 next time they get a turn", () => {
        const game = new UnoGame(2, 0);

        // Player0 has exactly 2 cards
        game.players[0].cards = [
            new Card(Color.Red, Value.Three, Points.Three),
            new Card(Color.Yellow, Value.Four, Points.Four),
        ];

        // Force top discard => red 3
        game.discardPile = [ new Card(Color.Red, Value.Two, Points.Two) ];

        // They do NOT sayUno(). Then they play 1 card => goes to 1
        const played = game.playCard(game.players[0].cards[0]);
        expect(played).toBe(true);

        // Turn now moves to player1
        // Let's have player1 do a forceDraw
        game.forceDraw();
        // Then next turn => back to player0. The penalty is applied in advanceTurn() logic (if coded as such).

        // We must call advanceTurn() to simulate player1 finishing
        game.advanceTurn(); // from player1 to player0

        // Now we check if they drew 4
        // They had 1 left, plus 4 => 5
        expect(game.players[0].cards.length).toBe(5);
    });

    test("UNO penalty: if player says UNO (sayUno()), they do NOT get penalized", () => {
        const game = new UnoGame(2, 0);

        // Player0 has exactly 2 cards
        game.players[0].cards = [
            new Card(Color.Red, Value.Nine, Points.Nine),
            new Card(Color.Green, Value.Two, Points.Two),
        ];

        // Force discard => Red 5
        game.discardPile = [ new Card(Color.Red, Value.Five, Points.Five) ];

        // They *do* say UNO
        game.sayUno();

        // Then they play 1 red card => goes to 1 left
        const played = game.playCard(game.players[0].cards[0]);
        expect(played).toBe(true);
        expect(game.players[0].cards.length).toBe(1);

        // Turn moves to player1
        // Let player1 do a forceDraw
        game.forceDraw();

        // Turn passes back to player0
        game.advanceTurn();

        // Now check if they were penalized => they should NOT be
        expect(game.players[0].cards.length).toBe(1);
    });
});
