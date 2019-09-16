<template>
  <div>
    <div class="float-left mt-2">
      <b-button v-b-toggle.collapse-filters variant="primary">
        <span class="when-opened">Hide</span>
        <span class="when-closed">Show</span> Filters
      </b-button>
    </div>
    <div v-if="!loading" class="float-right">
      <span v-if="date">{{ date | formatdate("dddd, DD MMMM YYYY") }}, </span>
      ({{ filteredJobs.length }})
    </div>
    <h1>
      Jobs
      <span v-if="loading">
        <img src="../assets/running.gif" height="20px" />
      </span>
    </h1>
    <filter-overview :filter="filter"></filter-overview>

    <div class="row justify-content-center">
      <b-collapse id="collapse-filters" visible class="col col-xs-12 col-lg-3">
        <div class="align-center">
          <job-calendar
            :jobs="allJobs"
            :onDay="onDay"
            :onMonthYear="onMonthYear"
            :date="date"
            :year="filter.year[0]"
            :month="filter.month[0]"
          ></job-calendar>
          <div v-if="new_logs" class="mt-3">
            <b-btn
              class="ERROR refresh-button btn-block"
              title="Ververs"
              variant="outline-secondary"
              @click="loadDays()"
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
          <div class="mt-3">
            <job-filter :filter="filter" :jobs="jobs"></job-filter>
          </div>
        </div>
      </b-collapse>

      <div class="col col-lg-9">
        <div v-if="filteredJobs.length">
          <div v-for="job in filteredJobs" :key="job.jobid" class="mb-2">
            <div>
              <b-btn
                v-b-toggle="job.jobid.toString()"
                @click="loadLogs(job)"
                block
                variant="outline-secondary"
              >
                <job-header :job="job"></job-header>
              </b-btn>

              <b-collapse
                :id="job.jobid.toString()"
                accordion="job-accordion"
                class="mt-2"
              >
                <div v-if="!job.logs">
                  Laden van logs
                  <font-awesome-icon icon="sync" class="fa-xs fa-spin" />
                </div>
                <div v-if="job.logs">
                  <div class="text-right">
                    <b-button
                      size="sm"
                      class="mb-1"
                      :to="`/job?id=${job.jobid}`"
                      >Details</b-button
                    >
                  </div>
                  <b-card v-if="job.logs">
                    <logs :logs="job.logs"></logs>
                  </b-card>
                </div>
              </b-collapse>
            </div>
          </div>
        </div>
        <div v-else-if="!loading">
          <h3>Geen resultaten gevonden</h3>
          <p>Pas eventueel de filters en/of de datum aan</p>
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
import FilterOverview from "../components/FilterOverview";

