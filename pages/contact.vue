<template>
  <div class="container">
    <div class="columns is-centered">
      <div class="column is-two-thirds-desktop is-four-fiths-tablet">
        <section class="box mt-6">
          <h1 class="title has-text-centered">Nous contacter</h1>
          <form action="POST" @submit.prevent="sendMail()">
            <p class="help has-text-centered is-danger">{{ error }}</p>
            <div class="field my-0">
              <label class="label help" for="sujbect">Sujet:</label>
              <input
                id="sujbect"
                v-model="email.subject"
                class="input"
                type="text"
                placeholder="Express Money, Service client"
              />
            </div>
            <div class="field my-0">
              <label class="label help" for="mail">Adresse email:</label>
              <input
                v-model="email.email"
                id="mail"
                class="input"
                type="email"
                placeholder="Express Money, Service client"
              />
            </div>
            <div class="field my-0">
              <label class="label help" for="msg">Message:</label>
              <textarea v-model="email.message" id="msg" class="textarea"></textarea>
              <button class="button mt-2 is-fullwidth is-info" type="submit">
                <b-icon icon="envelope" />&nbsp;&nbsp; Envoyer le message
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  head: {
    title: "Contact",
    meta: [
      {
        hid: "description",
        name: "description",
        content:
          "Express Money - Contactez nous. Notre équipe est toujours à l'écoute.",
      },
    ],
  },
  auth: false,
  data() {
    return {
      email: {
        subject: "",
        email: "",
        message: "",
      },
      error: "",
    };
  },
  methods: {
    async sendMail() {
      if (
        this.email.subject === "" ||
        this.email.email === "" ||
        this.email.message === ""
      ) {
        this.error = "Veuillez remplir touts les champs necéssaires.";
        return;
      }
      try {
        const csrf = await this.$axios.$get("/api/auth/csrf");
        this.$axios.setHeader("XSRF-TOKEN", csrf.token);
        await this.$axios.$post("/api/auth/email", this.email);
        this.$buefy.toast.open({
          type: "is-success",
          position: "is-top-right",
          size: "is-large",
          message: "Email envoyé avec succès.",
          duration: 5000,
        });
        this.emailModal = false;
        this.email = {};
      } catch (err) {
        this.error = err.response.data.message;
      }
    },
  },
};
</script>