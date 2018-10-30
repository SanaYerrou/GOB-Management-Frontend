<template>
    <div>
        <div>Jobs: {{jobs.length}}</div>
        <div v-for="[level, logs] in Object.entries(logLevels)" :key="level">
            <span :class="level">{{level}}</span> {{logs.length}}
        </div>
    </div>
</template>

<script>
import { logLevels } from "../services/gob";

export default {
  name: "CalendarDay",
  props: {
    attribute: Object
  },
  computed: {
    jobs() {
      return this.attribute.customData;
    },
    logLevels() {
      return logLevels(this.jobs);
    }
  }
};
</script>

<style scoped>
</style>
