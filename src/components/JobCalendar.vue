<template>
  <v-calendar
    ref="calendar"
    :attributes="attrs"
    @dayclick="onDay"
    @update:fromPage="onPage"
    :fromPage="page"
  >
  </v-calendar>
</template>

<script>
import _ from "lodash";

import { amsmiddengrijs, amslichtgrijs } from "../services/colors";

import CalendarDay from "./CalendarDay";

const COLORS = {
  selected: amsmiddengrijs,
  unselected: amslichtgrijs
};

export default {
  name: "JobCalendar",

  props: {
    jobs: Array,
    onDay: Function,
    onMonthYear: Function,
    date: Date,
    year: Number,
    month: Number
  },

  data() {
    return {
      page: {
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
      }
    };
  },

  methods: {
    onPage(page) {
      // Calendar page has changed
      this.onMonthYear(page.month, page.year);
    },

    showCurrentPage() {
      // Sets the calendar to the given year-month
      if (this.month && this.year) {
        this.page = {
          month: this.month,
          year: this.year
        };
        this.$refs.calendar.refreshFromPage();
      }
    }
  },

  computed: {
    attrs: function() {
      var logDays = _.groupBy(this.jobs, "date");
      if (!logDays[this.date]) {
        // This occurs when a date is chosen with no logs
        logDays[this.date] = [];
      }
      return Object.entries(logDays).map(([date, logDays]) => ({
        key: date,
        highlight: {
          backgroundColor:
            this.date == date ? COLORS.selected : COLORS.unselected
        },
        dates: new Date(date),
        customData: logDays,
        popover: {
          component: CalendarDay
        }
      }));
    }
  },

  mounted() {
    // Update calendar once this event has finished
    setTimeout(() => this.showCurrentPage(), 0);
  },

  watch: {
    date() {
      this.showCurrentPage();
    },

    year() {
      this.showCurrentPage();
    },

    month() {
      this.showCurrentPage();
    }
  }
};
</script>

<style scoped></style>
