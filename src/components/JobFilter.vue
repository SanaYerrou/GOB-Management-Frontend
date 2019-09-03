<template>
  <div>
    <b-form-group label="Shortcuts" class="text-left">
      <div class="mb-1">
        <b-btn variant="primary" @click="filterOnFailed()">Jobs gefaald</b-btn>
      </div>
      <div class="mb-1">
        <b-btn variant="primary" @click="filterOnErrors()"
          >Jobs met fouten</b-btn
        >
      </div>
      <div class="mb-1">
        <b-btn variant="primary" @click="filterOnWarnings()"
          >Jobs met waarschuwingen</b-btn
        >
      </div>
      <div>
        <b-btn variant="primary" @click="clearFilter()">Reset filters</b-btn>
      </div>
    </b-form-group>
    <b-form-group label="Type meldingen" class="text-left">
      <b-form-checkbox-group
        stacked
        v-model="filter.messageTypes"
        name="flavour2a"
        :options="messageTypes"
      />
    </b-form-group>
    <div
      v-for="filterType in filterTypes"
      :key="filterType.key"
      v-if="filterOptions(filterType.key).length"
    >
      <b-form-group :label="filterType.text" class="text-left">
        <b-form-checkbox-group
          stacked
          v-model="filter[filterType.key]"
          name="flavour2a"
          :options="filterOptions(filterType.key)"
        />
      </b-form-group>
    </div>
  </div>
</template>

<script>
import _ from "lodash";

export default {
  props: {
    filter: Object,
    jobs: Array
  },
  methods: {
    clearFilter() {
      Object.keys(this.filter).map(key => {
        this.filter[key] = [];
      });
    },
    filterOnFailed() {
      this.clearFilter();
      this.filter.ageCategory = [" 0 - 24 uur"];
      this.filter.status = ["zombie", "failed"];
    },
    filterOnErrors() {
      this.clearFilter();
      this.filter.ageCategory = [" 0 - 24 uur"];
      this.filter.messageTypes = ["errors"];
    },
    filterOnWarnings() {
      this.clearFilter();
      this.filter.ageCategory = [" 0 - 24 uur"];
      this.filter.messageTypes = ["warnings"];
    },
    filterOptions(key) {
      return _.uniq(
        this.jobs
          // Filter out relation entities
          .filter(job => (key === "entity" ? job.catalogue !== "rel" : true))
          .map(job => job[key])
          .concat(this.filter[key])
          .filter(k => k)
          .map(k => k.toLowerCase())
          .map(k => k.replace(/_/g, " "))
          .sort()
      );
    }
  },
  data() {
    return {
      filterTypes: [
        { text: "Status", key: "status" },
        { text: "Leeftijd", key: "ageCategory" },
        { text: "Bron", key: "source" },
        { text: "Type verwerking", key: "name" },
        { text: "Registraties", key: "catalogue" },
        { text: "Applicatie", key: "application" },
        { text: "Entiteiten", key: "entity" }
      ],
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
