<template>
<div>
  <section class="section">
  <div class="columns is-centered mt-4">
    <div class="column is-one-third-desktop is-half-tablet">
      <form autocomplete="off" @submit.prevent="handleRegistration" method="POST">
        <h2 class="title has-text-centered has-text-primary">
          <b-icon size="is-small" icon="account-circle"/>&nbsp; S'inscrire
        </h2>
        <p class="help is-danger has-text-centered mt-1">{{ error }}</p>
        <div class="columns my-0 is-mobile">
          <div class="column my-0 py-0">
            <div class="field">
              <div class="control mx-1 my-0">
                <label class="label help is-black" for="fname">Prénom:</label>
                <input
                  class="input"
                  id="fname"
                  type="text"
                  v-model="account.fname"
                  required="required"
                  placeholder="Prénom"
                  name="fname"
                />
              </div>
            </div>
          </div>
          <div class="column my-0 py-0">
            <div class="field">
              <div class="control mx-1 my-0">
                <label class="label help is-black" for="lname">Nom:</label>
                <input
                  class="input"
                  id="lname"
                  type="text"
                  v-model="account.lname"
                  required="required"
                  placeholder="Nom"
                  name="lname"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="field my-0">
          <div class="control mx-1">
            <label class="label help is-black" for="tel"
              >N° de téléphone:</label
            >
            <input
              class="input"
              id="tel"
              v-model="account.tel"
              type="tel"
              required="required"
              placeholder="Numéro de téléphone"
              name="tel"
            />
            <label class="label help is-black" for="pass"
              >Choisissez un mot de passe:</label
            >
            <input
              class="input"
              id="pass"
              v-model="account.pwd"
              type="password"
              required="required"
              placeholder="Mot de passe"
              name="pwd"
            />
            <label class="label help is-black" for="passC"
              >Confirmez mot de passe:</label
            >
            <input
              class="input"
              type="password"
              v-model="account.confirmedPWD"
              required="required"
              placeholder="Confirmez mot de passe"
              name="confirmedPWD"
            />
            <button :class="['mt-2 button is-fullwidth is-primary', {'is-loading': isLoading}]" type="submit">
              Créer un compte
            </button>
          </div>
        </div>
        <p class="has-text-centered help is-info">
          <NuxtLink to="/login"
            >Vous avez déjà un compte? Cliquez ici pour vous connecter</NuxtLink
          >
        </p>
      </form>
    </div>
  </div>
  </section>
  </div>
</template>

<script>
export default {
  head:{
  title : "Création de compte",
  meta: [
    { hid: 'description', name: 'description', content: "Créer un compte pour effectuer vos demandes chez Express Money." }
  ]
},
  auth: false,
  data() {
    return {
      account: {
        fname: "",
        lname: "",
        tel: "",
        pwd: "",
        confirmedPWD: ""
      },
      error: "",
      isLoading: false
    };
  },
  methods: {
    async handleRegistration() {
      this.isLoading = true;
      try {
        this.$loading = true;
        if (this.account.pwd !== this.account.confirmedPWD) {
          this.error = "Mots de passe différents";
          this.isLoading = false;
          return;
        }
        const csrf = await this.$axios.$get("/api/auth/csrf");
        const config = {
          headers: {
            "XSRF-TOKEN": csrf.token
          }
        };
        const response = await this.$axios.$post(
          "/api/auth/register",
          { data: this.account },
          config
        );
        if (response.message) {
          try {
            const credentials = {
              tel: this.account.tel,
              pwd: this.account.pwd
            };
            await this.$auth.loginWith("cookie", { data: credentials });
            this.$router.push('/operations');
          } catch (err) {
            this.error = err.message;
            this.isLoading = false;
          }
        }
      } catch (err) {
        if (err.response) {
          this.isLoading = false;
          if (
            err.response.data.err.includes("fname") ||
            err.response.data.err.includes("lname")
          )
            this.error = "Veuillez renseigner un Nom et Prénom valide";
          if (err.response.data.err.includes("pwd"))
            this.error = "Veuillez renseignez un mot de passe correct";
          if (err.response.data.err.includes("Numéro"))
            this.error = err.response.data.err;
        }
      }
    }
  }
};
</script>
