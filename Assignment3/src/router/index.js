import { createRouter, createWebHistory } from 'vue-router';
import RegistrationView from '../views/RegistrationView.vue'

const routes = [
    { path: '/', name: 'Home', redirect: '/login' },
    { path: '/register', name: 'Register', component: RegistrationView },
   // { path: '/login', name: 'Login', component: Login},
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;