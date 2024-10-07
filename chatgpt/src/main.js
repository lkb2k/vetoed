import { createApp } from 'vue'
import App from './App.vue'
import './assets/styles.css'
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSkull } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faSkull);

const app = createApp(App);
app.component('font-awesome-icon', FontAwesomeIcon);
app.mount('#app')
