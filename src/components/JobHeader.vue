<template>
  <div v-if="job">
    {{ job.name }} {{ job.application || job.source }} {{ job.entity }}
    <b-badge
      v-for="level in ['infos', 'warnings', 'errors']"
      :key="level"
      class="ml-2"
      :class="level"
      variant="light"
      v-if="job[level] > 0"
    >
      {{ level }} {{ job[level] }}
    </b-badge>
    <div>
      {{ job.starttime | moment("dddd, DD MMMM YYYY, HH:mm:ss") }} -
      {{ job.duration | duration("humanize") }}
      <span class="float-right"> <job-status :job="job"></job-status> </span>
    </div>
  </div>
</template>

<script>
import JobStatus from "../components/JobStatus";

export default {
  name: "JobHeader",
  props: {
    job: Object
  },
  components: {
    JobStatus
  }
};
</script>

<style scoped></style>
