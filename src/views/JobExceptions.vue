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

// This specific info for Amsterdam only. Should be configurable
const allJobs = [
  "EXPORT bag brondocumenten",
  "EXPORT bag ligplaatsen",
  "EXPORT bag nummeraanduidingen",
  "EXPORT bag openbareruimtes",
  "EXPORT bag panden",
  "EXPORT bag standplaatsen",
  "EXPORT bag verblijfsobjecten",
  "EXPORT bag woonplaatsen",
  "EXPORT brk aantekeningen",
  "EXPORT brk aardzakelijkerechten",
  "EXPORT brk bijpijling",
  "EXPORT brk brkbag",
  "EXPORT brk gemeentes",
  "EXPORT brk kadastraleobjecten",
  "EXPORT brk kadastralesubjecten",
  "EXPORT brk perceelnummer",
  "EXPORT brk stukdelen",
  "EXPORT brk zakelijkerechten",
  "EXPORT gebieden bouwblokken",
  "EXPORT gebieden buurten",
  "EXPORT gebieden ggpgebieden",
  "EXPORT gebieden ggwgebieden",
  "EXPORT gebieden stadsdelen",
  "EXPORT gebieden wijken",
  "EXPORT meetbouten meetbouten",
  "EXPORT meetbouten metingen",
  "EXPORT meetbouten referentiepunten",
  "EXPORT meetbouten rollagen",
  "EXPORT nap peilmerken",
  "EXPORT wkpb beperkingen",
  "EXPORT wkpb brondocumenten",
  "EXPORT_TEST bag bag",
  "EXPORT_TEST gebieden gebieden",
  "EXPORT_TEST meetbouten meetbouten",
  "EXPORT_TEST nap nap",
  "EXPORT_TEST test_catalogue test_catalogue",
  "IMPORT bag brondocumenten",
  "IMPORT bag dossiers",
  "IMPORT bag ligplaatsen",
  "IMPORT bag nummeraanduidingen",
  "IMPORT bag openbareruimtes",
  "IMPORT bag panden",
  "IMPORT bag standplaatsen",
  "IMPORT bag verblijfsobjecten",
  "IMPORT bag woonplaatsen",
  "IMPORT brk aantekeningenkadastraleobjecten",
  "IMPORT brk aantekeningenrechten",
  "IMPORT brk aardzakelijkerechten",
  "IMPORT brk gemeentes",
  "IMPORT brk kadastraleobjecten",
  "IMPORT brk kadastralesubjecten",
  "IMPORT brk meta",
  "IMPORT brk stukdelen",
  "IMPORT brk tenaamstellingen",
  "IMPORT brk zakelijkerechten",
  "IMPORT gebieden bouwblokken",
  "IMPORT gebieden buurten",
  "IMPORT gebieden ggpgebieden",
  "IMPORT gebieden ggwgebieden",
  "IMPORT gebieden stadsdelen",
  "IMPORT gebieden wijken",
  "IMPORT meetbouten meetbouten",
  "IMPORT meetbouten metingen",
  "IMPORT meetbouten referentiepunten",
  "IMPORT meetbouten rollagen",
  "IMPORT nap peilmerken",
  "IMPORT rel wkpb_bpg_brk_kot_belast_kadastrale_objecten",
  "IMPORT wkpb beperkingen",
  "IMPORT wkpb brondocumenten",
  "IMPORT wkpb dossiers",
  "PREPARE brk brk",
  "RELATE bag bag",
  "RELATE brk brk",
  "RELATE gebieden gebieden",
  "RELATE meetbouten meetbouten",
  "RELATE nap nap",
  "RELATE wkpb wkpb"
];

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
