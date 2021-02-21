<template>
  <div>
    <AppBar />
    <main class="pt-3">
      <div class="columns mt-6 is-flex is-align-content-strecth is-justify-content-center">
        <div class="column pr-0 is-2 has-background-light is-align-self-stretch">
          <ul>
            <li>
              <b-button
                type="is-outlined"
                class="is-block is-fullwidth has-text-left"
                icon-left="user-circle"
                tag="nuxt-link"
                to="/account/profile"
              >Profile</b-button>
            </li>
            <li>
              <b-button
                tag="nuxt-link"
                type="is-outlined"
                class="is-block is-fullwidth has-text-left"
                icon-left="pen"
                to="/account/complete"
              >Dossier</b-button>
            </li>
            <li>
              <b-button
                type="is-outlined"
                class="is-block is-fullwidth has-text-left"
                icon-left="user-shield"
                tag="nuxt-link"
                to="/account/security"
              >Sécurité</b-button>
            </li>
            <li>
              <b-button
                type="is-outlined is-dark"
                class="is-block is-fullwidth has-text-left"
                icon-left="sign-out-alt"
                @click="handleLogout()"
              >Déconnecter</b-button>
            </li>
          </ul>
        </div>
        <div class="column is-10 py-0">
          <Nuxt />
        </div>
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<script>
export default {
  layout: "default",
  data() {
    return {
      expandOnHover: false,
      mobile: "reduce",
      reduce: false,
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

<style lang="scss">
</style>