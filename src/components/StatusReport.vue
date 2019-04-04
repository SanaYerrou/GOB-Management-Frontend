<template>
  <div>
    <div v-if="size === 'large'">
      <div class="row">
        <div class="col">
          <table align="center">
            <tr>
              <td style="width:40%" colspan="2"></td>
              <td style="width:40%" colspan="2" class="unitborder">
                <font-awesome-icon icon="database" />
              </td>
              <td style="width:20%"></td>
            </tr>
            <tr>
              <td style="width:40%" colspan="2"></td>
              <td style="width:20%">
                <font-awesome-icon icon="long-arrow-alt-up" />
              </td>
              <td style="width:20%">
                <font-awesome-icon icon="long-arrow-alt-down" />
              </td>
              <td style="width:20%"></td>
            </tr>
            <tr>
              <td style="width:20%">
                <status-indicator
                  name="Prepare"
                  icon="filter"
                  :service="services.Prepare"
                ></status-indicator>
              </td>
              <td style="width:20%">
                <status-indicator
                  name="Import"
                  icon="download"
                  :service="services.Import"
                ></status-indicator>
              </td>
              <td style="width:20%">
                <status-indicator
                  name="Workflow"
                  icon="cogs"
                  :service="services.Workflow"
                ></status-indicator>
              </td>
              <td style="width:20%">
                <status-indicator
                  name="BeheerAPI"
                  icon="plug"
                  :service="services.BeheerAPI"
                ></status-indicator>
              </td>
              <td style="width:20%">
                <status-indicator
                  name="IRIS"
                  icon="tv"
                  :service="services.IRIS"
                ></status-indicator>
              </td>
            </tr>
            <tr>
              <td colspan="5" class="unitborder">
                <font-awesome-icon icon="envelope" />
              </td>
            </tr>
            <tr>
              <td style="width:20%">
                <status-indicator
                  :reversed="true"
                  name="Compare"
                  icon="balance-scale"
                  :service="services.Upload"
                ></status-indicator>
              </td>
              <td style="width:20%">
                <status-indicator
                  :reversed="true"
                  name="Relate"
                  icon="link"
                  :service="services.Upload"
                ></status-indicator>
              </td>
              <td style="width:20%">
                <status-indicator
                  :reversed="true"
                  :reversedIcon="true"
                  name="Upload"
                  icon="upload"
                  :service="services.Upload"
                ></status-indicator>
              </td>
              <td style="width:20%">
                <status-indicator
                  :reversed="true"
                  :reversedIcon="true"
                  name="API"
                  icon="plug"
                ></status-indicator>
              </td>
              <td style="width:20%">
                <status-indicator
                  :reversed="true"
                  name="Export"
                  icon="file-export"
                  :service="services.Export"
                ></status-indicator>
              </td>
            </tr>
            <tr>
              <td style="width:20%">
                <font-awesome-icon icon="long-arrow-alt-up" />
              </td>
              <td style="width:20%">
                <font-awesome-icon icon="long-arrow-alt-up" />
              </td>
              <td style="width:20%">
                <font-awesome-icon icon="arrows-alt-v" />
              </td>
              <td style="width:20%">
                <font-awesome-icon icon="long-arrow-alt-up" />
              </td>
              <td style="width:20%"></td>
            </tr>
            <tr>
              <td style="width:80%" colspan="4" class="unitborder">
                <font-awesome-icon icon="database" />
              </td>
              <td style="width:20%"></td>
            </tr>
          </table>
        </div>
        <div class="col">
          <service-detail :services="services"></service-detail>
        </div>
      </div>
    </div>

    <div v-else>
      <b-badge class="badge-pill" :variant="variant"> &nbsp; </b-badge>
    </div>
  </div>
</template>

<script>
import { services, isAlive } from "../services/status";
import StatusIndicator from "./StatusIndicator";
import ServiceDetail from "./ServiceDetail";

const REFRESH_INTERVAL = 5000;

export default {
  name: "StatusReport",
  components: { ServiceDetail, StatusIndicator },
  props: {
    size: String
  },
  data() {
    return {
      services: {},
      timeout: null
    };
  },
  computed: {
    variant() {
      var allAlive =
        this.services &&
        Object.values(this.services).reduce(
          (alive, service) => alive && isAlive(service),
          true
        );
      return allAlive ? "success" : "danger";
    }
  },
  methods: {
    async monitorServices() {
      this.services = await services();
      this.timeout = window.setTimeout(this.monitorServices, REFRESH_INTERVAL);
    }
  },
  async mounted() {
    this.monitorServices();
  },
  destroyed() {
    if (this.timeout) {
      window.clearTimeout(this.timeout);
    }
    this.timeout = null;
  }
};
</script>

<style scoped>
.unitborder {
  border-style: solid;
  border-width: thin;
  border-color: black;
}
</style>
