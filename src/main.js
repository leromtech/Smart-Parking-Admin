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

const app = createApp(App);

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
