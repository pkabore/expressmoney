<template>
  <section class="section">
    <div class="columns is-centered mt-6">
      <div class="column is-two-thirds-tablet is-half-desktop">
        <h2 class="has-text-centered title has-text-primary mb-3">Mot de passe oublié</h2>
        <p class="help has-text-centered is-danger">{{ error }}</p>
        <div class="field" v-if="activeForm === 'email'">
          <label class="label help" for="email">Address e-mail:</label>
          <b-input
            v-model="email"
            icon="at"
            id="email"
            type="email"
            placeholder="exemple@exemple.com"
          />
          <b-button
            @click="sendEmail"
            class="mt-2 is-fullwidth is-primary is-outlined"
            type="submit"
          >M'envoyer un code de récupération</b-button>
          <p class="mt-2 help has-text-centered">
            <NuxtLink to="/login">Se connecter</NuxtLink>&nbsp;·&nbsp;
            <NuxtLink to="/register">Créer un compte</NuxtLink>&nbsp;·&nbsp;
            <NuxtLink to="/contact">Besoin d'aide?</NuxtLink>
          </p>
        </div>
        <div class="field" v-if="activeForm === 'code'">
          <label class="label help" for="code">
            Veuillez entrer le code envoyé au:
            <span class="has-text-success">{{email}}</span>
          </label>
          <b-input v-model="code" id="code" type="text" />
          <button
            @click="sendCode"
            class="button mt-2 is-fullwidth is-primary"
            type="submit"
          >Envoyer</button>
        </div>
        <div class="field" v-if="activeForm === 'pass'">
          <b-field label="Créer un nouveau mot de passe:" class="help">
            <b-input
              icon="lock"
              v-model="pwd"
              id="pass"
              type="password"
              placeholder="********"
              password-reveal
            />
          </b-field>
          <b-field label="Confirmer le mot de passe:" class="help">
            <b-input
              icon="lock"
              v-model="confirmedPWD"
              id="confirmedPWD"
              type="password"
              placeholder="********"
              password-reveal
            />
          </b-field>
          <button
            @click="sendPass"
            class="button mt-2 is-fullwidth is-primary"
            type="submit"
          >Changer mon mot de passe</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  auth: "guest",
  data() {
    return {
      email: "",
      pwd: "",
      confirmedPWD: "",
      code: "",
      error: "",
      activeForm: "email",
    };
  },
  methods: {
    async sendEmail() {
      if (this.email === "") {
        this.error = "Veuillez entrer votre email";
        return;
      }
      try {
        const csrf = await this.$axios.$get("/api/auth/csrf");
        this.$axios.setHeader("XSRF-TOKEN", csrf.token);
        const result = await this.$axios.$post("/api/auth/resetemail", {
          email: this.email,
        });
        if (result.message) {
          this.activeForm = "code";
          this.$buefy.snackbar.open({
            message:
              "Code envoyé avec success. Veuillez consulter votre boite de reception mail",
            type: "is-success",
            indefinite: true,
            queue: false,
            position: "is-top-right",
            actionText: "Fermer",
          });
        }
      } catch (err) {
        if (!err.response.data) {
          this.error = "Erreur survenue, veuillez reésayer";
        } else this.error = err.response.data.message;
      }
    },
    async sendCode() {
      try {
        const csrf = await this.$axios.$get("/api/auth/csrf");
        this.$axios.setHeader("XSRF-TOKEN", csrf.token);
        const res = await this.$axios.$post("/api/auth/resetcode", {
          code: this.code.trim(),
          email: this.email,
        });
        if (res.message) {
          this.activeForm = "pass";
        }
      } catch (err) {
        if (!err.response.data) {
          this.error = "Erreur survenue, veuillez reésayer";
        } else this.error = err.response.data.message;
      }
    },
    async sendPass() {
      if (this.pwd !== this.confirmedPWD) {
        this.error = "Mots de passe différents.";
        return;
      }
      try {
        const csrf = await this.$axios.$get("/api/auth/csrf");
        this.$axios.setHeader("XSRF-TOKEN", csrf.token);
        const res = await this.$axios.$post("/api/auth/resetpass", {
          pwd: this.pwd,
          confirmedPWD: this.confirmedPWD,
          email: this.email,
        });
        if (res.message) {
          const csrf = await this.$axios.$get("/api/auth/csrf");
          this.$axios.setHeader("XSRF-TOKEN", csrf.token);
          await this.$auth.loginWith("cookie", {
            data: { email: this.email, pwd: this.pwd },
          });
          await this.$auth.fetchUser();
          this.$router.push("/credit");
        }
      } catch (err) {
        if (!err.response.data) {
          this.error = "Erreur survenue, veuillez reésayer";
        } else this.error = err.response.data.message;
      }
    },
  },
};
</script>
