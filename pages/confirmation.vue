<template>
  <section class="hero is-fullheight">
    <div class="hero-body mt-0 pt-0">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-6-desktop is-8-tablet">
            <h1
              class="title has-text-dark has-text-centered mb-0 is-family-secondary"
            >Vérification requise</h1>
            <div class="block has-text-centered mt-6">
              <h2 class="subtitle has-text-success is-family-secondary">
                Email envoyé avec succès &nbsp;
                <b-icon icon="check"></b-icon>
              </h2>
              <hr />
              <h2 class="text-centered subtitle has-text-secondary">
                {{ email }} &nbsp;
                <b-icon icon="envelope"></b-icon>
              </h2>
              <p class="help is-danger">{{error}}</p>
              <p class="mt-2">
                Pour vérifier que votre email est bien le vôtre, nous vous avons envoyé un lien par email.
                Veuillez consulter votre boite de reception email et cliquer sur le lien envoyé pour vérifier votre compte.
              </p>
            </div>
            <hr />
            <div class="block has-text-centered">
              <p class="help">
                Vous n'avez pas reçu d'email?
                <span v-if="!isLoading && !isSent">
                  <a @click="resendEmail" class="has-text-link">Renvoyer le lien</a>
                </span>
                <span v-else-if="isSent" class="has-text-success">&nbsp;Email envoyé!</span>
                <span v-else class="has-text-dark">...</span>
              </p>
            </div>
            <hr />
            <div class="block has-text-centered">
              <p class="help">
                <NuxtLink class="has-text-link" to="/contact">Contacter le service client</NuxtLink>&nbsp;si vous avez des difficultés
              </p>
              <p class="help">
                Express Money -
                <NuxtLink class="has-text-link" to="/">&nbsp;Accueil</NuxtLink>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  layout: "empty",
  auth: false,
  head: {
    title: "Email envoyé",
    meta: [
      {
        hid: "description",
        name: "description",
        content: "Vérification de votre compte Express Money.",
      },
    ],
  },
  data() {
    return {
      error: "",
      isLoading: false,
      isSent: false,
    };
  },
  methods: {
    async resendEmail() {
      this.isLoading = true;
      try {
        const csrf = await this.$axios.$get("/api/auth/csrf");
        this.$axios.setHeader("XSRF-TOKEN", csrf.token);
        await this.$axios.$post("/api/auth/emailchange", {
          email: this.email,
        });
        this.isSent = true;
        this.isLoading = false;
        setInterval(() => {
          this.isSent = false;
        }, 5000);
      } catch (err) {
        this.isLoading = false;
        if (err.response.data) this.error = err.response.data.message;
        else this.error = "Erreur technique survenue! Veuillez reéssayer.";
      }
    },
  },
  computed: {
    email() {
      return this.$store.state.email;
    },
  },
};
</script>