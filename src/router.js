import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home";
import Sources from "./views/Sources";
import Catalogues from "./views/Catalogues";
import Entities from "./views/Entities";
import Jobs from "./views/Jobs";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/sources",
      name: "sources",
      component: Sources
    },
    {
      path: "/catalogues",
      name: "catalogues",
      component: Catalogues
    },
    {
      path: "/entities",
      name: "entities",
      component: Entities
    },
    {
      path: "/jobs",
      name: "jobs",
      component: Jobs
    }
  ]
});
