<template>
    <section class="section">
    <div class="columns is-centered mt-6">
      <div class="column is-half-tablet is-one-third-desktop box">
        <h2 class="has-text-centered title has-text-primary mb-3">Mot de passe oublié</h2>
        <form @submit.prevent="handleReset">
          <p class="help has-text-centered is-danger">{{ error }}</p>
          <div class="field">
            <label class="label help" for="tel">Veuillez entrer votre numéro de téléphone:</label>
            <input v-model="tel" id="tel" class="input" type="tel" />
          </div>
          <div class="has-text-centered">
            <button class="button is-primary" type="submit">
              Envoyer un code de confirmation
            </button>
          </div>
        </form>
      </div>
    </div>
    </section>
</template>

<script>
export default {
    auth: false,
    data() {
        return {
            tel: "",
            error: ""
        };
    },
  methods: {
    async handleReset() {
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
