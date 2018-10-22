<template>
    <b-table :fields="FIELDS"
             :items="logs"
             class="log"
             hover
             small>

        <template slot="timestamp" slot-scope="data">
            {{data.item.timestamp | moment("HH:mm:ss")}}
        </template>

        <template slot="msg" slot-scope="data">
            {{data.item.msg}}
            <div v-for="(item, key) in data.item.data" :key="key"
                 class="logdata">
                {{key}}: {{item}}
            </div>
        </template>
    </b-table>
</template>

<script>
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
