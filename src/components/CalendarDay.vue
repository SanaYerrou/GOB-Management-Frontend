<template>
    <div>
        <div>Jobs: {{Object.entries(logJobs).length}}</div>
        <div v-for="[level, logs] in Object.entries(logLevels)" :key="level">
            <span :class="level">{{level}}</span> {{logs[0].count}}
        </div>
    </div>
</template>

<script>
import { logLevels, logJobs } from "../services/gob";

export default {
  name: "CalendarDay",
  props: {
    attribute: Object
  },
  computed: {
    logDays() {
      return this.attribute.customData;
    },
    logJobs() {
      return logJobs(this.logDays);
    },
    logLevels() {
      return logLevels(this.logDays);
    }
  }
};
</script>

<style scoped>
</style>
