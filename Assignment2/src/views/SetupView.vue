<template>
  <div class="setup">
    <h1>UNO Game Setup</h1>
    <label for="bots">Number of Bots: </label>
    <select v-model="numberOfBots">
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
    </select>
    <button @click="startGame">Start Game</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      numberOfBots: 1
    };
  },
  methods: {
    startGame() {
      this.$router.push({ name: 'game', params: { bots: this.numberOfBots } });
    }
  }
};
</script>
