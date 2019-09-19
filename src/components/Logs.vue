<template>
  <div>
    <b-form-group class="text-left">
      <b-form-checkbox
        v-model="filter[level]"
        v-for="(n, level) in levels()"
        :key="level"
        inline
        >{{ level }} ({{ n }})</b-form-checkbox
      >
    </b-form-group>

    <table>
      <tbody>
        <tr>
          <th>Tijdstip</th>
          <th></th>
          <th>Bericht</th>
        </tr>
        <tr
          v-for="log in logs.filter(l => !l.msgid).filter(l => filter[l.level])"
          :key="log.logid"
        >
          <td :class="log.level">
            {{ log.timestamp | formatdate("HH:mm:ss") }}
          </td>
          <td :class="log.level">{{ log.level }}</td>
          <td>
            {{ log.msg }}
            <div v-for="(item, key) in log.data" :key="key" class="logdata">
              {{ key }}: {{ item }}
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-for="id in msgids" :key="id.msgid">
      <div v-if="filter[id.level]">
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
      FIELDS,
      filter: {
        INFO: true,
        WARNING: true,
        ERROR: true
      }
    };
  },
  props: {
    logs: Array
  },
  methods: {
    levels() {
      return this.logs.reduce((r, l) => {
        r[l.level] = r[l.level] || 0;
        r[l.level] += 1;
        return r;
      }, {});
    }
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

table {
  border-spacing: 15px;
}
table,
th,
td {
  text-align: left;
  vertical-align: top;
  padding-left: 5px;
  padding-right: 5px;
}
th {
  font-weight: bold;
}
tr:hover {
  background-color: lightgray;
}
</style>
