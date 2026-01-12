import { createApp } from "vue";
import "primeicons/primeicons.css";
import "./style.css";
import ToastService from "primevue/toastservice";
import App from "./App.vue";
import router from "./routes/router";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import dTable from "./components/common/d-table.vue";
import clickOutside from "./directives/clickOutside";
import api from "./boot/api";
import Modal from "./components/common/Modal.vue";

library.add(fas);
library.add(far);

import Echo from "laravel-echo";
import Pusher from "pusher-js";
import PrimeVue from "primevue/config";
import { Noir } from "./assets/myPreset";
import useMap from "./scripts/map";
import Tooltip from "primevue/tooltip";

const { googleMapInit } = useMap();
googleMapInit();
const app = createApp(App);

window.Pusher = Pusher;

window.Echo = new Echo({
  broadcaster: "reverb",
  key: import.meta.env.VITE_REVERB_APP_KEY,
  wsHost: import.meta.env.VITE_REVERB_HOST,
  wsPort: import.meta.env.VITE_REVERB_PORT,
  forceTLS: false,
  enabledTransports: ["ws"],
});

console.log(window.Echo);

app.directive("tooltip", Tooltip);

app.directive("click-outside", clickOutside);
app.component("Modal", Modal);
app.component("d-table", dTable);
app.component("font-awesome-icon", FontAwesomeIcon);
app.config.globalProperties.$api = api;
app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Noir,
    options: {
      darkModeSelector: ".my-app-dark",
    },
  },
});
app.use(ToastService);
app.mount("#app");
