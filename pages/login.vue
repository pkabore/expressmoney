<template>
  <div>
    <div class="columns is-centered mt-6">
      <div class="column is-half-tablet is-one-third-desktop box">
        <h2 class="has-text-centered title has-text-primary mb-3">
          <font-awesome-icon
            class="is-small"
            :icon="['fas', 'sign-in-alt']"
          />&nbsp; Se connecter
        </h2>
        <form @submit.prevent="handleLogin">
          <p class="help has-text-centered is-danger">{{ error }}</p>
          <div class="field">
            <label class="label help" for="tel">Numéro de téléphone</label>
            <input v-model="tel" id="tel" class="input" type="tel" />
          </div>
          <div class="field mt-0">
            <label class="label help" for="pass">Mot de passe</label>
            <input v-model="pwd" id="pass" class="input" type="password" />
          </div>
          <div class="has-text-centered">
            <button class="button is-primary" type="submit">
              Se connecter
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tel: "",
      pwd: "",
      showPass: false,
      error: ""
    };
  },
  methods: {
    async handleLogin() {
      try {
        const csrf = await this.$axios.$get("/api/auth/csrf");
        const config = {
          headers: {
            "XSRF-TOKEN": csrf.token
          }
        };
        this.$axios.setHeader("XSRF-TOKEN", csrf.token);
        await this.$auth.loginWith("cookie", {
          data: { tel: this.tel, pwd: this.pwd }
        });
      } catch (err) {
        this.error = err.response.data.message;
      }
    }
  }
};
</script>
