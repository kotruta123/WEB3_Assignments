import { inject } from 'vue';

const ReduxSymbol = Symbol('Redux');

export const provideStore = (app, store) => {
  app.provide(ReduxSymbol, store);
};

export const useStore = () => {
  const store = inject(ReduxSymbol);
  if (!store) {
    throw new Error('Store not provided! Make sure to use the provideStore plugin.');
  }
  return store;
};
