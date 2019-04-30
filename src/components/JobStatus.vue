<template>
  <span>
    <span v-if="job.status === 'scheduled'">
      <font-awesome-icon icon="clock" title="Scheduled" />
    </span>
    <span v-if="job.status === 'started'">
      {{ job.step }}
      <font-awesome-icon icon="running" />
    </span>
    <span v-if="job.status === 'ended'">
      <span v-if="job.endtime">
        <font-awesome-icon icon="flag-checkered" />
      </span>
      <span v-else> <font-awesome-icon icon="wrench" /> </span>
    </span>
    <span v-if="job.status === 'failed'">
      <font-awesome-icon icon="car-crash" />
    </span>
  </span>
</template>

<script>
export default {
  props: {
    job: Object
  }
};
</script>

<style></style>
