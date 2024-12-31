import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import store from './redux/store';
import { provideStore } from './redux/redux-plugin';

const app = createApp(App);

app.use(router);

// Providing Redux Store to the whole application
provideStore(app, store);

app.mount("#app");