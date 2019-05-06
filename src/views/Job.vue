<template>
  <div>
    <h1>Job Details</h1>
    <div v-if="job">
      <job-header :job="job" class="mb-2"></job-header>
      <div class="text-left">
        <table>
          <tr>
            <td class="id">Type</td>
            <td>{{ jobinfo.type }}</td>
          </tr>
          <tr>
            <td class="id">Start</td>
            <td>{{ jobinfo.start | moment("dddd d MMM YYYY HH:mm:ss") }}</td>
          </tr>
          <tr>
            <td class="id">Eind</td>
            <td>{{ jobinfo.end | moment("dddd d MMM YYYY HH:mm:ss") }}</td>
          </tr>
          <tr>
            <td class="id">Duur</td>
            <td>{{ jobinfo.duration }}</td>
          </tr>
          <tr>
            <td class="id">Status</td>
            <td>{{ jobinfo.status }}</td>
          </tr>
        </table>

        <div v-for="step in jobinfo.steps" :key="step.stepid" class="mt-2">
          <h2>{{ step.name }}</h2>
          <table>
            <tr>
              <td class="id">Start</td>
              <td>{{ step.start | moment("dddd d MMM YYYY HH:mm:ss") }}</td>
            </tr>
            <tr>
              <td class="id">Eind</td>
              <td>{{ step.end | moment("dddd d MMM YYYY HH:mm:ss") }}</td>
            </tr>
            <tr>
              <td class="id">Duur</td>
              <td>{{ step.duration }}</td>
            </tr>
            <tr>
              <td class="id">Status</td>
              <td>
                {{ step.status }}
                <div class="float-right">
                  <job-status :job="step"></job-status>
                </div>
              </td>
            </tr>
          </table>

          <div v-if="step.logs" class="mt-2">
            <logs :logs="step.logs"></logs>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="!loading">Job not found</div>
    <div v-else>loading...</div>
  </div>
</template>

<script>
import Logs from "../components/Logs";
import JobHeader from "../components/JobHeader";

import { getJob, getJobs, logsForJobStep } from "../services/gob";
import JobStatus from "../components/JobStatus";

export default {
  name: "job",
  data() {
    return {
      jobid: null,
      job: null,
      jobinfo: null,
      loading: true
    };
  },
  components: {
    JobStatus,
    Logs,
    JobHeader
  },
  computed: {},
  methods: {},

  async mounted() {
    this.jobid = this.$route.query.id;

    var jobinfo = await getJob(this.jobid);
    for (var step of jobinfo ? jobinfo.steps : []) {
      step.logs = await logsForJobStep(jobinfo.jobid, step.stepid);
    }

    const jobFilter = { jobid: this.jobid };
    var job = await getJobs(jobFilter);

    this.job = job[0];
    this.jobinfo = jobinfo;
    this.loading = false;
  },

  async beforeDestroy() {},

  watch: {}
};
</script>

<style scoped>
.id {
  font-weight: bold;
  padding-right: 15px;
}
</style>
