<template>
    <div>
        {{job.startLog.name}}
        {{job.startLog.source}} {{job.startLog.entity}}
        <b-badge v-for="level in job.logLevels" :key="level"
                 class="ml-2" :class="level"
                 variant="light">
            {{level}} {{job.jobLogs.filter(log => log.level === level).length}}
        </b-badge>
        <div>
            {{job.startLog.timestamp | moment("dddd, DD MMMM YYYY, hh:mm:ss")}}
        </div>
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

<style scoped>
</style>
