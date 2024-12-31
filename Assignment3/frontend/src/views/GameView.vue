<template>
  <div class="game">
    <h1>UNO Game</h1>

    <!-- =========================
         WILD COLOR SELECT MODAL
         ========================= -->
    <div ref="wildColorsModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Select a color</h2>
        </div>
        <div class="modal-body">
          <!-- Four color buttons -->
          <button
              @click="selectWildColor('green')"
              class="modal-button"
              style="background-color: #379711"
          />
          <button
              @click="selectWildColor('red')"
              class="modal-button"
              style="background-color: #D72600"
          />
          <button
              @click="selectWildColor('blue')"
              class="modal-button"
              style="background-color: #0956BF"
          />
          <button
              @click="selectWildColor('yellow')"
              class="modal-button"
              style="background-color: #ECD407"
          />
        </div>
      </div>
    </div>

    <!-- =========================
         COLOR INDICATOR
         ========================= -->
    <div class="playing-color" :style="{ backgroundColor: discardCardColor }">
      Currently Played Color
    </div>

    <!-- =========================
         CENTER AREA
         (DECK + DISCARD PILE)
         ========================= -->
    <div class="center-area">
      <!-- Deck to draw from -->
      <div class="deck" @click="handleDeckClick">
        <img
            src="/images/drawing.png"
            alt="Deck"
            class="deck-image"
        />
      </div>

      <!-- Discard pile -->
      <div class="discard-pile">
        <img
            v-if="discardPileTop"
            :src="getCardImage(discardPileTop)"
            alt="Discard Pile"
            class="card"
        />
        <!-- Older cards (stacked behind) -->
        <div
            v-for="(card, index) in discardPile.slice(0, -1)"
            :key="index"
            class="discard-stack"
        >
          <img :src="getCardImage(card)" class="discard-card" />
        </div>
      </div>
    </div>

    <!-- =========================
         PLAYER AREA
         ========================= -->
    <div class="player-area" v-if="players && players.length > 0">
      <!-- HUMAN (bottom) -->
      <div
          class="player player-bottom"
          v-if="players[0]"
          :class="{ 'active-turn': isCurrentPlayer(0) }"
      >
        <div class="player-info">
          <img
              src="/images/player_avatar.png"
              alt="Player Avatar"
              class="avatar"
          />
          <h3>Player</h3>
        </div>
        <PlayerHand
            :hand="players[0].cards"
            @cardSelected="selectCard"
            :selectedCard="selectedCard"
        />
      </div>

      <!-- BOT 1 (left) -->
      <div
          class="player player-left"
          v-if="players[1]"
          :class="{ 'active-turn': isCurrentPlayer(1) }"
      >
        <div class="player-info">
          <img
              src="/images/bot_avatar_1.png"
              alt="Bot 1 Avatar"
              class="avatar"
          />
          <h3>Bot 1</h3>
          <div class="bot-hand">
            <img
                src="/images/background.png"
                alt="Bot's Card"
                class="bot-card"
                v-for="i in players[1].cards.length"
                :key="i"
            />
          </div>
        </div>
      </div>

      <!-- BOT 2 (top) -->
      <div
          class="player player-top"
          v-if="players[2]"
          :class="{ 'active-turn': isCurrentPlayer(2) }"
      >
        <div class="player-info">
          <img
              src="/images/bot_avatar_2.png"
              alt="Bot 2 Avatar"
              class="avatar"
          />
          <h3>Bot 2</h3>
          <div class="bot-hand">
            <img
                src="/images/background.png"
                alt="Bot's Card"
                class="bot-card"
                v-for="i in players[2].cards.length"
                :key="i"
            />
          </div>
        </div>
      </div>

      <!-- BOT 3 (right) -->
      <div
          class="player player-right"
          v-if="players[3]"
          :class="{ 'active-turn': isCurrentPlayer(3) }"
      >
        <div class="player-info">
          <img
              src="/images/bot_avatar_3.png"
              alt="Bot 3 Avatar"
              class="avatar"
          />
          <h3>Bot 3</h3>
          <div class="bot-hand">
            <img
                src="/images/background.png"
                alt="Bot's Card"
                class="bot-card"
                v-for="i in players[3].cards.length"
                :key="i"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- =========================
         CONTROLS (UNO + PLAY)
         ========================= -->
    <div class="controls">
      <button
          @click="callUno"
          :disabled="gameOver"
          class="play-button"
      >
        UNO!
      </button>
      <button
          @click="playTurn"
          :disabled="(!selectedCard && !isBotTurn) || gameOver"
          class="play-button"
      >
        Play Turn
      </button>
    </div>
  </div>
</template>

