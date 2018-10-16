<template>
    <div>
        <h1>Entiteiten</h1>
        <div>
            <div v-for="entity in entities" :key="entity.entity">
                <b-btn :to="{name: 'jobs', query: { source: entity.source, entity: entity.entity }}"
                       block
                       class="mb-2"
                       variant="outline-secondary">
                    {{entity.source}}
                    {{entity.entity}}
                </b-btn>
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
      entities: []
    };
  },
  methods: {
    async loadData() {
      this.source = this.$route.query.source;
      this.entities = await entities(this.source);
    }
  },
  async mounted() {
    this.loadData();
  },
  watch: {
    "$route.query.source"() {
      this.loadData();
    }
  }
};
</script>

<style scoped>
</style>
