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
  faWrench,
  faPlay,
  faExclamationTriangle,
  faCheck
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

// Use moment-tz to show UTC datetimes from the backend in the CET timezone
const momentTz = require("moment-timezone");
momentTz.tz.setDefault("UTC");
Vue.filter("formatdate", function(value, format) {
  if (!value) {
    return "";
  }
  format = format || "dddd DD MMM YYYY HH:mm:ss";
  return moment(value)
    .tz("CET")
    .format(format);
});

Vue.filter("formatduration", function(value) {
  if (!value) {
    return "";
  }
  return (
    Math.floor(moment.duration(value).asHours()) +
    moment(value).format(":mm:ss")
  );
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
  faWrench,
  faPlay,
  faExclamationTriangle,
  faCheck
]);
Vue.component("font-awesome-icon", FontAwesomeIcon);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
