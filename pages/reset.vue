<template>
  <section class="section">
    <div class="columns is-centered">
      <div class="column is-two-thirds-tablet is-half-desktop">
        <h2 class="has-text-centered title has-text-primary mb-3">Mot de passe oublié</h2>
        <p class="help has-text-centered is-danger">{{ error }}</p>
        <b-notification
          v-if="activeForm === 'code'"
          type="is-light is-success"
          has-icon
          icon="check"
          aria-close-label="Close notification"
        >Code envoyé avec success. Veuillez consulter votre boite de reception mail.</b-notification>
        <div class="field" v-if="activeForm === 'email'">
          <label class="label help" for="email">Address e-mail:</label>
          <input
            v-model="email"
            id="email"
            class="input"
            type="email"
            placeholder="exemple@exemple.com"
          />
          <button
            @click="sendEmail"
            class="button mt-2 is-fullwidth is-primary"
            type="submit"
          >M'envoyer un code de récupération</button>
        </div>
        <div class="field" v-if="activeForm === 'code'">
          <label class="label help" for="code">Veuillez entrer le code reçu:</label>
          <input v-model="code" id="code" class="input" type="text" />
          <button
            @click="sendCode"
            class="button mt-2 is-fullwidth is-primary"
            type="submit"
          >Envoyer</button>
        </div>
        <div class="field" v-if="activeForm === 'pass'">
          <label class="label help" for="pass">Créer un nouveau mot de passe:</label>
          <input v-model="pwd" id="pass" class="input" type="password" placeholder="********" />
          <label class="label help" for="confirmedPWD">Confirmer le mot de passe choisi:</label>
          <input
            v-model="confirmedPWD"
            id="confirmedPWD"
            class="input"
            type="password"
            placeholder="********"
          />
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
          data: { email: this.email },
        });
        if (result.message) {
          this.activeForm = "code";
        }
      } catch (err) {
        this.error = err.response.data.message;
      }
    },
    async sendCode() {
      try {
        const csrf = await this.$axios.$get("/api/auth/csrf");
        this.$axios.setHeader("XSRF-TOKEN", csrf.token);
        const res = await this.$axios.$post("/api/auth/resetcode", {
          data: { code: this.code.trim() },
        });
        if (res.message) {
          this.activeForm = "pass";
        }
      } catch (err) {
        this.error = err.response.data.message;
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
          data: {
            pwd: this.pwd,
            confirmedPWD: this.confirmedPWD,
            email: this.email,
          },
        });
        if (res.message) {
          const csrf = await this.$axios.$get("/api/auth/csrf");
          this.$axios.setHeader("XSRF-TOKEN", csrf.token);
          await this.$auth.loginWith("cookie", {
            data: { email: this.email, pwd: this.pwd },
          });
          await this.$auth.fetchUser();
          this.$router.push("/operations");
        }
      } catch (err) {
        this.error = err.response.data.message;
      }
    },
  },
};
</script>