<script>
import PlayerHand from "@/views/PlayerHand.vue";
import { UnoGame } from "@/game/Game.ts";
/**
 * If you have a custom "Wild +2" in your `Card.ts`,
 * e.g. Value.WildDrawTwo = "wild+2" or "wilddrawtwo",
 * make sure the strings in this file match those in your game logic!
 */
import { Value } from "@/game/Card.ts";

export default {
  components: {
    PlayerHand
  },
  data() {
    return {
      game: null,
      players: [],
      discardPile: [],
      discardPileTop: null,
      selectedCard: null,
      gameOver: false,
      isClockwise: true,
      selectedWildColor: null,
      previousPlayerIndex: null,

      // UNO logic
      unoCalled: false,
      botUnoStates: []
    };
  },
  mounted() {
    // Initialize using route param "bots"
    this.initializeGame(parseInt(this.$route.params.bots, 10));
  },
  watch: {
    // If route changes, re-init
    '$route.params.bots'(newBots) {
      this.initializeGame(parseInt(newBots, 10));
    }
  },
  methods: {
    initializeGame(numBots) {
      console.log("Starting UnoGame with", numBots, "bots");
      this.game = new UnoGame(1, numBots); // 1 human + X bots
      this.players = this.game.players;
      this.discardPile = this.game.discardPile;
      this.discardPileTop = this.discardPile[this.discardPile.length - 1];

      this.gameOver = false;
      this.selectedWildColor = null;
      this.unoCalled = false;
      // Track each bot’s UNO call
      this.botUnoStates = this.players.map(() => false);
    },

    // Human calls UNO
    callUno() {
      this.unoCalled = true;
      alert("You have declared UNO!");
    },

    // Main play method
    playTurn() {
      if (!this.game) return;

      console.log("Is it bot turn?", this.isBotTurn);
      const currentIndex = this.game.currentPlayerIndex;
      const currentPlayer = this.game.currentPlayer();

      // If it's the HUMAN
      if (!this.isBotTurn) {
        // If we have no playable cards
        if (!this.canPlayCard) {
          this.drawCard();
          this.skipTurn();
          return;
        }

        // If no card is selected
        if (!this.selectedCard) {
          alert("Please select a card to play!");
          return;
        }

        // If it's a Wild, Wild +4, or *custom* Wild +2
        const valLower = this.selectedCard.value.toLowerCase();
        if (
            valLower === Value.Wild.toLowerCase() ||         // "wild"
            valLower === Value.WildDrawFour.toLowerCase() || // "+4" or "wilddrawfour"
            valLower === "wild+2"                            // if you have a custom wild+2
        ) {
          // Show color picker
          this.openModal();
        } else {
          // Attempt normal play
          const success = this.game.playCard(this.selectedCard);
          if (!success) {
            alert("You can't play this card!");
          } else {
            this.previousPlayerIndex = currentIndex;
            // Check UNO logic
            this.handleUnoForCurrentPlayer(currentIndex);
            // Clear selection
            this.selectedCard = null;
            // Update UI
            this.updateGameState();
          }
        }
      }
      // If it's a BOT
      else {
        setTimeout(() => {
          this.playBotTurn();
        }, 1000);
      }
    },

    // Bot turn logic
    playBotTurn() {
      const botIndex = this.game.currentPlayerIndex;
      const botPlayer = this.game.currentPlayer();

      // See which cards are playable
      const playable = botPlayer.cards.filter(c =>
          botPlayer.isPlayable(c, this.discardPileTop, this.game.currentColor)
      );

      let success = false;
      if (playable.length > 0) {
        const cardToPlay = playable[0];
        const valLower = cardToPlay.value.toLowerCase();

        // If it's a wild, +4, or custom wild+2 => pick color
        if (
            valLower === Value.Wild.toLowerCase() ||
            valLower === Value.WildDrawFour.toLowerCase() ||
            valLower === "wild+2"
        ) {
          const chosenColor = this.selectBotColor();
          success = this.game.playCard(cardToPlay, chosenColor);
          console.log(`Bot ${botIndex} played ${cardToPlay.value} choosing color ${chosenColor}`);
        } else {
          // Normal card
          success = this.game.playCard(cardToPlay);
          console.log(`Bot ${botIndex} played ${cardToPlay.color} ${cardToPlay.value}`);
        }

        if (success) {
          this.previousPlayerIndex = botIndex;
          this.handleUnoForCurrentPlayer(botIndex);
        }
      }
      else {
        // No playable => draw
        botPlayer.drawCard(this.game.drawPile);
        console.log(`Bot ${botIndex} drew a card`);
      }
      // Update UI
      this.updateGameState();
    },

    // Called if the human can't play
    skipTurn() {
      alert("No playable cards. Turn skipped.");
      this.game.currentPlayerIndex = this.game.playDirection.getNextPlayerIndex(
          this.game.currentPlayerIndex,
          this.game.players.length
      );
      this.updateGameState();
    },

    // Re-check top discard, direction, possible winner
    updateGameState() {
      this.discardPileTop = this.discardPile[this.discardPile.length - 1];
      this.isClockwise = (this.game.getCurrentDirection() === "clockwise");

      const winnerIndex = this.game.checkWinner();
      if (winnerIndex !== null) {
        alert(`Player ${winnerIndex + 1} wins!`);
        this.gameOver = true;
        // Redirect to setup after short wait
        setTimeout(() => {
          this.$router.push({ name: "setup" });
        }, 3000);
        return;
      }

      // If next is a bot, auto-play
      if (this.isBotTurn) {
        this.playTurn();
      }
    },

    // UNO logic when dropping to 1 card
    handleUnoForCurrentPlayer(index) {
      const handSize = this.players[index].cards.length;
      if (handSize === 1) {
        // If it's the human
        if (index === 0) {
          // If not called => possible penalty
          if (!this.unoCalled) {
            this.maybeGetCaughtNotCallingUno(index);
          }
          // reset
          this.unoCalled = false;
        } else {
          // Bot might forget
          const chance = Math.random();
          const botCallsUNO = chance < 0.7; // e.g. 70% chance
          this.botUnoStates[index] = botCallsUNO;
          if (!botCallsUNO) {
            console.log(`Bot ${index} forgot to call UNO!`);
            this.maybeGetCaughtNotCallingUno(index);
          } else {
            console.log(`Bot ${index} called UNO!`);
          }
        }
      }
    },

    // Penalty if someone didn't call UNO
    maybeGetCaughtNotCallingUno(index) {
      const nextIndex = this.game.playDirection.getNextPlayerIndex(index, this.players.length);
      // 50% chance next player catches them
      if (Math.random() < 0.5) {
        alert(`Player ${index + 1} did NOT call UNO and was caught! Draw 2 penalty cards.`);
        for (let i = 0; i < 2; i++) {
          this.players[index].drawCard(this.game.drawPile);
        }
      }
    },

    // Select card from the player's hand
    selectCard(card) {
      this.selectedCard = card;
    },

    // The human draws from the deck
    drawCard() {
      const p = this.game.currentPlayer();
      p.drawCard(this.game.drawPile);
      this.updateGameState();
    },

    // Show modal to pick color
    openModal() {
      if (this.$refs.wildColorsModal) {
        this.$refs.wildColorsModal.style.display = "block";
      }
    },

    // Color chosen => finalize play
    selectWildColor(color) {
      if (this.$refs.wildColorsModal) {
        this.$refs.wildColorsModal.style.display = "none";
      }
      this.selectedWildColor = color;
      // Attempt to play the wild card with chosen color
      const success = this.game.playCard(this.selectedCard, color);
      if (success) {
        this.handleUnoForCurrentPlayer(this.game.currentPlayerIndex);
        this.updateGameState();
      }
      // clear
      this.selectedCard = null;
    },

    // If the user tries to draw while still having a playable card
    handleDeckClick() {
      if (!this.canPlayCard) {
        this.drawCard();
      } else {
        alert("You have at least one playable card. You cannot draw right now.");
      }
    },

    // Bot picks a color, typically the one they have the most of
    selectBotColor() {
      const botPlayer = this.game.currentPlayer();
      const colorCount = { red: 0, green: 0, blue: 0, yellow: 0 };

      botPlayer.cards.forEach(card => {
        const c = card.color.toLowerCase();
        if (colorCount[c] !== undefined) {
          colorCount[c]++;
        }
      });

      let chosen = "red";
      let maxCount = -1;
      for (const clr in colorCount) {
        if (colorCount[clr] > maxCount) {
          maxCount = colorCount[clr];
          chosen = clr;
        }
      }

      // If no color, pick random
      if (maxCount <= 0) {
        const randomColors = ["red", "green", "blue", "yellow"];
        chosen = randomColors[Math.floor(Math.random() * randomColors.length)];
      }
      return chosen;
    },

    // Check if it's a player's turn
    isCurrentPlayer(index) {
      if (!this.game) return false;
      return this.game.currentPlayerIndex === index;
    },

    // Build the card image path
    getCardImage(card) {
      const valLower = card.value.toLowerCase();
      const colLower = card.color.toLowerCase();

      // If you have "wild+2" as a custom name
      if (valLower === "wild" || valLower === "wild ") {
        return "/images/wild_wild.png";
      }
      if (valLower === "+4" || valLower === "wilddrawfour") {
        return "/images/wild_+4.png";
      }
      if (valLower === "wild+2" || valLower === "wilddrawtwo") {
        return "/images/wild_+2.png";
      }
      if (valLower === "reverse") {
        return `/images/${colLower}_reverse.png`;
      }
      if (valLower === "skip") {
        return `/images/${colLower}_skip.png`;
      }
      if (valLower === "drawtwo" || valLower === "+2") {
        return `/images/${colLower}_+2.png`;
      }
      // else number card
      return `/images/${colLower}_${valLower}.png`;
    }
  },
  computed: {
    // If current player is a bot
    isBotTurn() {
      if (!this.game) return false;
      return this.game.isBotTurn();
    },
    // Show the color or fallback if wild is on top
    discardCardColor() {
      if (this.discardPileTop) {
        const valLower = this.discardPileTop.value.toLowerCase();
        if (
            valLower === "wild" ||
            valLower === "+4" ||
            valLower === "wilddrawfour" ||
            valLower === "wild+2" ||
            valLower === "wilddrawtwo"
        ) {
          // if we selected a color
          return this.selectedWildColor ? this.selectedWildColor.toLowerCase() : "transparent";
        }
        // Otherwise, use the discard's color
        if (this.discardPileTop.color) {
          return this.discardPileTop.color.toLowerCase();
        }
      }
      return "transparent";
    },
    // If the human can play any card
    canPlayCard() {
      if (!this.game) return false;
      const p = this.game.currentPlayer();
      // Check if at least one card is playable
      return p.cards.some(card =>
          p.isPlayable(card, this.discardPileTop, this.game.currentColor)
      );
    }
  }
};
</script>

