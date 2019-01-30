<template>
  <div id="app">
    <Navigation></Navigation>
    <b-container> <router-view /> </b-container>
  </div>
</template>

<script>
import Navigation from "@/components/Navigation";

export default {
  components: {
    Navigation
  }
};
</script>

<style lang="scss">
@import "scss/custom";
@import "~bootstrap/scss/bootstrap.scss";
@import "~bootstrap-vue/dist/bootstrap-vue.css";

@import "scss/app";

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.infos {
  @extend .INFO;
}
.warnings {
  @extend .WARNING;
}
.errors {
  @extend .ERROR;
}
</style>
