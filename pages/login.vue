<template>
  <section class="hero is-fullheight">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-6-desktop is-8-tablet">
            <h3 class="title has-text-black has-text-centered mb-0">Connection</h3>
            <p
              class="has-text-black help has-text-centered mb-4"
            >Veuillez-vous identifier pour continuer.</p>
            <form autocomplete="off" @submit.prevent="handleLogin">
              <p class="help has-text-centered is-danger">{{ error }}</p>
              <div class="field my-0">
                <label class="label help" for="email">Numéro de téléphone ou Email</label>
                <input
                  v-model="email"
                  id="email"
                  class="input"
                  type="text"
                  placeholder="exemple@exemple.com"
                />
              </div>
              <div class="field my-0">
                <label class="label help" for="pass">Mot de passe</label>
                <input v-model="pwd" id="pass" class="input" type="password" placeholder="********" />
                <button class="button mt-2 is-fullwidth is-primary" type="submit">Se connecter</button>
              </div>
            </form>
            <p class="has-text-grey help has-text-centered">
              <NuxtLink to="/register">Créer un compte</NuxtLink>&nbsp;·&nbsp;
              <NuxtLink to="/reset">Mot de passe oublié?</NuxtLink>&nbsp;·&nbsp;
              <NuxtLink to="/contact">Besoin d'aide?</NuxtLink>
            </p>
          </div>
          <b-loading is-full-page v-model="isLoading" :can-cancel="false"></b-loading>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  auth: "guest",
  head: {
    title: "Connection",
    meta: [
      {
        hid: "description",
        name: "description",
        content:
          "Connectez-vous à votre compte pour effectuer votre demande chez Express Money.",
      },
    ],
  },
  data() {
    return {
      email: "",
      pwd: "",
      showPass: false,
      error: "",
      isLoading: false,
    };
  },
  methods: {
    async handleLogin() {
      this.isLoading = true;
      try {
        const csrf = await this.$axios.$get("/api/auth/csrf");
        this.$axios.setHeader("XSRF-TOKEN", csrf.token);
        await this.$auth.loginWith("cookie", {
          data: { email: this.email, pwd: this.pwd },
        });
      } catch (err) {
        this.isLoading = false;
        this.error = err.response.data.message;
      }
    },
  },
};
</script>
