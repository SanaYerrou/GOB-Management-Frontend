<template>
  <div>
    <h1>Nieuwe job starten</h1>
    <div role="tablist">
      <b-card
        no-body
        class="mb-1"
        v-for="(collections, catalog) in catalogCollections"
        v-if="!['rel', 'test_catalogue'].includes(catalog)"
        :key="catalog"
      >
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button block href="#" v-b-toggle="catalog" variant="info">{{
            catalog
          }}</b-button>
        </b-card-header>

        <b-collapse :id="catalog" accordion="my-accordion" role="tabpanel">
          <b-card-body class="jobcard">
            <b-form-group
              label="Collections"
              :id="catalog + 'collections'"
              :disabled="collectionDisabled[catalog]"
            >
              <b-form-radio-group
                v-model="collection[catalog]"
                :options="collections"
              >
              </b-form-radio-group>
            </b-form-group>

            <b-form-group label="Actions" :id="catalog + 'actions'">
              <b-form-radio-group
                stacked
                v-model="action[catalog]"
                @change="onAction(catalog, $event)"
                :options="catalogActions(catalog)"
              >
              </b-form-radio-group>
            </b-form-group>

            <job-start
              title="Start"
              :action="action[catalog]"
              :catalog="catalog"
              :collection="collection[catalog]"
            ></job-start>
          </b-card-body>
        </b-collapse>
      </b-card>
    </div>
  </div>
</template>

<script>
import { catalogOnlyJobs, catalogCollections } from "../services/gob";
import JobStart from "../components/JobStart";

export default {
  name: "Management",
  components: { JobStart },
  data() {
    return {
      action: {},
      collection: {},
      collectionDisabled: {},
      catalogCollections: {},
      actions: ["Import", "Relate", "Export", "Export Test"]
    };
  },
  async mounted() {
    this.catalogCollections = await catalogCollections();
  },
  methods: {
    catalogActions(catalog) {
      const actions =
        catalog === "brk" ? ["Prepare", ...this.actions] : this.actions;
      return actions.map(action => ({
        value: action,
        text: action === "Prepare" ? `${action} (Includes import)` : action
      }));
    },
    onAction(catalog, action) {
      if (catalogOnlyJobs.includes(action)) {
        delete this.collection[catalog];
        this.collectionDisabled[catalog] = true;
      } else {
        this.collectionDisabled[catalog] = false;
      }
      this.$forceUpdate();
    }
  }
};
</script>

<style scoped>
.jobcard {
  text-align: left !important;
}
</style>
