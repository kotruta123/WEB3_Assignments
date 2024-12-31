<!-- COMPOSITION API -->

<template>
    <div id="app" class="container bg-white p-8">
        <h2 class="text-3xl font-bold text-center mb-6">Sign Up</h2>
        <form>
            <div class="mb-4">
                <input type="text" v-model="name"
                       placeholder="Name"
                       class="form-input">
            </div>
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
            <div class="mb-6">
                <input type="password" 
                       v-model="confirmPassword" 
                       placeholder="Confirm Password" 
                       class="form-input">
            </div>
            <button @click.prevent="signUp"
                class="w-full bg-blue-500 hover:bg-blue-600 
                       text-white font-semibold py-2
                       rounded-md focus:outline-none">Sign
                Up</button>
        </form>
        <p class="mt-4 text-sm text-center
                  text-gray-600">Already have 
                                   an account? <a href="#"
                class="text-blue-500 hover:underline">Sign in here</a></p>
    </div>
</template>

<script>
    import { useStore } from '../redux/redux-plugin';
    import { register } from '../redux/slices/auth-slice';
    import { computed, ref } from 'vue';
    import { useRouter } from 'vue-router';

    export default {
      name: 'RegistrationView',
      /*data() {
        return {
        };
      },*/
      setup() {
        const store = useStore();
        const state = computed(() => store.getState().auth);
        const router = useRouter();
        
        // Reactive variables
        const name = ref('');
        const email = ref('');
        const password = ref('');
        const confirmPassword = ref('');

        const loading = computed(() => state.value.loading);
        const error = computed(() => state.value.error);

        const signUp = async () => {
          if (password.value !== confirmPassword.value) {
            alert('Passwords not matching');
            return;
          }
          try {
            // Register dispatch
            await store.dispatch(register({ name: name.value, email: email.value }));

            // Redirection after registration
            router.push('/login');
          }catch(err) {
            console.error(err);
          }
        }

        return {
          name,
          email, 
          password, 
          confirmPassword,
          signUp,
          loading,
          error,
        };
      },
    };
</script>