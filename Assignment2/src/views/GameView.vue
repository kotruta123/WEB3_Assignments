<template>
  <div class="game">
    <h1>UNO Game</h1>

    <!-- Trigger/Open The Modal 
    <button @click="openModal">Open Modal</button>
  -->
    <!-- The Modal -->
    <div ref="wildColorsModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Select a color</h2>
        </div>
        <div class="modal-body">
          <button @click="selectWildColor('green')" class="modal-button" style="background-color: #379711"></button>
          <button @click="selectWildColor('red')" class="modal-button" style="background-color: #D72600"></button>
          <button @click="selectWildColor('blue')" class="modal-button" style="background-color: #0956BF"></button>
          <button @click="selectWildColor('yellow')" class="modal-button" style="background-color: #ECD407;"></button>
        </div>
      </div>
    </div>

    <!--Currently Played Color-->
    <div class="playing-color" :style="{ backgroundColor: discardCardColor }">
      Currently Played Color
    </div>


    <!-- Deck and Discard Pile at the center -->
    <div class="center-area">
      <!-- Draw deck-->
      <div class="deck" @click="handleDeckClick">
        <img 
            src="/images/drawing.png" 
            alt="Deck" 
            class="deck-image"
        />
      </div>
      <!-- Discard deck-->
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
    <!--
    <div class="turn-arrow" :class="{ clockwise: isClockwise, counterclockwise: !isClockwise }" v-if="!gameOver">
      <img src="/images/arrow.png" alt="Turn Arrow" class="arrow-image" />
    </div>
  -->
  </div>
</template>

