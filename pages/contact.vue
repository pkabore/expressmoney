<template>
  <section class="hero is-fullheight is-link">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-centered">
          <!-- <div class="column">
            <div class="block">
              <h1 class="title has-text-centered">
                <b-icon icon="map-marked-alt" size="is-medium"></b-icon>&nbsp; Adresses
              </h1>

              <ul class="mt-2">
                <li
                  class="mt-5 has-text-justify-mobile has-text-left-tablet mb-0 has-text-centered has-text-weight-bold is-family-primary"
                >
                  <b-icon icon="map-marker-alt" class="circular-sui" size="is-medium"></b-icon>&nbsp; 17 Esshokour 2 Khouribga
                </li>
                <li
                  class="mt-5 has-text-justify-mobile has-text-left-tablet mb-0 has-text-centered has-text-weight-bold is-family-primary"
                >
                  <b-icon icon="envelope" class="circular-sui" size="is-medium"></b-icon>&nbsp; expressmoney@mail.com
                </li>
                <li
                  class="mt-5 has-text-justify-mobile has-text-left-tablet mb-0 has-text-centered has-text-weight-bold is-family-primary"
                >
                  <b-icon icon="phone-alt" class="circular-sui" size="is-medium"></b-icon>&nbsp; +226 70 00 00 00
                </li>
                <li
                  class="mt-5 has-text-justify-mobile has-text-left-tablet mb-0 has-text-centered has-text-weight-bold is-family-primary"
                >
                  <b-icon icon="phone-alt" class="circular-sui" size="is-medium"></b-icon>&nbsp;+226 76 00 00 00
                </li>
              </ul>
            </div>
          </div>-->
          <div class="column is-6-desktop is-8-tablet box">
            <h1 class="title has-text-link has-text-centered">
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
                    icon-right="check"
                    @click="sendMail"
                    class="is-outlined is-fullwidth is-primary"
                    type="submit"
                  >Envoyer le message</b-button>
                </p>
              </div>
            </form>
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
      error: "",
      location: { lat: -25.344, lng: 131.036 },
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