<template>
    <div>
        <h1>Bronnen</h1>
        <div>
            <div v-for="source in sources" :key="source">
                <b-btn :to="{name: 'entities', query: { source }}"
                       block
                       class="mb-2"
                       variant="outline-secondary">
                    {{source}}
                </b-btn>
            </div>
        </div>
    </div>
</template>

<script>
import { sources } from "../services/gob";

export default {
  name: "Sources",
  data() {
    return {
      sources: []
    };
  },
  methods: {
    async loadData() {
      this.sources = await sources();
    }
  },
  async mounted() {
    this.loadData();
  }
};
</script>

<style scoped>
</style>
