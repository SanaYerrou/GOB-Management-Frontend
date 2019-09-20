<template>
  <div>
    <div v-for="i in order" :key="i">
      <div v-if="i === 1">
        <font-awesome-icon
          :icon="icon"
          :class="reversedIcon ? 'fa-rotate-180' : ''"
        />
      </div>
      <div v-if="i === 2">
        <div>{{ name }}</div>
        <div
          v-if="service && service.instances"
          :set="
            ((running = service.instances.filter(i => isRunning(i)).length),
            (alive = service.instances.filter(i => i.isAlive).length))
          "
        >
          <span :class="running > 0 ? 'ERROR_TEXT' : 'INFO_TEXT'">{{
            running
          }}</span>
          /
          {{ alive }}
        </div>
        <div v-else>
          &nbsp;
        </div>
      </div>
      <div v-if="i === 3">
        <b-progress
          :value="value"
          :max="MAX_VALUE"
          :variant="variant"
          :class="reversed ? 'mt-3' : 'mb-3'"
        ></b-progress>
      </div>
    </div>
  </div>
</template>

<script>
import { isAlive, ALIVE_INTERVAL, isRunning } from "../services/status";

export default {
  name: "StatusIndicator",
  props: {
    name: String,
    icon: String,
    service: Object,
    reversed: Boolean,
    reversedIcon: Boolean
  },
  data() {
    return {
      MAX_VALUE: ALIVE_INTERVAL,
      order: [1, 2, 3]
    };
  },
  computed: {
    value() {
      if (this.service) {
        return isAlive(this.service)
          ? this.MAX_VALUE - this.service.age // descending
          : this.service.age - this.MAX_VALUE; // ascending
      } else {
        return 0;
      }
    },
    variant() {
      return isAlive(this.service) ? "success" : "danger";
    }
  },
  methods: {
    isRunning(service) {
      return isRunning(service);
    }
  },
  mounted() {
    if (this.reversed) {
      this.order = this.order.reverse();
    }
  }
};
</script>

<style lang="scss" scoped></style>
