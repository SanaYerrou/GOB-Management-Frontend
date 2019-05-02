<template>
  <span>
    <span v-if="job.status === 'scheduled'">
      <font-awesome-icon icon="clock" title="Scheduled" />
    </span>
    <span v-if="job.status === 'started'">
      {{ job.step }} <img src="../assets/running.gif" height="20px" />
      <!-- <font-awesome-icon icon="running" /> -->
    </span>
    <span v-if="job.status === 'ended'">
      <span v-if="job.endtime">
        <font-awesome-icon icon="flag-checkered" />
      </span>
      <span v-else> <font-awesome-icon icon="wrench" class="error" /> </span>
    </span>
    <span v-if="job.status === 'failed'">
      <font-awesome-icon icon="car-crash" class="error" />
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

<style lang="scss" coped>
@import "../scss/app";
.error {
  color: $danger;
}
</style>
