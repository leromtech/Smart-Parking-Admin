import { createApp } from "vue";
import "primeicons/primeicons.css";
import "./style.css";
import ToastService from "primevue/toastservice";
import App from "./App.vue";
import router from "./routes/router";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPenToSquare, faCheck, faXmark, faPlus, faChartLine, faCalendarCheck, faCar } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import dTable from "./components/common/d-table.vue";
import clickOutside from "./directives/clickOutside";
import api from "./boot/api";
import Modal from "./components/common/Modal.vue";

library.add(faPenToSquare, faCheck, faXmark, faPlus, faChartLine, faCalendarCheck, faCar, faTrashCan);

import PrimeVue from "primevue/config";
import { Noir } from "./assets/myPreset";
import Tooltip from "primevue/tooltip";
import useMap from "./scripts/map";

const { googleMapInit } = useMap();

// Lazy-load Google Maps only when needed
let mapsInitialized = false;
const initMapsOnDemand = () => {
  if (!mapsInitialized) {
    googleMapInit();
    mapsInitialized = true;
  }
};

const app = createApp(App);

// Lazy-load Pusher/Echo only when user is authenticated
router.isReady().then(() => {
  const currentRoute = router.currentRoute.value;
  const requiresAuth = currentRoute.matched.some((r) => r.meta.requiresAuth);
  if (requiresAuth) {
    import("pusher-js").then((PusherModule) => {
      const Pusher = PusherModule.default;
      window.Pusher = Pusher;

      import("laravel-echo").then((EchoModule) => {
        const Echo = EchoModule.default;
        window.Echo = new Echo({
          broadcaster: "reverb",
          key: import.meta.env.VITE_REVERB_APP_KEY,
          wsHost: import.meta.env.VITE_REVERB_HOST,
          wsPort: import.meta.env.VITE_REVERB_PORT,
          forceTLS: false,
          enabledTransports: ["ws"],
        });
      });
    });
  }

  // Initialize maps if the current route uses them
  const mapRoutes = ["/admin/parking-zones", "/admin/vehicles"];
  if (mapRoutes.some((path) => currentRoute.path.startsWith(path))) {
    initMapsOnDemand();
  }
});

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
