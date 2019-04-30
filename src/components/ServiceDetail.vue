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
            v-for="task in instance.tasks"
            :key="task.name"
            class="small"
            :class="task.isAlive ? 'INFO' : 'ERROR'"
          >
            {{ taskname(task) }}
          </div>
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
