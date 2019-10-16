<template>
  <div v-if="queues">
    <h3>Queues</h3>
    <table align="center">
      <tr align="left">
        <th>Process</th>
        <th colspan="2">Waiting</th>
        <th colspan="2">Processing</th>
      </tr>
      <tr v-for="queue in queues" :key="queue.name">
        <td align="left">{{ queue.name }}</td>
        <td>
          <img
            v-for="n in Math.min(queue.messages_ready, MAX_READY)"
            :key="n"
            src="../assets/waiting.gif"
            height="20px"
          />
          <span v-if="queue.messages_ready > MAX_READY">...</span>
        </td>
        <td align="right">
          {{ queue.messages_ready }}
        </td>
        <td>
          <img
            v-for="n in queue.messages_unacknowledged"
            :key="n"
            src="../assets/processing.gif"
            height="20px"
          />
        </td>
        <td align="right">{{ queue.messages_unacknowledged }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import { getQueues } from "../services/gob";

export default {
  name: "Queues",
  data() {
    return {
      queues: null,
      interval: null,
      MAX_READY: 4
    };
  },
  methods: {
    std_queue(queue) {
      queue.name = queue.name
        .replace(".queue", "")
        .replace("gob.workflow.", "");
      return queue;
    },

    async update() {
      // .filter(q => q.messages_ready > 0)
      let queues = await getQueues();
      this.queues = queues
        .filter(q => q.name.startsWith("gob.workflow"))
        .filter(q => !q.name.includes("task"))
        .filter(q => !q.name.includes(".complete"))
        .filter(q => !q.name.includes(".result"))
        .map(q => this.std_queue(q))
        .sort(q => q.name);
    }
  },
  async mounted() {
    await this.update();
    this.interval = setInterval(this.update, 5000);
  },
  destroyed() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  },
  watch: {}
};
</script>

<style scoped>
td {
  padding-right: 25px;
}
</style>
