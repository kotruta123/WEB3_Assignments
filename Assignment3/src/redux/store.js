import { configureStore, applyMiddleware } from '@reduxjs/toolkit';
import rootReducer from './reducers';
// Create Redux store with middleware and devtools

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware()
});

export default store;
