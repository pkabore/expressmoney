<template>
  <header>
    <b-navbar fixed-top centered class="is-transparent" :shadow="false">
      <template #brand>
        <b-navbar-item tag="nuxt-link" to="/">Express Money</b-navbar-item>
      </template>
      <template #end>
        <b-navbar-item tag="nuxt-link" to="/credit">Crédit</b-navbar-item>
        <b-navbar-item tag="nuxt-link" to="/contact">Contact</b-navbar-item>
        <b-navbar-item tag="nuxt-link" to="/about">A propos</b-navbar-item>
        <b-navbar-item v-if="isAuthenticated" to="/account" tag="nuxt-link">
          <b-icon icon="user"></b-icon>&nbsp;
          <span>{{ account.name }}</span>
        </b-navbar-item>
        <a v-if="isAuthenticated" class="navbar-item" href="#" @click.prevent="handleLogout()">
          <b-icon icon="sign-out-alt" pack="fas"></b-icon>&nbsp;
          <span>Se déconnecter</span>
        </a>
        <b-navbar-item v-if="!isAuthenticated" tag="nuxt-link" to="/login">
          <b-icon pack="fas" icon="sign-in-alt"></b-icon>&nbsp;
          <span>Se connecter</span>
        </b-navbar-item>
        <b-navbar-item v-if="!isAuthenticated" tag="nuxt-link" to="/register">
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
</style>