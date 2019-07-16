<template>
  <div>
    <h1>Nieuwe job starten</h1>
    <div role="tablist">
      <b-card
        no-body
        class="mb-1"
        v-for="(collections, catalog) in catalogCollections"
        :key="catalog"
      >
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button
            block
            href="#"
            v-b-toggle="catalog"
            variant="info"
            @click="onCatalog(catalog)"
            >{{ catalog }}</b-button
          >
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

            <div class="result">
              <b-button
                :disabled="!canStart(action[catalog], collection[catalog])"
                @click="start(catalog, action[catalog], collection[catalog])"
                >Start {{ action[catalog] }}</b-button
              >
              <div
                v-if="result[catalog]"
                class="mt-2"
                :class="result[catalog].ok ? 'INFO' : 'ERROR'"
              >
                {{ result[catalog].text }}
              </div>
            </div>
          </b-card-body>
        </b-collapse>
      </b-card>
    </div>
  </div>
</template>

<script>
import { createJob } from "../services/gob";

const catalogOnly = ["Prepare", "Export Test"];

export default {
  name: "Management",
  data() {
    return {
      action: {},
      collection: {},
      collectionDisabled: {},
      result: {},
      catalogCollections: {
        BAG: [
          "Brondocumenten",
          "Dossiers",
          "Ligplaatsen",
          "Nummeraanduidingen",
          "Openbareruimtes",
          "Panden",
          "Standplaatsen",
          "Verblijfsobjecten",
          "Woonplaatsen"
        ],
        BRK: [
          "aantekeningenkadastraleobjecten",
          "aantekeningenrechten",
          "aardzakelijkerechten",
          "kadastraleobjecten",
          "stukdelen",
          "tenaamstellingen",
          "zakelijkerechten"
        ],
        Gebieden: [
          "Bouwblokken",
          "Buurten",
          "Wijken",
          "Stadsdelen",
          "GGWGebieden",
          "GGPGebieden"
        ],
        Meetbouten: ["Meetbouten", "Metingen", "Referentiepunten", "Rollagen"],
        NAP: ["Peilmerken"]
      },
      actions: ["Import", "Relate", "Export", "Export Test"]
    };
  },
  methods: {
    catalogActions(catalog) {
      const actions =
        catalog === "BRK" ? ["Prepare", ...this.actions] : this.actions;
      return actions.map(action => ({
        value: action,
        text: action === "Prepare" ? `${action} (Includes import)` : action
      }));
    },
    onCatalog(catalog) {
      this.clearResult(catalog);
      this.$forceUpdate();
    },
    onAction(catalog, action) {
      this.clearResult(catalog);
      if (catalogOnly.includes(action)) {
        delete this.collection[catalog];
        this.collectionDisabled[catalog] = true;
      } else {
        this.collectionDisabled[catalog] = false;
      }
      this.$forceUpdate();
    },
    canStart(action, collection) {
      return catalogOnly.includes(action) || (action && collection);
    },
    clearResult(catalog) {
      this.result[catalog] = {};
    },
    async start(catalog, action, collection) {
      this.clearResult(catalog);
      const result = await createJob(action, catalog, collection);
      if (result.ok) {
        const info = JSON.parse(result.text);
        const values = Object.values(info).join(" ");
        result.text = `${this.action[catalog]} ${values} started`;
      }
      this.result[catalog] = result;
      delete this.action[catalog];
      delete this.collection[catalog];
      this.$forceUpdate();
    }
  },
  mounted() {},
  watch: {}
};
</script>

<style scoped>
.jobcard {
  text-align: left !important;
}
.result {
  text-align: center !important;
}
</style>
