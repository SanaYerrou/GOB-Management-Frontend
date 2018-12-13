<template>
  <div>
    {{ job.name }} {{ job.application || job.source }} {{ job.entity }}
    <b-badge
      v-for="level in job.levels"
      :key="level.level"
      class="ml-2"
      :class="level.level"
      variant="light"
    >
      {{ level.level }} {{ level.count }}
    </b-badge>
    <div>{{ job.starttime | moment("dddd, DD MMMM YYYY, HH:mm:ss") }}</div>
  </div>
</template>

<script>
export default {
  name: "JobHeader",
  props: {
    job: Object
  }
};
</script>

<style scoped></style>
