<template>
 <div id="app" class="container bg-white p-8">
        <h2 class="text-3xl font-bold text-center mb-6">Login</h2>
        <form @submit.prevent="handleLogin">
            <div class="mb-4">
                <input type="email" v-model="email" 
                       placeholder="Email" 
                       class="form-input">
            </div>
            <div class="mb-4">
                <input type="password" v-model="password"
                       placeholder="Password" 
                       class="form-input">
            </div>
            <button type="submit"
                class="w-full bg-blue-500 hover:bg-blue-600 
                       text-white font-semibold py-2
                       rounded-md focus:outline-none">Login</button>
        </form>
        <p class="mt-4 text-sm text-center
                  text-gray-600">Don't have 
                                   an account? 
                                   <router-link to="/register">
                                    Sign up here
                                   </router-link>
                                </p>
    </div>
  </template>
  
  <script>
    import { useStore } from '../redux/redux-plugin'; 
    import { login } from '../redux/slices/auth-slice'; 
    import { computed, ref } from 'vue';
    import { useRouter } from 'vue-router';

    export default {
        name: 'LoginView',
        setup() {
            const store = useStore();
            const router = useRouter();

            const email = ref('');
            const password = ref('');

            // Computed properties
            const loading = computed(() => store.getState().auth.loading);
            const error = computed(() => store.getState().auth.error);
        
            const handleLogin = async () => {
                try {
                    await store.dispatch(login({ email: email.value, password: password.value }));
                    router.push('/dashboard');
                } catch(err) {
                    alert('Login Error:', err);
                }
            };

            return {
                email, 
                password, 
                handleLogin,
                loading, 
                error,
            };
        },
    };
  </script>