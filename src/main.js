import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './routes/router'
import useMap from './scripts/map'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import dTable from './components/d-table.vue'
library.add(fas)
library.add(far)

const {googleMapInit} = useMap()
googleMapInit()
import api from './boot/api'
import Modal from './components/Modal.vue'

const app = createApp(App)

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
    wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],
});

app.component('Modal', Modal)
app.component('d-table', dTable)
app.component('font-awesome-icon', FontAwesomeIcon)
app.config.globalProperties.$api = api;
app.use(router)
app.mount('#app')
