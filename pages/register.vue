<template>
  <section class="hero is-fullheight">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-6-desktop is-10-tablet">
            <h1 class="title has-text-centered">Créer un compte</h1>
            <form autocomplete="off" @submit.prevent="handleRegistration" method="POST">
              <p class="help is-danger has-text-centered mt-1">{{ error }}</p>
              <div class="columns my-0">
                <div class="column my-0 py-0">
                  <div class="field">
                    <div class="control my-0">
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
                    <div class="control my-0">
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
              <div class="columns my-0">
                <div class="column my-0 py-0">
                  <div class="field">
                    <div class="control my-0">
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
                    </div>
                  </div>
                </div>

                <div class="column my-0 py-0">
                  <div class="field">
                    <div class="control my-0">
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
                    </div>
                  </div>
                </div>
              </div>

              <div class="columns my-0">
                <div class="column my-0 py-0">
                  <div class="field">
                    <div class="control my-0">
                      <label class="label help is-black" for="pass">Créer un mot de passe:</label>
                      <input
                        class="input"
                        id="pass"
                        v-model="account.pwd"
                        type="password"
                        required="required"
                        placeholder="********"
                        name="pwd"
                      />
                    </div>
                  </div>
                </div>

                <div class="column my-0 py-0">
                  <div class="field">
                    <div class="control my-0">
                      <label class="label help is-black" for="passC">Confirmer mot de passe:</label>
                      <input
                        class="input"
                        type="password"
                        v-model="account.confirmedPWD"
                        required="required"
                        placeholder="********"
                        name="confirmedPWD"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <button class="mt-2 button is-fullwidth is-primary" type="submit">
                <!-- <b-icon icon="user" />&nbsp;&nbsp; -->
                Créer un compte
              </button>
              <p class="has-text-centered has-text-grey">
                <NuxtLink to="/login">Se connecter</NuxtLink>
              </p>
            </form>
          </div>
          <b-loading is-full-page v-model="isLoading" :can-cancel="false"></b-loading>
        </div>
      </div>
    </div>
  </section>
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
  auth: "guest",
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
        this.$axios.setHeader("XSRF-TOKEN", csrf.token);
        const response = await this.$axios.$post("/api/auth/register", {
          data: this.account,
        });
        if (response.message) {
          this.isLoading = false;
          const csrfToken = await this.$axios.$get("/api/auth/csrf");
          this.$axios.setHeader("XSRF-TOKEN", csrfToken.token);
          await this.$auth.loginWith("cookie", {
            data: { email: this.account.email, pwd: this.account.pwd },
          });
          this.$buefy.toast.open({
            message:
              "Veuillez consulter votre email pour confirmer votre compte.",
            type: "is-success",
            duration: 5000,
          });
        }
      } catch (err) {
        if (err.response) {
          this.isLoading = false;
          if (
            err.response.data.message.includes("fname") ||
            err.response.data.message.includes("lname")
          )
            this.error = "Veuillez renseigner un Nom et Prénom valide";
          if (err.response.data.message.includes("pwd"))
            this.error = "Veuillez renseignez un mot de passe correct";
          if (err.response.data.message.includes("Numéro"))
            this.error = err.response.data.message;
          console.log(err);
        }
      }
    },
  },
};
</script>
