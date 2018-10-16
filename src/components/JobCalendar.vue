<template>
    <v-calendar :attributes='attrs'
                @dayclick="onDay">
    </v-calendar>
</template>

<script>
import { amsmiddengrijs, amslichtgrijs } from "../services/colors";
import { jobsPerDate } from "../services/gob";

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
    date: Date
  },
  computed: {
    attrs: function() {
      return Object.entries(jobsPerDate(this.jobs)).map(([date, jobs]) => ({
        key: date,
        highlight: {
          backgroundColor:
            !this.date || this.date == date
              ? COLORS.selected
              : COLORS.unselected
        },
        dates: new Date(date),
        customData: jobs,
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
