<template>
  <v-container class="mt-6 pt-6">
    <v-spacer></v-spacer>
    <v-row align="center" justify="space-around">
      <v-col cols="12" sm="7" md="6" lg="4">
        <h2 class="title center--text">Se connecter</h2>
        <v-form :elevation="1"
      @submit.prevent="handleLogin"
    >
      <p>{{ error }}</p>
      <v-text-field
        v-model="tel"
        label="Numéro de téléphone"
        required
        type="tel"
        class="my-0 pb-0"
      ></v-text-field>
      <v-text-field
        :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
        :type="showPass ? 'text' : 'password'"
        name="pwd"
        label="Mot de passe"
        class="my-0 pt-0"
        value=""
        v-model="pwd"
        @click:append="showPass = !showPass"
      ></v-text-field>
      <template>
      <v-row align="center" justify="space-around">
        <v-btn type="submit" color="primary">
          Se connecter
          <v-icon>mdi-sign-in</v-icon>
        </v-btn>
      </v-row>
      </template>
    </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      tel: "",
      pwd: "",
      showPass: false,
      error: "",
    };
  },
  methods: {
    async handleLogin() {
      try {
        const csrf = await this.$axios.$get("/api/auth/csrf");
        const config = {
          headers: {
            "XSRF-TOKEN": csrf.token,
          },
        };
        this.$axios.setHeader("XSRF-TOKEN", csrf.token);
        await this.$auth.loginWith("cookie", {
          data: { tel: this.tel, pwd: this.pwd },
        });
      } catch (err) {
        this.error = err.response.data.message;
      }
    }
  },
};
</script>
