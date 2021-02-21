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
                      <b-input
                        icon="user"
                        id="fname"
                        v-model="account.fname"
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
                      <b-input
                        icon="user"
                        id="lname"
                        v-model="account.lname"
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
                      <label class="label help is-black" for="telInput">N° de téléphone:</label>
                      <VueTelInput
                        @input="phoneNumberValidation"
                        v-model="account.tel"
                        validCharactersOnly
                        mode="international"
                        id="telInput"
                        class="input telInput"
                        inputClasses="input"
                        placeholder="Numéro de téléphone"
                      ></VueTelInput>
                    </div>
                  </div>
                </div>

                <div class="column my-0 py-0">
                  <div class="field">
                    <div class="control my-0">
                      <label class="label help is-black" for="email">Addresse E-mail:</label>
                      <b-input
                        id="email"
                        v-model="account.email"
                        type="email"
                        placeholder="example@example.com"
                        icon="at"
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
                      <b-input
                        id="pass"
                        v-model="account.pwd"
                        type="password"
                        password-reveal
                        placeholder="********"
                        icon="lock"
                      />
                    </div>
                  </div>
                </div>

                <div class="column my-0 py-0">
                  <div class="field">
                    <div class="control my-0">
                      <label class="label help is-black" for="passC">Confirmer mot de passe:</label>
                      <b-input
                        id="passC"
                        v-model="account.confirmedPWD"
                        type="password"
                        password-reveal
                        placeholder="********"
                        icon="lock"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <button
                :class="['button mt-2 is-fullwidth is-outlined is-primary', {'is-loading': isLoading}]"
                type="submit"
              >Créer un compte</button>
              <p class="has-text-grey help has-text-centered mt-3">
                <NuxtLink to="/login">Se connecter</NuxtLink>&nbsp;·&nbsp;
                <NuxtLink to="/reset">Mot de passe oublié?</NuxtLink>&nbsp;·&nbsp;
                <NuxtLink to="/contact">Besoin d'aide?</NuxtLink>
              </p>
            </form>
          </div>
          <NuxtChild :key="$route.params.id" :email="account.email" />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import "vue-tel-input/dist/vue-tel-input.css";
import { VueTelInput } from "vue-tel-input";

export default {
  components: {
    VueTelInput,
  },
  auth: "guest",
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
      show: false,
      error: "",
      isLoading: false,
      isEmailSent: false,
      canProceed: true,
    };
  },
  methods: {
    phoneNumberValidation(value, payload) {
      if (!payload.valid) {
        this.canProceed = false;
        return;
      } else this.canProceed = true;
    },
    async handleRegistration() {
      if (this.canProceed === false) {
        this.error = "Numéro de téléphone incorrect.";
        return;
      }
      this.isLoading = true;
      if (
        this.account.fname === "" ||
        this.account.lname === "" ||
        this.account.tel === "" ||
        this.account.email === "" ||
        this.account.pwd === "" ||
        this.account.confirmedPWD === ""
      ) {
        this.error = "Veuillez renseigner touts les champs";
        this.isLoading = false;
        return;
      }
      try {
        this.$loading = true;
        if (this.account.pwd !== this.account.confirmedPWD) {
          this.error = "Mots de passe différents";
          this.isLoading = false;
          return;
        }
        const email = this.account.email;
        const csrf = await this.$axios.$get("/api/auth/csrf");
        this.$axios.setHeader("XSRF-TOKEN", csrf.token);
        const response = await this.$axios.$post(
          "/api/auth/register",
          this.account
        );
        if (response.message) {
          this.isLoading = false;
          this.$store.state.email = email;
          this.$router.push("/confirmation");
        }
      } catch (err) {
        if (err.response) {
          this.isLoading = false;
          if (!err.response.data) {
            this.error = "Erreur survenue. Veuillez reéssayer";
            return;
          }
          if (
            err.response.data.message.includes("fname") ||
            err.response.data.message.includes("lname")
          )
            this.error = "Veuillez renseigner un Nom et Prénom valide";
          if (err.response.data.message.includes("pwd"))
            this.error = "Veuillez renseignez un mot de passe correct";
          if (err.response.data.message.includes("Numéro"))
            this.error = err.response.data.message;
          else this.error = err.response.data.message;
        }
      }
    },
  },
};
</script>

<style>
</style>