<template>
  <div v-if="queues">
    <h3>Queues</h3>
    <table align="center">
      <tr align="left">
        <th>Process</th>
        <th></th>
        <th colspan="2">Waiting</th>
        <th colspan="2">Processing</th>
      </tr>
      <tr v-for="queue in queues" :key="queue.name">
        <td align="left">{{ queue.display }}</td>
        <td>
          <b-btn
            v-if="isAdmin && queue.messages_ready > 0"
            size="sm"
            @click="purgeQueue(queue)"
          >
            <font-awesome-icon icon="trash-alt" class="fa-xs" />
          </b-btn>
        </td>
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
            v-for="n in Math.min(queue.messages_unacknowledged, MAX_READY)"
            :key="n"
            src="../assets/processing.gif"
            height="20px"
          />
          <span v-if="queue.messages_unacknowledged > MAX_READY">...</span>
        </td>
        <td align="right">{{ queue.messages_unacknowledged }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import { getQueues, purgeQueue } from "../services/gob";
import auth from "../services/auth";

const ORDER = [
  "prepare",
  "import",
  "compare",
  "fullupdate",
  "apply",
  "relate",
  "check_relation",
  "export",
  "export_test",
  "heartbeat",
  "logs"
];

export default {
  name: "Queues",
  data() {
    return {
      queues: null,
      interval: null,
      MAX_READY: 4
    };
  },
  computed: {
    isAdmin() {
      return auth.isAdmin();
    }
  },
  methods: {
    std_queue(queue) {
      queue.display = queue.name
        .replace(".queue", "")
        .replace("gob.workflow.", "")
        .replace("gob.status.", "")
        .replace("gob.log.", "");
      return queue;
    },
    async purgeQueue(queue) {
      purgeQueue(queue);
    },
    async update() {
      // .filter(q => q.messages_ready > 0)
      let queues = await getQueues();
      this.queues = queues
        .filter(q => !q.name.includes(".task"))
        .filter(q => !q.name.includes(".complete"))
        .filter(q => !q.name.includes(".result"))
        .map(q => this.std_queue(q))
        .filter(q => ORDER.indexOf(q.display) >= 0)
        .sort(
          (q1, q2) => ORDER.indexOf(q1.display) - ORDER.indexOf(q2.display)
        );
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
