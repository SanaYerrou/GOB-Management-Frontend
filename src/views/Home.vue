<template>
  <div class="home">
    <b-card tag="article" style="max-width: 20rem;" class="mt-2 mb-2 mx-auto">
      <img alt="GOB logo" src="../assets/logo.png" @click="testSecure();" />
      <p class="mt-2 card-text">
        <b>G</b>enerieke <b>O</b>ntsluiting <b>B</b>asisgegevens
      </p>
      <p>
        Conform het<br />
        <a href="https://www.amsterdam.nl/stelselpedia/" target="_blank">
          Stelsel van BasisRegistraties
        </a>
      </p>
    </b-card>
  </div>
</template>

<script>
import { getSecure } from "../services/gob";

export default {
  name: "home",
  methods: {
    testSecure() {
      getSecure();
    }
  },
  mounted() {
    if (this.$route.query.p) {
      this.$router.push(this.$route.query.p);
    }
  }
};
</script>
