<template>
    <div>
        <div>Jobs: {{jobs.length}}</div>
        <div v-for="[level, count] in Object.entries(levels)" :key="level">
            <span :class="level">{{level}}</span> {{count}}
        </div>
    </div>
</template>

<script>
export default {
  name: "CalendarDay",
  props: {
    attribute: Object
  },
  computed: {
    jobs() {
      return this.attribute.customData;
    },
    levels() {
      return this.jobs.reduce((level, job) => {
        job.levels.forEach(l => {
          if (!level[l.level]) {
            level[l.level] = 0;
          }
          level[l.level] += l.count;
        });
        return level;
      }, {});
    }
  }
};
</script>

<style scoped>
</style>
