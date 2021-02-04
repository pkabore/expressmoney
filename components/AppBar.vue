<template>
  <header>
    <b-navbar centered class="is-primary" :shadow="false">
      <template #brand>
        <b-navbar-item tag="nuxt-link" to="/">Express Money</b-navbar-item>
      </template>
      <template #start class="has-background-primary">
        <b-navbar-item tag="nuxt-link" to="/">Accueil</b-navbar-item>
        <b-navbar-item tag="nuxt-link" to="/operations">Crédit</b-navbar-item>
        <b-navbar-item tag="nuxt-link" to="/contact">Contact</b-navbar-item>
        <b-navbar-item tag="nuxt-link" to="/about">A propos</b-navbar-item>
      </template>
      <template #end class="has-background-primary">
        <b-navbar-item v-if="isAuthenticated" to="/account" tag="nuxt-link">
          <b-icon icon="user"></b-icon>&nbsp;
          <span>{{ account.name }}</span>
        </b-navbar-item>
        <b-navbar-item v-if="isAuthenticated" tag="nuxt-link" to="#" @click.prevent="handleLogout">
          <b-icon icon="sign-out-alt" pack="fas"></b-icon>&nbsp;
          <span>Se déconnecter</span>
        </b-navbar-item>
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
    return {
      isHomePage: this.$route.path === "/",
    };
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
div.navbar-menu.is-active {
  padding-top: 0px !important;
  margin-top: 0px !important;
}
</style>