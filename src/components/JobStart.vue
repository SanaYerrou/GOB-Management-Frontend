<template>
  <div class="jobstart">
    <b-form-input
      class="mb-2"
      v-if="action === 'Export'"
      v-model="product"
      placeholder="Optionally enter the name of the export file"
    ></b-form-input>
    <b-button :disabled="!canStart()" @click="start()"
      ><font-awesome-icon icon="play" class="error" />
      {{ title }}
      {{ action }}
      {{ product }}</b-button
    >
    <div class="mt-2" v-if="result" :class="result.ok ? 'INFO' : 'ERROR'">
      {{ result.text }}
    </div>
  </div>
</template>

<script>
import {
  createJob,
  catalogOnlyJobs,
  collectionOptionalJobs
} from "../services/gob";
import auth from "../services/auth";

export default {
  name: "JobStart",
  props: {
    title: String,
    action: String,
    catalog: String,
    collection: String
  },
  data() {
    return {
      result: null,
      product: null
    };
  },
  methods: {
    canStart() {
      return (
        !this.result &&
        (catalogOnlyJobs.includes(this.action.toLowerCase()) ||
          collectionOptionalJobs.includes(this.action.toLowerCase()) ||
          (this.catalog && this.collection))
      );
    },
    async start() {
      this.result = null;

      let user = null;
      const userInfo = await auth.userInfo();
      if (userInfo) {
        user = userInfo.preferred_username;
      }

      this.result = await createJob(
        this.action,
        this.catalog,
        this.collection,
        this.product,
        user
      );
      if (this.result.ok) {
        const info = JSON.parse(this.result.text);
        const values = Object.values(info).join(" ");
        this.result.text = `${this.action} ${values} started`;
      }
      this.$forceUpdate();
    },
    clearResult() {
      this.result = null;
      this.product = null;
    }
  },
  watch: {
    action() {
      this.clearResult();
    },
    catalog() {
      this.clearResult();
    },
    collection() {
      this.clearResult();
    }
  }
};
</script>

<style scoped>
.jobstart {
  text-align: center !important;
}
</style>
