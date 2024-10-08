<template>
  <div class="game">
    <h1>UNO Game</h1>

    <!-- Deck and Discard Pile at the center -->
    <div class="center-area">
      <div class="deck" @click="drawCard">
        <img src="/images/drawing.png" alt="Deck" class="deck-image" />
      </div>
      <div class="discard-pile">
        <img
            v-if="discardPileTop"
            :src="getCardImage(discardPileTop)"
            alt="Discard Pile"
            class="card"
        />
        <!-- Stack of discarded cards -->
        <div v-for="(card, index) in discardPile.slice(0, -1)" :key="index" class="discard-stack">
          <img :src="getCardImage(card)" class="discard-card" />
        </div>
      </div>
    </div>

    <!-- Players and Bots - Circular Layout -->
    <div class="player-area" v-if="players && players.length > 0">
      <!-- Player Hand (Bottom) -->
      <div class="player player-bottom" v-if="players[0]" :class="{ 'active-turn': isCurrentPlayer(0) }">
        <div class="player-info">
          <img src="/images/player_avatar.png" alt="Player Avatar" class="avatar" />
          <h3>Player</h3>
        </div>
        <PlayerHand :hand="players[0].cards" @cardSelected="selectCard" :selectedCard="selectedCard" />
      </div>

      <!-- Bot 1 (Left) -->
      <div class="player player-left" v-if="players[1]" :class="{ 'active-turn': isCurrentPlayer(1) }">
        <div class="player-info">
          <img src="/images/bot_avatar_1.png" alt="Bot 1 Avatar" class="avatar" />
          <h3>Bot 1</h3>
          <div class="bot-hand">
            <img src="/images/background.png" alt="Bot's Cards" class="bot-card" v-for="i in players[1].cards.length" :key="i" />
          </div>
        </div>
      </div>

      <!-- Bot 2 (Top) -->
      <div class="player player-top" v-if="players[2]" :class="{ 'active-turn': isCurrentPlayer(2) }">
        <div class="player-info">
          <img src="/images/bot_avatar_2.png" alt="Bot 2 Avatar" class="avatar" />
          <h3>Bot 2</h3>
          <div class="bot-hand">
            <img src="/images/background.png" alt="Bot's Cards" class="bot-card" v-for="i in players[2].cards.length" :key="i" />
          </div>
        </div>
      </div>

      <!-- Bot 3 (Right) -->
      <div class="player player-right" v-if="players[3]" :class="{ 'active-turn': isCurrentPlayer(3) }">
        <div class="player-info">
          <img src="/images/bot_avatar_3.png" alt="Bot 3 Avatar" class="avatar" />
          <h3>Bot 3</h3>
          <div class="bot-hand">
            <img src="/images/background.png" alt="Bot's Cards" class="bot-card" v-for="i in players[3].cards.length" :key="i" />
          </div>
        </div>
      </div>
    </div>

    <button @click="playTurn" :disabled="!selectedCard && !isBotTurn" class="play-button">Play Turn</button>

    <!-- Circular Arrow Animation -->
    <div class="turn-arrow" :class="{ clockwise: isClockwise, counterclockwise: !isClockwise }" v-if="!gameOver">
      <img src="/images/arrow.png" alt="Turn Arrow" class="arrow-image" />
    </div>
  </div>
</template>

<script>
import PlayerHand from "@/views/PlayerHand.vue";
import { UnoGame} from "@/game/Game.ts";

export default {
  components: {
    PlayerHand,
  },
  data() {
    return {
      game: null,
      players: [],
      discardPileTop: null,
      discardPile: [],
      selectedCard: null,
      gameOver: false,
      isClockwise: true, // to track the direction of play
    };
  },
  mounted() {
    this.initializeGame();
  },
  methods: {
    initializeGame() {
      const numBots = 3;
      this.game = new UnoGame(1, numBots);
      this.players = this.game.players;
      this.discardPile = this.game.discardPile;
      this.discardPileTop = this.game.discardPile[this.game.discardPile.length - 1];
    },
    playTurn() {
      if (!this.game) return;

      const currentPlayer = this.game.currentPlayer();

      if (!this.isBotTurn) {
        if (!this.selectedCard) {
          alert("Please select a card to play!");
          return;
        }

        if (this.game.playCard(this.selectedCard)) {
          this.selectedCard = null;
          this.updateGameState();
        } else {
          alert("You can't play this card!");
        }
      } else {
        setTimeout(() => {
          this.playBotTurn();
        }, 2000);
      }
    },
    playBotTurn() {
      if (!this.game) return;

      const botPlayer = this.game.currentPlayer();
      const playableCards = botPlayer.cards.filter(card =>
          botPlayer.isPlayable(card, this.discardPileTop)
      );

      if (playableCards.length > 0) {
        const cardPlayed = this.game.playCard(playableCards[0]);
        if (cardPlayed.value === 'Reverse') {
          this.reverseDirection();
        }
      } else {
        botPlayer.drawCard(this.game.drawPile);
      }

      this.updateGameState();
    },
    updateGameState() {
      if (!this.game) return;

      this.discardPileTop = this.game.discardPile[this.game.discardPile.length - 1];
      if (!this.game.checkWinner()) {
        this.playTurn();
      }
    },
    reverseDirection() {
      this.isClockwise = !this.isClockwise;
      this.game.reverseOrder();
    },
    isCurrentPlayer(index) {
      return this.game && index === this.game.currentPlayerIndex;
    },
    selectCard(card) {
      this.selectedCard = card;
    },
    drawCard() {
      if (!this.game) return;

      const currentPlayer = this.game.currentPlayer();
      currentPlayer.drawCard(this.game.drawPile);
      this.updateGameState();
    },
    getCardImage(card) {
      if (!card || !card.color || !card.value) {
        return '/images/card-back.png';
      }
      return `/images/${card.color.toLowerCase()}_${card.value.toLowerCase().replace(' ', '')}.png`;
    }
  },
  computed: {
    isBotTurn() {
      if (!this.game) return false;
      return this.game.isBotTurn();
    }
  }
};
</script>

<style scoped>
/* Styling */
.game {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
  height: 100vh;
  color: white;
  position: relative;
  overflow: hidden;
}

.center-area {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.deck {
  position: relative;
  margin-right: 20px;
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
  display: flex;
  align-items: center;
  justify-content: center;
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
  transform: translateY(10px);
  z-index: -1;
}

.discard-card {
  width: 100px;
  height: 150px;
}

.player-area {
  position: relative;
  width: 100%;
  height: 100%;
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
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-bottom: 10px;
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

.player-bottom {
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
}

.player-left {
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
}

.player-top {
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
}

.player-right {
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
}

.play-button {
  padding: 10px 20px;
  margin-top: 20px;
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

.active-turn {
  border: 2px solid #ffcc00;
}

.turn-arrow {
  position: absolute;
  bottom: 20%; /* Adjust to make it lower */
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 50px;
  z-index: 10; /* Ensure it is above other elements */
}

.turn-arrow.clockwise {
  animation: rotate-arrow-clockwise 2s infinite linear;
}

.turn-arrow.counterclockwise {
  animation: rotate-arrow-counterclockwise 2s infinite linear;
}

@keyframes rotate-arrow-clockwise {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes rotate-arrow-counterclockwise {
  0% { transform: rotate(360deg); }
  100% { transform: rotate(0deg); }
}
</style>
