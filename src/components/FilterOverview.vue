<template>
  <div v-if="hasActiveFilters">
    <span v-for="(items, key) in filter" :key="key">
      <b-button
        v-for="item in items"
        v-if="hideKeys.indexOf(key) === -1"
        class="mr-2 mb-2"
        :key="item"
        size="sm"
        @click="closeItem(items, key, item);"
      >
        {{ item }} <span aria-hidden="true">&times;</span>
      </b-button>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    filter: Object
  },
  methods: {
    closeItem(items, key, item) {
      const i = items.indexOf(item);
      delete this.filter[key].splice(i, 1);
    }
  },
  computed: {
    hasActiveFilters() {
      for (let key of Object.keys(this.filter)) {
        if (this.hideKeys.indexOf(key) === -1 && this.filter[key].length > 0) {
          return true;
        }
      }
      return false;
    }
  },
  data() {
    return {
      hideKeys: ["year", "month", "day"]
    };
  }
};
</script>

<style></style>
