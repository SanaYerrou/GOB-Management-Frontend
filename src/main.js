import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";

import VueLodash from "vue-lodash";

import BootstrapVue from "bootstrap-vue";

import VCalendar from "v-calendar";
import "v-calendar/lib/v-calendar.min.css";

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

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