<style scoped>
/* Basic styling with a somewhat centered layout */

.game {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
  height: 100vh;
  width: 100vw;
  color: white;
  position: relative;
  overflow: hidden;
  padding-top: 20px;
}

h1 {
  margin-bottom: 10px;
}

/* Center area */
.center-area {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
}
.deck {
  margin-right: 40px;
  cursor: pointer;
}
.deck-image {
  width: 100px;
  height: 150px;
}
.discard-pile {
  position: relative;
  width: 100px;
  height: 150px;
}
.card {
  width: 100px;
  height: 150px;
  position: absolute;
}
.discard-stack {
  position: absolute;
  top: 0;
  left: 0;
  transform: translateY(8px);
  z-index: -1;
}
.discard-card {
  width: 100px;
  height: 150px;
}

/* Current color box */
.playing-color {
  width: 150px;
  height: 150px;
  position: absolute;
  right: 50px;
  bottom: 50px;
  text-align: center;
  color: black;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid #fff;
  border-radius: 8px;
}

/* Player layout */
.player-area {
  position: relative;
  width: 100%;
  height: 55%;
}
.player {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.player-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 5px;
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-bottom: 5px;
}
.bot-hand {
  display: flex;
  justify-content: center;
}
.bot-card {
  width: 50px;
  height: 75px;
  margin-left: -10px;
}

