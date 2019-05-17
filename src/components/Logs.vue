<template>
  <div>
    <b-table
      :fields="FIELDS"
      :items="logs.filter(l => !l.msgid)"
      class="log"
      hover
      small
    >
      <template slot="timestamp" slot-scope="data">
        {{ data.item.timestamp | formatdate("HH:mm:ss") }}
      </template>

      <template slot="msg" slot-scope="data">
        {{ data.item.msg }}
        <div v-for="(item, key) in data.item.data" :key="key" class="logdata">
          {{ key }}: {{ item }}
        </div>
      </template>
    </b-table>

    <div v-for="id in msgids" :key="id.msgid">
      <div>
        <div>
          <div class="text-left">
            {{ id.level }} ({{
              logs.filter(l => l.msgid === id.msgid).length
            }}):
          </div>
          <b-btn v-b-toggle="id.msgid" block variant="outline-secondary">
            {{ id.msgid }}
          </b-btn>
        </div>

        <b-collapse :id="id.msgid" class="mt-2">
          <div
            v-for="log in logs.filter(l => l.msgid === id.msgid)"
            :key="log.logid"
          >
            <div v-for="(item, key) in log.data" :key="key" class="logdata">
              {{ key }}: {{ item }}
            </div>
          </div>
        </b-collapse>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";

const FIELDS = {
  timestamp: {
    label: "Tijdstip"
  },
  level: {
    label: ""
  },
  msg: {
    label: "Bericht"
  }
};

export default {
  name: "Logs",
  data() {
    return {
      FIELDS
    };
  },
  props: {
    logs: Array
  },
  computed: {
    msgids() {
      return _.uniqBy(this.logs.filter(l => l.msgid), "msgid");
    }
  }
};
</script>

<style scoped>
.log {
  text-align: left;
}
.logdata {
  text-align: right;
}
</style>
