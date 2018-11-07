<template>
    <div>
        <h1>Entiteiten</h1>
        <div>
            <div v-for="catalogue in catalogues()" :key="catalogue">
                <b-btn :to="{name: 'jobs', query: { catalogue }}"
                       block
                       class="mb-2 text-left"
                       variant="outline-secondary">
                    Catalogus: <span class="name">{{catalogue}}</span>
                </b-btn>
                <div v-for="source in catalogueSources(catalogue)" :key="source" class="ml-5">
                    <b-btn :to="{name: 'jobs', query: { source }}"
                           block
                           class="mb-2 text-left"
                           variant="outline-secondary">
                        Bron: <span class="name">{{source}}</span>
                    </b-btn>
                    <div v-for="entity in catalogueSourceEntities(catalogue, source)" :key="entity.entity" class="ml-5">
                        <b-btn :to="{name: 'jobs', query: { source: entity.source, catalogue: entity.catalogue, entity: entity.entity }}"
                               block
                               class="mb-2"
                               variant="outline-secondary">
                            <span class="name">{{entity.entity}}</span>
                        </b-btn>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { entities } from "../services/gob";

export default {
  name: "entities",
  data() {
    return {
      source: null,
      catalogue: null,
      entities: []
    };
  },
  methods: {
    async loadData() {
      this.source = this.$route.query.source;
      this.catalogue = this.$route.query.catalogue;
      this.entities = await entities(this.source, this.catalogue);
    },
    catalogues() {
      return _.uniqBy(this.entities.map(e => e.catalogue))
    },
    catalogueSources(catalogue) {
      return _.uniqBy(this.entities.filter(e => e.catalogue === catalogue).map(e => e.source))
    },
    catalogueSourceEntities(catalogue, source) {
      return this.entities.filter(e => e.catalogue === catalogue && e.source === source)
    }
  },
  async mounted() {
    this.loadData();
  },
  watch: {
    "$route.query.source"() {
      this.loadData();
    },
    "$route.query.catalogue"() {
      this.loadData();
    }
  }
};
</script>

<style scoped>
.name {
    font-weight: bolder;
}
</style>