/* Positions for up to 4 players */
.player-bottom {
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 0);
}
.player-left {
  left: 30px;
  top: 50%;
  transform: translate(0, -50%);
}
.player-top {
  top: 0;
  left: 50%;
  transform: translate(-50%, 0);
}
.player-right {
  right: 30px;
  top: 50%;
  transform: translate(0, -50%);
}

/* Modal */
.modal {
  display: none;
  position: absolute;
  z-index: 3;
  margin: auto;
  width: 40%;
  height: 40%;
  overflow: auto;
}
.modal-content {
  position: relative;
  background-color: #fefefe;
  margin: auto;
  padding: 0;
  border: 1px solid #888;
  width: 80%;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),
  0 6px 20px 0 rgba(0,0,0,0.19);
  animation: animatetop 0.4s;
}
@keyframes animatetop {
  from { top:-300px; opacity:0 }
  to { top:0; opacity:1 }
}
.modal-header {
  padding: 2px 16px;
  background-color: #5cb85c;
  color: white;
}
.modal-body {
  padding: 2px 16px;
}
.modal-button {
  width: 50px;
  height: 50px;
  cursor: pointer;
  margin: 10px;
}

/* Controls area */
.controls {
  margin-top: 30px;
  display: flex;
  gap: 20px;
}
.play-button {
  padding: 10px 20px;
  background-color: #27ae60;
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 16px;
  cursor: pointer;
}
.play-button[disabled] {
  background-color: #ccc;
  cursor: not-allowed;
}
.play-button:hover:enabled {
  background-color: #2ecc71;
}

/* Turn highlight */
.active-turn {
  border: 2px solid #ffcc00;
}
</style>
