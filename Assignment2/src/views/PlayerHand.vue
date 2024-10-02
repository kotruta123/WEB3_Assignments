<template>
  <div class="player-hand">
    <h3>Your Hand</h3>
    <div class="hand">
      <!-- Ensure proper closing of div and unique key usage -->
      <div
          v-for="(card, index) in hand"
          :key="card.id || index"
          :class="['card', { selected: isSelected(card) }]"
          :style="getCardStyle(index)"
          @click="selectCard(card)"
      >
        <img :src="getCardImage(card)" alt="Card" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['hand', 'selectedCard'],
  methods: {
    getCardImage(card) {
      return `/images/${card.color.toLowerCase()}_${card.value.toLowerCase().replace(' ', '')}.png`;
    },
    getCardStyle(index) {
      const totalCards = this.hand.length;
      const angle = (index - totalCards / 2) * 10; // Adjust the angle for the curve
      return {
        transform: `rotate(${angle}deg) translateY(-30px)`,
        zIndex: index
      };
    },
    selectCard(card) {
      this.$emit('cardSelected', card);  // Emit the selected card event to parent
    },
    isSelected(card) {
      return card === this.selectedCard;  // Check if this card is selected
    }
  }
};
</script>

<style scoped>
.hand {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  position: relative;
}

.card {
  position: relative;
  transform-origin: bottom center;
  margin-right: -30px; /* Increase space between cards */
  cursor: pointer;
}

.card img {
  width: 80px;
  height: 120px;
}

/* Style for selected card */
.card.selected {
  box-shadow: 0px 0px 15px 5px rgba(0, 128, 255, 0.75); /* Blue glow effect for selected card */
  border-radius: 5px;
}
</style>
