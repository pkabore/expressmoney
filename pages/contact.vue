<template>
  <section class="hero is-fullheight">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-6-desktop is-8-tablet">
            <b-message
              type="is-success"
              v-model="isMessageSent"
              aria-close-label="Fermer la notification"
            >Message envoyé avec succès</b-message>
            <h1 class="title has-text-centered">
              <b-icon icon="pen" class="circular-sui" size="is-large"></b-icon>&nbsp;Nous écrire
            </h1>
            <form action="POST" @submit.prevent="sendMail()">
              <p class="help has-text-centered is-danger">{{ error }}</p>
              <div class="field mt-1 mb-0">
                <b-input
                  label="Sujet"
                  class="is-link"
                  id="sujbect"
                  icon="tag"
                  v-model="email.subject"
                  type="text"
                  placeholder="Sujet"
                />
              </div>
              <div class="field mt-1 mb-0">
                <b-input
                  label="Email"
                  class="is-link"
                  icon="at"
                  v-model="email.email"
                  id="mail"
                  type="email"
                  placeholder="Votre adresse email"
                />
              </div>
              <div class="field mt-1 mb-0">
                <b-input
                  label="Message"
                  class="is-link"
                  type="textarea"
                  v-model="email.message"
                  placeholder="Message ..."
                  id="msg"
                ></b-input>
                <p class="has-text-right mt-2">
                  <b-button
                    @click="sendMail"
                    class="is-fullwidth is-primary is-outlined"
                    type="submit"
                  >Envoyer le message</b-button>
                </p>
              </div>
            </form>
          </div>
        </div>
        <hr />
        <div class="columns is-centered mt-5">
          <div class="column is-6-desktop is-8-tablet box">
            <h2 class="title has-text-centered">
              <b-icon icon="map-marked-alt" class="circular-sui" size="is-large"></b-icon>&nbsp;Sur la carte
            </h2>
            <iframe
              width="100%"
              height="350"
              style="border:1"
              loading="lazy"
              language="FR"
              allowfullscreen
              src="https://www.google.com/maps/embed/v1/place?maptype=satellite&key=AIzaSyBrxAlTd9i7r2pFQVPbtbnERdachT4FNqw
    &q=Ouagadougou"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  </section>
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
      isMessageSent: false,
      error: "",
    };
  },
  mounted: () => {},
  methods: {
    initMap() {
      const uluru = { lat: -25.344, lng: 131.036 };
      // The map, centered at Uluru
      const map = new google.maps.Map(this.$refs["map"], {
        zoom: 4,
        center: uluru,
      });
      // The marker, positioned at Uluru
      const marker = new google.maps.Marker({
        position: uluru,
        map: map,
      });
    },
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
        this.isMessageSent = true;
        this.email = {};
      } catch (err) {
        this.error = err.response.data.message;
      }
    },
  },
};
</script>