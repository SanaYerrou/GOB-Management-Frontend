<template>
  <div>
    <h1>Job Exceptions</h1>
    <div v-if="!jobs">loading...</div>
    <div v-else>
      <!-- Stats-->
      <div>
        <div v-for="(stat, key) in jobStats('catalogue')" :key="key">
          {{ key.toUpperCase() }}: {{ stat.n }}
        </div>
        <div>Ontbrekend: {{ allJobs.filter(i => !getJob(i)).length }}</div>
      </div>

      <!-- Overview per job type -->
      <div
        v-for="jobType in jobTypes"
        :key="jobType"
        :set="(jobsToSignal = signalJobs(jobType))"
      >
        <!-- Job type header -->
        <div v-if="jobsToSignal.length">
          <h2>{{ jobType.toLowerCase() }} ({{ jobsToSignal.length }})</h2>
        </div>

        <!-- Job info + link to detail view -->
        <div
          v-for="jobId in jobsToSignal"
          :key="jobId"
          :set="(job = getJob(jobId))"
          class="mb-1"
        >
          <span v-if="job">
            <!-- Link to job -->
            <b-link :to="`/job?id=${job.jobid}`" target="_blank">
              {{ jobId }}</b-link
            >

            <!-- Warnings and errors -->
            <b-badge
              v-for="level in ['warnings', 'errors']"
              :key="level"
              class="ml-2"
              :class="level"
              variant="light"
              v-if="job[level] > 0"
            >
              {{ level }} {{ job[level] }}
            </b-badge>

            <!-- Status -->
            <job-status
              class="ml-1"
              v-if="job.status !== 'ended'"
              :job="job"
            ></job-status>
          </span>

          <span v-else>
            <!-- Missing job execution -->
            {{ jobId }}
            <font-awesome-icon
              icon="exclamation-triangle"
              class="error"
            ></font-awesome-icon>
            ontbreekt
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getJobs } from "../services/gob";
import JobStatus from "../components/JobStatus";
import { allJobs } from "../config/jobs";

const jobTypes = ["PREPARE", "IMPORT", "RELATE", "EXPORT", "EXPORT_TEST"];

export default {
  name: "exceptions",
  data() {
    return {
      jobs: null, // jobs of the last 24 hours
      allJobs: allJobs, // ids of all jobs that should have run
      jobTypes: jobTypes // possible fob types (Import, Export, etc)
    };
  },
  components: { JobStatus },
  computed: {},
  methods: {
    signalJob(jobId) {
      // Condition to signal a job
      const job = this.getJob(jobId);
      if (!job) {
        // Job execution is missing
        return true;
      } else {
        // Job has finished with errors
        return job.errors > 0;
      }
    },

    signalJobs(jobType) {
      return this.allJobs
        .filter(j => j.includes(`${jobType} `))
        .filter(j => this.signalJob(j));
    },

    jobStats(attr) {
      // Get job stats for a specific attribute (e.g. catalogue)
      return this.allJobs
        .filter(id => this.signalJob(id))
        .map(id => this.getJob(id))
        .filter(j => j)
        .reduce((stats, job) => {
          console.log(job[attr]);
          stats[job[attr]] = stats[job[attr]] || {
            [attr]: job[attr],
            n: 0
          };
          stats[job[attr]].n += 1;
          return stats;
        }, {});
    },

    getJob(jobId) {
      const jobs = this.jobs.filter(job => job._id === jobId);
      return jobs.length > 0 ? jobs[0] : null;
    },

    async loadJobs() {
      const filter = { daysAgo: 1 };
      let jobs = await getJobs(filter);
      jobs = jobs.map(job => ({
        ...job,
        _id: `${job.name} ${job.catalogue} ${job.entity}`
      }));
      this.jobs = jobs;
      console.log(jobs);
      this.$forceUpdate();
    }
  },

  async mounted() {
    this.loadJobs();
  },

  async beforeDestroy() {},

  watch: {}
};
</script>

<style scoped></style>
