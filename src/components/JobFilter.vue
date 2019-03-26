<template>
  <div>
    <b-form-group label="Registraties" align="left">
      <b-form-checkbox-group
        stacked
        v-model="filter.registrations"
        name="flavour2a"
        :options="registrations"
      />
    </b-form-group>
    <b-form-group label="Type verwerkingen" align="left">
      <b-form-checkbox-group
        stacked
        v-model="filter.processTypes"
        name="flavour2a"
        :options="processTypes"
      />
    </b-form-group>
    <b-form-group label="Type meldingen" align="left">
      <b-form-checkbox-group
        stacked
        v-model="filter.messageTypes"
        name="flavour2a"
        :options="messageTypes"
      />
    </b-form-group>
  </div>
</template>

<script>
import _ from "lodash";

export default {
  props: {
    filter: Object,
    jobs: Array
  },
  computed: {
    registrations() {
      return _.uniq(this.jobs.map(job => job.catalogue).sort());
    },
    processTypes() {
      return _.uniq(this.jobs.map(job => job.name).sort());
    },
    filteredJobs() {
      return this.jobs.filter(job => {
        return (
          (this.filter.registrations.length === 0 ||
            this.filter.registrations.includes(job.catalogue)) &&
          (this.filter.processTypes.length === 0 ||
            this.filter.processTypes.includes(job.name)) &&
          (this.filter.messageTypes.length === 0 ||
            this.filter.messageTypes.reduce((s, t) => s + job[t], 0) > 0)
        );
      });
    }
  },
  data() {
    return {
      messageTypes: [
        { text: "Info", value: "infos" },
        { text: "Warning", value: "warnings" },
        { text: "Error", value: "errors" }
      ]
    };
  }
};
</script>

<style>
.col-form-label {
  font-weight: bold !important;
}
</style>
