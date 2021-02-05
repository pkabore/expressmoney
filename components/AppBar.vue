<template>
  <header>
    <b-navbar centered class="is-primary" :shadow="false">
      <template #brand>
        <b-navbar-item tag="nuxt-link" to="/">Express Money</b-navbar-item>
      </template>
      <template #start>
        <b-navbar-item tag="nuxt-link" to="/">Accueil</b-navbar-item>
        <b-navbar-item tag="nuxt-link" to="/operations">Crédit</b-navbar-item>
        <b-navbar-item tag="nuxt-link" to="/contact">Contact</b-navbar-item>
        <b-navbar-item tag="nuxt-link" to="/about">A propos</b-navbar-item>
      </template>
      <template #end>
        <b-navbar-item v-if="isAuthenticated" to="/account" tag="nuxt-link">
          <b-icon icon="user"></b-icon>&nbsp;
          <span>{{ account.name }}</span>
        </b-navbar-item>
        <a v-if="isAuthenticated" class="navbar-item" href="#" @click.prevent="modal = true">
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
    <div :class="['modal', {'is-active': modal}]">
      <div class="modal-background"></div>
      <div class="card">
        <header class="card-header is-centered">
          <p class="card-header-title has-text-centered">Confirmation</p>
        </header>
        <section class="card-content">
          <h2 class="subtitle has-text-centered">Se déconnecter ?</h2>
        </section>
        <footer class="card-footer">
          <a href="#" class="card-footer-item has-text-info" @click.prevent="modal = false">
            <b-icon icon="close"></b-icon>&nbsp; Non
          </a>
          <a href="#" class="card-footer-item has-text-danger" @click.prevent="handleLogout()">
            Oui, Se déconnecter &nbsp;
            <b-icon icon="arrow-right"></b-icon>
          </a>
        </footer>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  data() {
    return {
      isHomePage: this.$route.path === "/",
      modal: false,
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
      this.modal = false;
      const csrf = await this.$axios.$get("/api/auth/csrf");
      this.$axios.setHeader("XSRF-TOKEN", csrf.token);
      await this.$auth.logout("cookie");
    },
  },
};
</script>