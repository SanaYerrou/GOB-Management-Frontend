<template>
  <div>
    <div>
      <h4>Processes</h4>
      <div
        v-for="service in services"
        :key="service.name"
        v-if="service.tasks"
        class="mb-2"
      >
        <div>
          {{ service.name }}
          <font-awesome-icon
            v-if="isRunning(service)"
            icon="cog"
            class="fa-spin"
          />
        </div>
        <div
          v-for="task in service.tasks"
          :key="task.name"
          class="small"
          :class="task.isAlive ? 'INFO' : 'ERROR'"
        >
          {{ taskname(task) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ServiceDetail",
  props: {
    services: Object
  },
  methods: {
    taskname(task) {
      const names = {
        Eventloop: "Waiting for messages",
        MessageHandler: "Processing message",
        MainThread: "Active"
      };
      return names[task.name] || task.name;
    },
    isRunning(service) {
      if (service && service.tasks) {
        return service.tasks.length > 2;
      } else {
        return false;
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
