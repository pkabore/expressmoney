<template>
  <div class="columns is-centered mt-6">
    <div class="column is-two-thirds-tablet is-half-desktop box mt-6">
      <h2 class="has-text-centered title has-text-primary mb-3">
        <b-icon pack="fas" icon="sign-in-alt" size="is-medium" />&nbsp; Se connecter
      </h2>
      <form autocomplete="off" @submit.prevent="handleLogin">
        <p class="help has-text-centered is-danger">{{ error }}</p>
        <div class="field my-0">
          <label class="label help" for="email">Numéro de téléphone / Email</label>
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
          <button
            :class="['button mt-2 is-fullwidth is-radiusless is-primary', {'is-loading': isLoading}]"
            type="submit"
          >Se connecter</button>
        </div>
        <p class="has-text-centered help">
          <NuxtLink to="/register">Première visite? Créer un compte</NuxtLink>
        </p>
        <p class="has-text-centered help is-dark">
          <NuxtLink to="/reset" class>Mot de passe oublié?</NuxtLink>
        </p>
      </form>
    </div>
  </div>
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
