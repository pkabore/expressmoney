<template>
  <header>
    <b-navbar fixed-top class="is-dark" centered>
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
        <b-navbar-dropdown v-if="isAuthenticated" :label="account.name" hoverable class>
          <b-navbar-item class="has-text-primary" tag="nuxt-link" to="/account">
            <b-icon icon="user"></b-icon>&nbsp; Compte
          </b-navbar-item>
          <a class="has-text-primary navbar-item" tag="nuxt-link" @click.prevent="handleLogout">
            <b-icon icon="sign-out-alt"></b-icon>&nbsp; Déconnection
          </a>
        </b-navbar-dropdown>
        <div v-else class="navbar-item">
          <div class="buttons">
            <b-button
              type="is-primary"
              icon-left="sign-in-alt"
              tag="nuxt-link"
              to="/login"
            >Se connecter</b-button>
            <b-button
              icon-left="user-circle"
              class="is-outlined"
              tag="nuxt-link"
              to="/register"
            >S'inscrire</b-button>
          </div>
        </div>
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