import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import App from './App.vue';

// Global styles
import './styles/globals.css';

// Create Vue app
const app = createApp(App);

// Create Pinia store
const pinia = createPinia();

// Install plugins
app.use(pinia);
app.use(router);

// Mount app
app.mount('#app');
