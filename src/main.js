import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";

import VueLodash from "vue-lodash";

import BootstrapVue from "bootstrap-vue";

import VCalendar from "v-calendar";
import "v-calendar/lib/v-calendar.min.css";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faSync,
  faDownload,
  faPlug,
  faBalanceScale,
  faUpload,
  faTv,
  faFileExport,
  faEnvelope,
  faDatabase,
  faLevelUpAlt,
  faLongArrowAltDown,
  faLongArrowAltUp,
  faArrowsAltV,
  faCogs,
  faCog,
  faEye,
  faLink,
  faFilter,
  faCarCrash,
  faClock,
  faRunning,
  faFlagCheckered,
  faWrench
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

Vue.config.productionTip = false;

Vue.use(VueLodash);

Vue.use(BootstrapVue);

Vue.use(VCalendar, {
  firstDayOfWeek: 2, // Monday
  locale: "nl"
});

const moment = require("moment");
require("moment/locale/nl");
Vue.use(require("vue-moment"), {
  moment
});

library.add([
  faSync,
  faDownload,
  faPlug,
  faBalanceScale,
  faUpload,
  faTv,
  faFileExport,
  faEnvelope,
  faDatabase,
  faLevelUpAlt,
  faLongArrowAltDown,
  faLongArrowAltUp,
  faArrowsAltV,
  faCogs,
  faCog,
  faEye,
  faLink,
  faFilter,
  faCarCrash,
  faClock,
  faRunning,
  faFlagCheckered,
  faWrench
]);
Vue.component("font-awesome-icon", FontAwesomeIcon);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
