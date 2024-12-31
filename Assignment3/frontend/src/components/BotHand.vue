<template>
  <div class="bot-hand">
    <h3>Bot Hand</h3>
    <div v-for="card in hand" :key="card.id">
      <img src="/images/card-back.png" />
    </div>
  </div>
</template>

<script>
export default {
  props: ['hand']
};
</script>
