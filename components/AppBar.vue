<template>
  <header>
    <b-navbar centered class="is-transparent">
      <template #brand>
        <b-navbar-item tag="router-link" :to="{ path: '/' }">
          <img
            src="../static/logo.svg"
            alt="Demander du crédit, c'est simple et rapide avec Express Money"
          >
          Express Money
        </b-navbar-item>
      </template>
      <template #start>
        <NuxtLink class="navbar-item mt-0" to="/">Accueil</NuxtLink>
        <NuxtLink class="navbar-item" to="/operations">Crédit</NuxtLink>
        <NuxtLink class="navbar-item" to="/contact">Contact</NuxtLink>
        <NuxtLink class="navbar-item" to="/about">À propos </NuxtLink>
      </template>
      <template #end>
        <NuxtLink v-if="isAuthenticated" to="/account" class="navbar-item">
          <font-awesome-icon :icon="['fas', 'user-circle']" />&nbsp;
          <span>{{ account.name }}</span>
        </NuxtLink>
        <a
          v-if="isAuthenticated"
          class="navbar-item"
          to="#"
          @click.prevent="handleLogout"
          ><font-awesome-icon :icon="['fas', 'sign-out-alt']" />&nbsp;<span
            >Se déconnecter</span
          ></a
        >
        <NuxtLink v-if="!isAuthenticated" class="navbar-item" to="/login">
          <font-awesome-icon :icon="['fas', 'sign-in-alt']" />&nbsp;<span
            >Se connecter</span
          >
        </NuxtLink>
        <NuxtLink v-if="!isAuthenticated" class="navbar-item" to="/register">
          <font-awesome-icon :icon="['fas', 'user-circle']" />&nbsp;<span
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
      const config = {
        headers: {
          "XSRF-TOKEN": csrf.token
        }
      };
      this.$axios.setHeader("XSRF-TOKEN", csrf.token);
      await this.$auth.logout("cookie");
    }
  }
};
</script>
