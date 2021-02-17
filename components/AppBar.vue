<template>
  <header>
    <b-navbar fixed-top class="is-white" centered>
      <template #brand>
        <b-navbar-item class="has-text-primary" tag="nuxt-link" to="/">Express Money</b-navbar-item>
      </template>

      <template #start>
        <b-navbar-item class="has-text-primary" tag="nuxt-link" to="/">Accueil</b-navbar-item>
        <b-navbar-item class="has-text-primary" tag="nuxt-link" to="/credit">Crédit</b-navbar-item>
        <b-navbar-item class="has-text-primary" tag="nuxt-link" to="/contact">Contact</b-navbar-item>
        <b-navbar-item class="has-text-primary" tag="nuxt-link" to="/about">A propos</b-navbar-item>
      </template>
      <template #end>
        <b-navbar-dropdown
          v-if="isAuthenticated"
          :label="account.name"
          hoverable
          class="has-text-primary"
        >
          <b-navbar-item class="has-text-primary" tag="nuxt-link" to="/account">
            <b-icon icon="user"></b-icon>&nbsp; Compte
          </b-navbar-item>
          <a class="has-text-primary navbar-item" tag="nuxt-link" @click.prevent="handleLogout">
            <b-icon icon="sign-out-alt"></b-icon>&nbsp; Déconnection
          </a>
        </b-navbar-dropdown>
        <b-navbar-item class="has-text-primary" v-if="!isAuthenticated" tag="nuxt-link" to="/login">
          <b-icon pack="fas" icon="sign-in-alt"></b-icon>&nbsp;
          <span>Se connecter</span>
        </b-navbar-item>
        <b-navbar-item
          class="has-text-primary"
          v-if="!isAuthenticated"
          tag="nuxt-link"
          to="/register"
        >
          <b-icon pack="fas" icon="user"></b-icon>&nbsp;
          <span>S'inscrire</span>
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

<style scoped>
.navbar-item:hover {
  color: rgb(0, 0, 95) !important;
}
</style>