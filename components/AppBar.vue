<template>
  <header>
    <b-navbar centered class="is-primary">
      <template #brand>
        <b-navbar-item tag="nuxt-link" to="/">
          <!-- <img
            src="../static/logo-white.svg"
            alt="Demander du crédit, c'est simple et rapide avec Express Money"
          > -->
          Express Money
        </b-navbar-item>
      </template>
      <template #start>
        <NuxtLink class="navbar-item mt-0" to="/">Accueil</NuxtLink>
        <NuxtLink class="navbar-item" to="/operations">Crédit</NuxtLink>
        <NuxtLink class="navbar-item" to="/contact">Contact</NuxtLink>
        <NuxtLink class="navbar-item" to="/about">A propos </NuxtLink>
      </template>
      <template #end>
        <NuxtLink v-if="isAuthenticated" to="/account" class="navbar-item">
          <b-icon icon="account-circle"></b-icon> &nbsp;
          <span>{{ account.name }}</span>
        </NuxtLink>
        <a
          v-if="isAuthenticated"
          class="navbar-item"
          to="#"
          @click.prevent="handleLogout"
          ><b-icon icon="power"></b-icon> &nbsp;<span
            >Se déconnecter</span
          ></a
        >
        <NuxtLink v-if="!isAuthenticated" class="navbar-item" to="/login">
          <b-icon icon="lock"></b-icon>&nbsp;<span
            >Se connecter</span
          >
        </NuxtLink>
        <NuxtLink v-if="!isAuthenticated" class="navbar-item" to="/register">
          <b-icon icon="account-circle"></b-icon>&nbsp;<span
            >S'inscrire</span
          >
        </NuxtLink>
      </template>
    </b-navbar>
  </header>
</template>

<script>
export default {
  computed: {
    isAuthenticated() {
      return this.$auth.loggedIn;
    },
    account() {
      return this.$auth.user;
    }
  },
  methods: {
    async handleLogout() {
      const csrf = await this.$axios.$get("/api/auth/csrf");
      this.$axios.setHeader("XSRF-TOKEN", csrf.token);
      await this.$auth.logout("cookie");
    }
  }
};
</script>

<style scoped>
  div.navbar-menu.is-active{
    padding-top: 0px !important;
    margin-top: 0px !important;
  }
</style>