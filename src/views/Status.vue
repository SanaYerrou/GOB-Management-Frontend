<template>
  <div>
    <h1>Status</h1>
    <div class="mt-5"><status-report size="large"></status-report></div>
  </div>
</template>

<script>
import StatusReport from "../components/StatusReport";

export default {
  name: "status",
  components: { StatusReport },
  data() {
    return {};
  }
};
</script>
