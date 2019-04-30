<template>
  <div>
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
    filterOptions(key) {
      return _.uniq(
        this.jobs
          .map(job => job[key])
          .filter(k => k)
          .concat(this.filter[key])
          .sort()
      );
    }
  },
  data() {
    return {
      filterTypes: [
        { text: "Status", key: "status" },
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
