<template>
    <b-navbar toggleable="sm" type="light" variant="info">

        <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

        <b-navbar-brand to="/">
            <img alt="AMS logo" src="../assets/andreas.png" height="30">
            <img alt="GOB logo" src="../assets/logo.png" width="30" height="30">
        </b-navbar-brand>

        <b-collapse is-nav id="nav_collapse">

            <b-navbar-nav>
                <b-nav-item to="/sources">Bronnen</b-nav-item>
                <b-nav-item to="/catalogues">Catalogi</b-nav-item>
                <b-nav-item to="/entities">Entiteiten</b-nav-item>
                <b-nav-item to="/jobs">Jobs</b-nav-item>
            </b-navbar-nav>

            <!-- Right aligned nav items -->
            <b-navbar-nav class="ml-auto">

                <b-nav-item-dropdown right>
                    <!-- Using button-content slot -->
                    <template slot="button-content">
                        <em>User</em>
                    </template>
                    <b-dropdown-item href="#">Signout</b-dropdown-item>
                </b-nav-item-dropdown>
            </b-navbar-nav>

        </b-collapse>
    </b-navbar>
</template>

<script>
export default {
  name: "Navigation"
};
</script>
