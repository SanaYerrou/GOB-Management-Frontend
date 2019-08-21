<template>
  <div>
    <div>
      <h4>Processes</h4>
      <div
        v-for="service in services"
        :key="service.serviceId"
        v-if="service.instances"
        class="mb-2"
      >
        <div
          v-for="(instance, i) in service.instances.filter(
            i => i.tasks.length > 0
          )"
          :key="instance.serviceId"
          class="mb-2"
        >
          <div>
            {{ instance.name }}
            <span v-if="service.instances.length > 1">({{ i + 1 }})</span>
            <font-awesome-icon
              v-if="isRunning(instance)"
              icon="cog"
              class="fa-spin"
            />
          </div>
          <div
            v-for="task in tasks(instance)"
            :key="task.name"
            class="small"
            :class="task.isAlive ? 'INFO' : 'ERROR'"
          >
            {{ taskname(task) }}
            <span v-if="task.count > 1">({{ task.count }})</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const names = {
  Eventloop: "Waiting for messages",
  MessageHandler: "Processing message",
  MainThread: "Active",
  QueueHandler: "Queue handler"
};
const ANONYMOUS_THREAD = "Anonymous";

export default {
  name: "ServiceDetail",
  props: {
    services: Object
  },
  methods: {
    taskname(task) {
      return names[task.name] || ANONYMOUS_THREAD;
    },
    tasks(instance) {
      return Object.values(
        instance.tasks
          .map(t => {
            t.taskname = this.taskname(t);
            return t;
          })
          .filter(t => t.taskname !== ANONYMOUS_THREAD)
          .reduce((r, t) => {
            const name = t.taskname;
            if (!r[name]) {
              r[name] = t;
              r[name].count = 0;
            }
            r[name].isAlive = r[name].isAlive && t.isAlive;
            r[name].count += 1;
            return r;
          }, {})
      );
    },
    isRunning(service) {
      if (service && service.tasks) {
        return (
          service.tasks.filter(t => this.taskname(t) === names.MessageHandler)
            .length > 0
        );
      } else {
        return false;
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
