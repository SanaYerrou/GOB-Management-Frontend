<template>
  <div class="jobstart">
    <b-button :disabled="!canStart()" @click="start()"
      ><font-awesome-icon icon="play" class="error" /> {{ title }}
      {{ action }}</b-button
    >
    <div class="mt-2" v-if="result" :class="result.ok ? 'INFO' : 'ERROR'">
      {{ result.text }}
    </div>
  </div>
</template>

<script>
import { createJob, catalogOnlyJobs } from "../services/gob";

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
      result: null
    };
  },
  methods: {
    canStart() {
      return (
        !this.result &&
        (catalogOnlyJobs.includes(this.action) ||
          (this.catalog && this.collection))
      );
    },
    async start() {
      this.result = null;
      this.result = await createJob(this.action, this.catalog, this.collection);
      if (this.result.ok) {
        const info = JSON.parse(this.result.text);
        const values = Object.values(info).join(" ");
        this.result.text = `${this.action} ${values} started`;
      }
      this.$forceUpdate();
    },
    clearResult() {
      this.result = null;
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
