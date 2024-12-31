import { createRouter, createWebHistory } from 'vue-router';
import RegistrationView from '../views/RegistrationView.vue';
import LoginView from '../views/LoginView.vue';
import DashboardView from '../views/Dashboard.vue';

const routes = [
    { path: '/', name: 'Home', redirect: '/login' },
    { path: '/register', name: 'Register', component: RegistrationView },
    { path: '/login', name: 'Login', component: LoginView},
    { path: '/dashboard', name: 'Dashboard', component: DashboardView},
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;