<script>
import PlayerHand from "@/views/PlayerHand.vue";
import { UnoGame} from "@/game/Game.ts";
import { Value, Color } from "@/game/Card.ts";

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
      selectedWildColor: null,
      previousPlayerIndex: null, // Track previous player
      showUnoIndicator: false, // "Uno" indicator
      mustDrawCards: false,
      drawCount: 0,
    };
  },
  mounted() {
    this.initializeGame(parseInt(this.$route.params.bots, 10));
  },
  watch: {
    '$route.params.bots': function(newBots) {
      this.initializeGame(parseInt(newBots, 10));
    }
  },
  methods: {
    initializeGame(numBots) {
      console.log(numBots)
      this.game = new UnoGame(1, numBots);
      this.players = this.game.players;
      this.discardPile = this.game.discardPile;
      this.discardPileTop = this.game.discardPile[this.game.discardPile.length - 1];
      this.selectedWildColor = null;
    },
    playTurn() {
      if (!this.game) return;

      console.log("Is Bot Turn:", this.isBotTurn);

      const currentPlayer = this.game.currentPlayer();

      if (!this.isBotTurn) {
        
        if(!this.canPlayCard) {
          this.drawCard();
          this.skipTurn();
        }


        if (!this.selectedCard) {
          alert("Please select a card to play!");
          return;
        }

        if(this.selectedCard.value === Value.Wild || this.selectedCard.value === Value.WildDrawFour){
          this.openModal(); 
        } else{
          if (this.game.playCard(this.selectedCard)) {
            this.previousPlayerIndex = this.game.currentPlayerIndex;
            this.updateGameState();
            this.selectedCard = null;
          } else {
            alert("You can't play this card!");
          }
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
          botPlayer.isPlayable(card, this.discardPileTop, this.game.currentColor)
      );

     
      if (playableCards.length > 0) {
        const cardToPlay = playableCards[0];
        let success = false;

        if (cardToPlay.value.toLowerCase() === 'wild' || cardToPlay.value.toLowerCase() === '+4') {
          // Bot selects a color based on its strategy
          const selectedColor = this.selectBotColor();
          this.selectedWildColor = selectedColor;
          success = this.game.playCard(cardToPlay, selectedColor);
          console.log(`Bot has played: ${cardToPlay.color} ${cardToPlay.value} and selected color: ${selectedColor}`);
        } else {
          success = this.game.playCard(cardToPlay);
          console.log(`Bot has played: ${cardToPlay.color} ${cardToPlay.value}`);
        }

        if (success) {
          this.previousPlayerIndex = this.game.currentPlayerIndex;

          if(cardToPlay.value.toLowerCase() === '+2') {
            this.mustDrawCards = true;
            this.drawCount = 2;
          } else if (cardToPlay.value.toLowerCase() === '+4') {
            this.mustDrawCards = true;
            this.drawCount = 4;
          }
        } else {
          console.log(`Bot attempted to play an unplayable card. Value: ${cardToPlay.value}, Color: ${cardToPlay.color}`);
        }
      } else {
          botPlayer.drawCard(this.game.drawPile);
          console.log('Bot drew a card');
      }

      this.updateGameState();
    },
    skipTurn() {
      alert("No playable cards. Your turn is skipped");
      this.game.currentPlayerIndex = this.game.playDirection.getNextPlayerIndex(this.game.currentPlayerIndex, this.game.players.length);
      this.updateGameState();
    },
    updateGameState() {
      if (!this.game) return;

      this.discardPileTop = this.game.discardPile[this.game.discardPile.length - 1];
      this.isClockwise = this.game.getCurrentDirection() === 'clockwise' ? 1 : 0;
      const winnerIndex = this.game.checkWinner();
      if(winnerIndex !== null) {
        //handling game over logic
        alert(`Player ${winnerIndex + 1} wins!`);
        this.gameOver = true;
        return;
      }
      else {
        if(this.isBotTurn) {
          this.playTurn();
        } 
        //else if (!this.canPlayCard){
        //  this.skipTurn();
       // }
        else{

        }
      }
    },
    /*
    reverseDirection() {
      this.isClockwise = !this.isClockwise;
      this.game.reverseOrder();
    },*/
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

      if(!this.canPlayCard) {
        this.skipTurn;
      }
    },
    getCardImage(card) {
      // wild card handling
      if(card.value.toLowerCase().replace(' ', '') === 'wild') {
        return `/images/wild_wild.png`;
      }

      // +4 card handling
      if(card.value.toLowerCase() === '+4') {
        return `/images/wild_+4.png`;
      }

      // Reverse card handling
      if(card.value.toLowerCase() === 'reverse') {
        return `/images/${card.color.toLowerCase()}_reverse.png`;
      }

      // Skip card handling
      if(card.value.toLowerCase() === 'skip') {
        return `/images/${card.color.toLowerCase()}_skip.png`;
      }

      // Draw Two card handling
      if(card.value.toLowerCase() === 'drawtwo') {
        return `/images/${card.color.toLowerCase()}_+2.png`;
      }

      else{
        console.log(card.value);
        return `/images/${card.color.toLowerCase()}_${card.value.toLowerCase().replace(' ', '')}.png`;
      }

    },
    selectWildColor(color){
      this.selectedWildColor = color;

      console.log('Selected Color:', color);
      console.log('Selected Card:', this.selectedCard);

      //closing modal
      this.$refs.wildColorsModal.style.display = 'none';

      //play wi ld card
      if (this.game.playCard(this.selectedCard, color)) {
        this.updateGameState();
        this.selectedCard = null;
      }
    },
    openModal(){
      this.$refs.wildColorsModal.style.display = 'block';
    },
    handleDeckClick(){
      if (!this.canPlayCard) {
        this.drawCard();
      } else {
        alert("You have playable cards");
      }
    },
    selectBotColor() {
      const colorCount = { green: 0, red: 0, blue:0, yellow: 0};
      const botPlayer = this.game.currentPlayer();

      botPlayer.cards.forEach(card => {
        if (colorCount.hasOwnProperty(card.color.toLowerCase())) {
          colorCount[card.color.toLowerCase()]++;
        }
      });

      //Selecting the color with the highest count of color he has
      let selectedColor = 'green'; // Default color
      let maxCount = -1;
      for (const color in colorCount) {
        if (colorCount[color] > maxCount) {
          maxCount = colorCount[color];
          selectedColor = color;
        }
      }

      // If no cards are present, select a random color
      if (maxCount === 0) {
        const colors = ['green', 'red', 'blue', 'yellow'];
        selectedColor = colors[Math.floor(Math.random() * colors.length)];
      }

      return selectedColor;
    }
  },
  computed: {
    isBotTurn() {
      if (!this.game) return false;
      return this.game.isBotTurn();
    },
    //determines played card color
    discardCardColor() {
      if(this.discardPileTop) {
        const value = this.discardPileTop.value.toLowerCase();

        if (value === 'wild' || value === '+4') {
          return this.selectedWildColor ? this.selectedWildColor.toLowerCase() : 'transparent';
        }
        if (this.discardPileTop.color) {
          return this.discardPileTop.color.toLowerCase(); 
        }
      }
      return 'transparent';
    },
    canPlayCard() {
      if (!this.game) return false;
      const player = this.game.currentPlayer();
      return player.cards.some(card => this.game.currentPlayer().isPlayable(card, this.discardPileTop, this.game.currentColor));
    }
  }
};
</script>

<style scoped>
.modal {
  display: none;
  position: absolute;
  z-index: 1;
  margin: auto 0;
  width: 40%;
  height: 40%;
  overflow: auto;
  z-index: 3;
}

/* Modal Content */
.modal-content {
  position: relative;
  background-color: #fefefe;
  margin: auto;
  padding: 0;
  border: 1px solid #888;
  width: 80%;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
  -webkit-animation-name: animatetop;
  -webkit-animation-duration: 0.4s;
  animation-name: animatetop;
  animation-duration: 0.4s
}

/* Add Animation */
@-webkit-keyframes animatetop {
  from {top:-300px; opacity:0} 
  to {top:0; opacity:1}
}

@keyframes animatetop {
  from {top:-300px; opacity:0}
  to {top:0; opacity:1}
}

/* The Close Button */
.close {
  color: white;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}

.modal-header {
  padding: 2px 16px;
  background-color: #5cb85c;
  color: white;
}

.modal-body {
  padding: 2px 16px;

}

.modal-footer {
  padding: 2px 16px;
  background-color: #5cb85c;
  color: white;
}

.modal-button{
  width: 50px;
  height: 50px;
  cursor: pointer;
}

.playing-color{
  width: 200px;
  height: 200px;
  position: absolute;
  right: 100px;
  bottom: 100px;
  text-align: center;
  color: black;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}


/* Styling */
.game {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
  height: 100vh;
  width: 100vw;
  color: white;
  position: relative;
  overflow: hidden;
}

.center-area {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
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
  z-index: 1;
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
