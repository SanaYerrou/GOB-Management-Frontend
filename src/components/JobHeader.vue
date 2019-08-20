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
      <span>{{ job.starttime | formatdate }} (</span>
      <span v-if="job.brutoDuration"
        >{{ job.brutoDuration }} / {{ job.nettoDuration }}</span
      >
      <span v-else>{{ job.ago | formatduration }}...</span>)
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