export default {
  name: "entities",
  data() {
    return {
      source: null,
      catalogue: null,
      entity: null,

      allJobs: [],
      jobs: [],
      filteredJobs: [],
      filter: {
        year: [],
        month: [],
        day: [],
        status: [],
        ageCategory: [],
        catalogue: [],
        entity: [],
        application: [],
        source: [],
        name: [],
        messageTypes: []
      },

      date: null,
      activeCollapseId: null,

      loading: true,
      new_logs: false
    };
  },
  components: {
    FilterOverview,
    JobCalendar,
    JobHeader,
    JobFilter,
    Logs
  },
  computed: {},
  methods: {
    matchFilter(job, key) {
      const jobKey = j => j[key].toLowerCase().replace(/_/g, " ");
      return (
        this.filter[key].length === 0 || this.filter[key].includes(jobKey(job))
      );
    },

    applyFilter() {
      this.filteredJobs = this.jobs.filter(job => {
        // default filter is on current year month
        const year = this.filter.year[0] || new Date().getFullYear();
        const month = this.filter.month[0] || new Date().getMonth() + 1;
        const jobStart = new Date(job.starttime);

        const match = key => this.matchFilter(job, key);

        return (
          jobStart.getFullYear() === year &&
          jobStart.getMonth() + 1 === month &&
          match("catalogue") &&
          match("entity") &&
          match("application") &&
          match("source") &&
          match("name") &&
          match("status") &&
          match("ageCategory") &&
          (this.filter.messageTypes.length === 0 ||
            this.filter.messageTypes.reduce((s, t) => s + job[t], 0) > 0)
        );
      });
    },

    async loadDays() {
      // This method is called on mount and on refresh
      this.loading = true;
      this.new_logs = false;

      if (this.activeCollapseId) {
        this.$root.$emit("bv::toggle::collapse", this.activeCollapseId);
        this.activeCollapseId = null;
      }

      // Start loading jobs from API
      await this.loadJobs();

      // Read filter from URL parameters
      for (let key in this.filter) {
        let val = this.$route.query[key];
        for (let intKey in ["year", "month", "day"]) {
          val = key == intKey && val ? parseInt(val) : val;
        }
        this.filter[key] = Array.isArray(val) ? val : val ? [val] : [];
      }

      this.filterJobs(this.getDate());
      this.applyFilter();

      this.loading = false;
    },

    onFilterChange() {
      // Store filter in URL
      for (let key in this.filter) {
        let val = this.filter[key];
        this.$router.push({
          query: { ...this.$route.query, [key]: val.length ? val : undefined }
        });
      }
      this.applyFilter();
    },

    clearDate() {
      // Default year - month, no specific day
      this.filter.year = [];
      this.filter.month = [];
      this.filter.day = [];
    },

    setDate() {
      // Clears the date if all points to the default month - year without a specific day
      let yearNow = new Date().getFullYear();
      let monthNow = new Date().getMonth() + 1;
      let yearFilter = parseInt(this.filter.year[0] || yearNow);
      let monthFilter = parseInt(this.filter.month[0] || monthNow);
      let dayFilter = this.filter.day[0];
      if (yearFilter === yearNow && monthFilter === monthNow && !dayFilter) {
        // Current year - month without day => clear all
        this.clearDate();
      } else {
        this.filter.year = [yearFilter];
        this.filter.month = [monthFilter];
      }
    },

    getDate() {
      let year = this.filter.year[0] || new Date().getFullYear();
      let month = this.filter.month[0] || new Date().getMonth() + 1;
      let day = this.filter.day[0];
      return day ? new Date(year, month - 1, day) : null;
    },

    async onDay(data) {
      // User has selected a date in the calendar
      this.filterJobs(data.date);
    },

    async onMonthYear(month, year) {
      // User has changed year-month in the calendar
      this.filter.year = [year];
      this.filter.month = [month];
      // Update date filter
      this.setDate();
    },

    async loadLogs(job) {
      // Load logs on demand
      job.logs = null;
      let n = 0;
      let logs = [];
      while (n < 10 && !logs.length) {
        logs = await logsForJob(job.jobid);
        n += 1;
      }
      job.logs = logs;
      this.$forceUpdate();
    },

    async loadJobs() {
      // Load jobs from API, default is load last 10 days
      const filter = { daysAgo: 10 };
      this.allJobs = await getJobs(filter);
    },

    filterJobs(date = null) {
      // Possibly filter on a specific date
      if (date && (!this.date || this.date.getTime() !== date.getTime())) {
        // date is a date and not equal to current date
        this.date = date;
      } else {
        // deselect date on date = null or selected twice the same date
        this.date = null;
      }

      if (this.date) {
        this.jobs = this.allJobs.filter(job => jobRunsOnDate(job, this.date));
        this.filter.year = [this.date.getFullYear()];
        this.filter.month = [this.date.getMonth() + 1];
        this.filter.day = [this.date.getDate()];
      } else {
        // Leave full month overview, deselect any selected day
        this.jobs = this.allJobs;
        this.filter.day = [];
      }

      // Update date filter
      this.setDate();
    }
  },

  async mounted() {
    this.loadDays();

    // Watch any new logs
    connect();
    subscribe("new_logs", () => (this.new_logs = true));
    this.$root.$on("bv::collapse::state", (collapseId, isJustShown) => {
      this.activeCollapseId = isJustShown ? collapseId : null;
    });
  },

  async beforeDestroy() {
    disconnect();
  },

  watch: {
    filter: {
      handler() {
        this.onFilterChange();
      },
      deep: true
    }
  }
};
</script>

<style scoped>
.badge {
  margin-left: 5px;
  margin-bottom: 10px;
}
.collapsed > .when-opened,
:not(.collapsed) > .when-closed {
  display: none;
}
.refresh-button {
  margin-bottom: 10px;
}
</style>
