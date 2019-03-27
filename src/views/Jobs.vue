<template>
  <div>
    <h1>Jobs</h1>
    <div>
      <b-badge v-if="source">Bron: {{ source }}</b-badge>
      <b-badge v-if="catalogue">Catalogus: {{ catalogue }}</b-badge>
      <b-badge v-if="entity">Entiteit: {{ entity }}</b-badge>
    </div>
    <div class="row justify-content-center">
      <div class="col col-xs-12 col-lg-auto mb-2">
        <div class="align-center">
          <job-calendar
            :jobs="allJobs"
            :onDay="onDay"
            :onMonthYear="onMonthYear"
            :date="date"
          ></job-calendar>
          <div v-if="new_logs" class="mt-3">
            <b-btn
              class="ERROR refresh-button btn-block"
              title="Ververs"
              variant="outline-secondary"
              @click="loadDays();"
            >
              <span v-if="new_logs">
                Er zijn nieuwe logs beschikbaar.<br />
                Klik om te verversen
              </span>
              <font-awesome-icon
                v-if="loading"
                icon="sync"
                class="fa-xs"
                :class="{ 'fa-spin': loading }"
              />
            </b-btn>
          </div>
          <div v-if="loading">
            Laden van jobs
            <font-awesome-icon icon="sync" class="fa-xs fa-spin" />
          </div>
          <div class="mt-3">
            <job-filter :filter="filter" :jobs="jobs"></job-filter>
          </div>
        </div>
      </div>

      <div class="col" v-if="jobs.length">
        <div v-for="job in filteredJobs" :key="job.processId" class="mb-2">
          <div>
            <b-btn
              v-b-toggle="job.processId"
              @click="getLogs(job);"
              block
              variant="outline-secondary"
            >
              <job-header :job="job"></job-header>
            </b-btn>

            <b-collapse
              :id="job.processId"
              accordion="job-accordion"
              class="mt-2"
            >
              <div v-if="!job.logs">
                Laden van logs
                <font-awesome-icon icon="sync" class="fa-xs fa-spin" />
              </div>
              <b-card v-if="job.logs"> <logs :logs="job.logs"></logs> </b-card>
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
import JobFilter from "../components/JobFilter";
import Logs from "../components/Logs";
import { connect, disconnect, subscribe } from "../services/sockets";

import { getJobs, logsForJob, jobRunsOnDate } from "../services/gob";

export default {
  name: "entities",
  data() {
    return {
      source: null,
      catalogue: null,
      entity: null,

      allJobs: [],
      jobs: [],
      filter: {
        catalogue: [],
        entity: [],
        application: [],
        source: [],
        name: [],
        messageTypes: []
      },

      date: null,
      startyear: null,
      startmonth: null,

      loading: false,
      new_logs: false
    };
  },
  components: {
    JobCalendar,
    JobHeader,
    JobFilter,
    Logs
  },
  computed: {
    filteredJobs() {
      return this.jobs.filter(job => {
        return (
          (this.filter.catalogue.length === 0 ||
            this.filter.catalogue.includes(job.catalogue)) &&
          (this.filter.entity.length === 0 ||
            this.filter.entity.includes(job.entity)) &&
          (this.filter.application.length === 0 ||
            this.filter.application.includes(job.application)) &&
          (this.filter.source.length === 0 ||
            this.filter.source.includes(job.source)) &&
          (this.filter.name.length === 0 ||
            this.filter.name.includes(job.name)) &&
          (this.filter.messageTypes.length === 0 ||
            this.filter.messageTypes.reduce((s, t) => s + job[t], 0) > 0)
        );
      });
    }
  },
  methods: {
    getFilter() {
      return [
        "source",
        "catalogue",
        "entity",
        "startyear",
        "startmonth"
      ].reduce((q, attr) => {
        q[attr] = this[attr];
        return q;
      }, {});
    },
    async loadDays() {
      this.loading = true;
      this.new_logs = false;

      this.source = this.$route.query.source;
      this.catalogue = this.$route.query.catalogue;
      this.entity = this.$route.query.entity;
      this.startyear = this.startyear || new Date().getFullYear();
      this.startmonth = this.startmonth || new Date().getMonth() + 1;

      this.allJobs = [];
      this.jobs = [];

      const filter = this.getFilter();
      this.allJobs = await getJobs(filter);

      const date = this.date; // save any current set date
      this.date = null; // set this.date to null => select all dates
      this.getJobs(date);

      this.loading = false;
    },
    async onDay(data) {
      this.getJobs(data.date);
    },
    async onMonthYear(month, year) {
      this.startyear = year;
      this.startmonth = month;
      this.$router.push({ name: this.$route.name, query: this.getFilter() });
    },
    async getLogs(job) {
      // Load logs on demand
      if (!job.logs) {
        job.logs = await logsForJob(job.processId);
        this.$forceUpdate();
      }
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
    this.loadDays();
    connect();
    subscribe("new_logs", () => (this.new_logs = true));
  },
  async beforeDestroy() {
    disconnect();
  },
  watch: {
    "$route.query.startyear"() {
      this.loadDays();
    },
    "$route.query.startmonth"() {
      this.loadDays();
    },
    "$route.query.source"() {
      this.loadDays();
    },
    "$route.query.catalogue"() {
      this.loadDays();
    },
    "$route.query.entity"() {
      this.loadDays();
    }
  }
};
</script>

<style scoped>
.badge {
  margin-left: 5px;
  margin-bottom: 10px;
}
.refresh-button {
  margin-bottom: 10px;
}
</style>
