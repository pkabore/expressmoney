<template>
  <header>
    <b-navbar class="is-light" centered>
      <template #brand>
        <b-navbar-item tag="nuxt-link" to="/">Express Money</b-navbar-item>
      </template>

      <template #start>
        <b-navbar-item tag="nuxt-link" to="/">Accueil</b-navbar-item>
        <b-navbar-item tag="nuxt-link" to="/credit">Crédit</b-navbar-item>
        <b-navbar-item tag="nuxt-link" to="/contact">Contact</b-navbar-item>
        <b-navbar-item tag="nuxt-link" to="/about">A propos</b-navbar-item>
      </template>
      <template #end>
        <b-navbar-dropdown v-if="isAuthenticated" :label="account.name" hoverable>
          <b-navbar-item class="has-text-primary" tag="nuxt-link" to="/account">
            <b-icon icon="user"></b-icon>&nbsp; Compte
          </b-navbar-item>
          <b-navbar-item class="has-text-primary" @click.prevent="handleLogout">
            <b-icon icon="sign-out-alt"></b-icon>&nbsp; Déconnection
          </b-navbar-item>
        </b-navbar-dropdown>
        <b-navbar-item v-else tag="div">
          <div class="buttons">
            <b-button
              class="is-small is-primary"
              icon-left="sign-in-alt"
              tag="nuxt-link"
              to="/login"
            >Se connecter</b-button>
            <b-button
              icon-left="user-circle"
              class="is-small is-outlined"
              tag="nuxt-link"
              to="/register"
            >S'inscrire</b-button>
          </div>
        </b-navbar-item>
      </template>
    </b-navbar>
  </header>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    isAuthenticated() {
      return this.$auth.loggedIn;
    },
    account() {
      return this.$auth.user;
    },
  },
  methods: {
    async handleLogout() {
      const csrf = await this.$axios.$get("/api/auth/csrf");
      this.$axios.setHeader("XSRF-TOKEN", csrf.token);
      await this.$auth.logout("cookie");
    },
  },
};
</script>