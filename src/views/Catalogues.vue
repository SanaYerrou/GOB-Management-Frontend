<template>
    <div>
        <h1>Catalogi</h1>
        <div>
            <div v-for="catalogue in catalogues" :key="catalogue">
                <b-btn :to="{name: 'entities', query: { catalogue }}"
                       block
                       class="mb-2"
                       variant="outline-secondary">
                    {{catalogue}}
                </b-btn>
            </div>
        </div>
    </div>
</template>

<script>
import { catalogues } from "../services/gob";

export default {
  name: "Catalogues",
  data() {
    return {
      catalogues: []
    };
  },
  methods: {
    async loadData() {
      this.catalogues = await catalogues();
    }
  },
  async mounted() {
    this.loadData();
  }
};
</script>

<style scoped>
</style>
