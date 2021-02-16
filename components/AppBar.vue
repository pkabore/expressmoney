<template>
  <header>
    <b-navbar fixed-top type="is-white" centered>
      <template #brand>
        <b-navbar-item class="has-text-primary" tag="nuxt-link" to="/">Express Money</b-navbar-item>
      </template>
      <template #end>
        <b-navbar-item class="has-text-primary" tag="nuxt-link" to="/">Accueil</b-navbar-item>
        <b-navbar-item class="has-text-primary" tag="nuxt-link" to="/credit">Crédit</b-navbar-item>
        <b-navbar-item class="has-text-primary" tag="nuxt-link" to="/contact">Contact</b-navbar-item>
        <b-navbar-item class="has-text-primary" tag="nuxt-link" to="/about">A propos</b-navbar-item>
        <b-navbar-item
          class="has-text-primary"
          v-if="isAuthenticated"
          to="/account"
          tag="nuxt-link"
        >
          <b-icon icon="user"></b-icon>&nbsp;
          <span>{{ account.name }}</span>
        </b-navbar-item>
        <a
          v-if="isAuthenticated"
          class="navbar-item has-text-primary"
          href="#"
          @click.prevent="handleLogout()"
        >
          <b-icon icon="sign-out-alt" pack="fas"></b-icon>&nbsp;
          <span>Se déconnecter</span>
        </a>
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