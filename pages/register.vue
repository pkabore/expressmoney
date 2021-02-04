<template>
  <div>
    <div class="columns is-centered mt-4">
      <div class="column is-one-third-desktop is-half-tablet">
        <b-notification
          v-if="recordSavedNotification"
          type="is-light is-success"
          has-icon
          icon="check"
          aria-close-label="Close notification"
        >Veuillez consulter votre email pour confirmer votre compte.</b-notification>
        <form autocomplete="off" @submit.prevent="handleRegistration" method="POST">
          <h1 class="title has-text-centered has-text-primary">
            <b-icon icon="user" />&nbsp; S'inscrire
          </h1>
          <p class="help is-danger has-text-centered mt-1">{{ error }}</p>
          <div class="columns my-0 is-mobile">
            <div class="column my-0 pr-0 py-0">
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
            <div class="column my-0 pl-0 py-0">
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
              <label class="label help is-black" for="tel">N° de téléphone:</label>
              <input
                class="input"
                id="tel"
                v-model="account.tel"
                type="tel"
                required="required"
                placeholder="70 00 00 00"
                name="tel"
              />
              <label class="label help is-black" for="email">Addresse E-mail:</label>
              <input
                class="input"
                id="email"
                v-model="account.email"
                type="email"
                required="required"
                placeholder="exemple@example.com"
                name="email"
              />
              <label class="label help is-black" for="pass">Choisissez un mot de passe:</label>
              <input
                class="input"
                id="pass"
                v-model="account.pwd"
                type="password"
                required="required"
                placeholder="********"
                name="pwd"
              />
              <label class="label help is-black" for="passC">Confirmez mot de passe:</label>
              <input
                class="input"
                type="password"
                v-model="account.confirmedPWD"
                required="required"
                placeholder="********"
                name="confirmedPWD"
              />
              <button
                :class="['mt-2 button is-fullwidth is-primary is-radiusless', {'is-loading': isLoading}]"
                type="submit"
              >Créer un compte</button>
            </div>
          </div>
          <p class="has-text-centered help is-info">
            <NuxtLink to="/login">Vous avez déjà un compte? Cliquez ici pour vous connecter</NuxtLink>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  head: {
    title: "Création de compte",
    meta: [
      {
        hid: "description",
        name: "description",
        content:
          "Créer un compte pour effectuer vos demandes chez Express Money.",
      },
    ],
  },
  auth: false,
  data() {
    return {
      account: {
        fname: "",
        lname: "",
        tel: "",
        email: "",
        pwd: "",
        confirmedPWD: "",
      },
      error: "",
      recordSavedNotification: false,
      isLoading: false,
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
            "XSRF-TOKEN": csrf.token,
          },
        };
        const response = await this.$axios.$post(
          "/api/auth/register",
          { data: this.account },
          config
        );
        if (response.message) {
          this.recordSavedNotification = true;
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
    },
  },
};
</script>
