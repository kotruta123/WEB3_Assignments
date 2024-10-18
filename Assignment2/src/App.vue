<template>
  <div id="app">
    <!-- Main navigation and layout -->

    <!-- Main content where different views (setup, game, etc.) will be rendered -->
    <main>
      <router-view />
    </main>

    <footer>
      <p>&copy; 2024 UNO Game by Alexandru Cotruta & Jakub Cezary Kolando</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style scoped>
/* Style for the main layout */
#app {
  text-align: center;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
  background: url('../public/images/colorfoul.svg') no-repeat;
  background-size: cover;
  height: 100vh;
}

header {
  background-color: #ffcc00;
  padding: 10px;
  border-radius: 8px;
}

footer {
  margin-top: 20px;
  font-size: 12px;
  color: #777;
}

main {
  background-color: #f7f7f7;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #e74c3c;
  font-size: 32px;
  margin: 0;
}

button {
  padding: 10px 20px;
  background-color: #27ae60;
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 16px;
  cursor: pointer;
}

button:hover {
  background-color: #2ecc71;
}

select {
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ddd;
}
</style>
