<template>
    <v-calendar :attributes='attrs'
                @dayclick="onDay"
                @update:fromPage="onPage">
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
    date: Date
  },
  methods: {
    onPage(page) {
      this.onMonthYear(page.month, page.year)
    }
  },
  computed: {
    attrs: function() {
      var logDays = _.groupBy(this.jobs, "date");
      return Object.entries(logDays).map(([date, logDays]) => ({
        key: date,
        highlight: {
          backgroundColor:
            !this.date || this.date == date
              ? COLORS.selected
              : COLORS.unselected
        },
        dates: new Date(date),
        customData: logDays,
        popover: {
          component: CalendarDay
        }
      }));
    }
  }
};
</script>

<style scoped>
</style>
