<template>
  <b-navbar toggleable="sm" type="light" variant="info">
    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

    <b-navbar-brand to="/">
      <img alt="AMS logo" src="../assets/andreas.png" height="30" />
      <img alt="GOB logo" src="../assets/logo.png" width="30" height="30" />
    </b-navbar-brand>

    <b-collapse is-nav id="nav_collapse">
      <router-link to="/status">
        <status-report size="small" class="mb-1"></status-report>
      </router-link>
      <b-navbar-nav>
        <b-nav-item to="/sources">Bronnen</b-nav-item>
        <b-nav-item to="/catalogues">Catalogi</b-nav-item>
        <b-nav-item to="/entities">Entiteiten</b-nav-item>
        <b-nav-item to="/management">Management</b-nav-item>
        <b-nav-item to="/jobs">Jobs</b-nav-item>
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown right>
          <!-- Using button-content slot -->
          <template slot="button-content">
            <em>{{ username || "User" }}</em>
          </template>
          <b-dropdown-item v-if="!username" v-on:click="login()"
            >Login</b-dropdown-item
          >
          <b-dropdown-item v-if="username" v-on:click="logout()"
            >Logout</b-dropdown-item
          >
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import StatusReport from "./StatusReport";
import auth from "../services/auth";

export default {
  name: "Navigation",
  components: { StatusReport },
  data() {
    return {
      username: null
    };
  },
  methods: {
    login() {
      auth.login();
    },
    logout() {
      auth.logout();
    }
  },
  async mounted() {
    // Load user info during startup
    // If a user is logged in the username will be shown and a logout button will be available
    // If not, then the text "User" is shown and a login button is available
    const userInfo = await auth.userInfo();
    if (userInfo) {
      this.username = userInfo.preferred_username;
    }
  }
};
</script>
