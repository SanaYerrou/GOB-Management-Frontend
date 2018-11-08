<template>
    <v-calendar :attributes='attrs'
                @dayclick="onDay">
    </v-calendar>
</template>

<script>
import { amsmiddengrijs, amslichtgrijs } from "../services/colors";
import { logDates } from "../services/gob";

import CalendarDay from "./CalendarDay";

const COLORS = {
  selected: amsmiddengrijs,
  unselected: amslichtgrijs
};

export default {
  name: "JobCalendar",
  props: {
    logDays: Array,
    onDay: Function,
    date: Date
  },
  computed: {
    attrs: function() {
      return Object.entries(logDates(this.logDays)).map(([date, logDays]) => ({
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
