<template>
    <div>
        <h1>
            Jobs
            <span class="float-right">
                <b-btn title="Ververs" variant="outline-secondary" @click="loadData()">
                    <font-awesome-icon icon="sync" class="fa-xs" :class="{'fa-spin': loading}"/>
                </b-btn>
            </span>
        </h1>
        <div class="row justify-content-center">
            <div class="col col-xs-12 col-lg-auto mb-2">
                <div class="align-center">
                    <job-calendar :jobs="allJobs"
                                  :onDay="onDay"
                                  :date="date"
                    ></job-calendar>
                </div>
            </div>
            <div class="col" v-if="jobs.length">
                <div v-for="job in jobs" :key="job.processId"
                     class="mb-2">

                    <div>
                        <b-btn v-b-toggle="job.processId"
                               block
                               variant="outline-secondary">
                            <job-header :job="job"></job-header>
                        </b-btn>

                        <b-collapse :id="job.processId"
                                    class="mt-2">
                            <b-card>
                                <logs :logs="job.jobLogs"></logs>
                            </b-card>
                        </b-collapse>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import JobCalendar from "../components/JobCalendar";
import JobHeader from "../components/JobHeader";
import Logs from "../components/Logs";

import { logs, jobs, jobRunsOnDate } from "../services/gob";

export default {
  name: "entities",
  data() {
    return {
      source: null,
      entity: null,
      logs: [],
      allJobs: [],
      jobs: [],
      date: null,
      loading: false
    };
  },
  components: {
    JobCalendar,
    JobHeader,
    Logs
  },
  methods: {
    async loadData() {
      this.loading = true

      this.jobs = []
      this.source = this.$route.query.source;
      this.catalogue = this.$route.query.catalogue;
      this.entity = this.$route.query.entity;

      this.logs = await logs(this.source, this.catalogue, this.entity);

      this.allJobs = jobs(this.logs).reverse(); // Most recent job first

      var date = this.date; // save any current set date
      this.date = null; // set this.date to null

      this.getJobs(date); // load jobs for data (sets this.date)

      this.loading = false
    },
    onDay(data) {
      this.getJobs(data.date);
    },
    getJobs(date = null) {
      this.jobs = this.allJobs;
      if (this.date === date) {
        this.date = null;
      } else {
        this.date = date;
      }
      if (this.date) {
        this.jobs = this.jobs.filter(job => jobRunsOnDate(job, this.date));
      }
    }
  },
  async mounted() {
    this.loadData();
  },
  watch: {
    "$route.query.source"() {
      this.loadData();
    },
    "$route.query.catalogue"() {
      this.loadData();
    },
    "$route.query.entity"() {
      this.loadData();
    }
  }
};
</script>

<style scoped>
</style>
