<template>
  <section class="hero is-fullheight">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-6-desktop is-8-tablet">
            <section class="is-fullheight">
              <h1 class="title has-text-centered">Nos contacts</h1>
              <div class="content">
                <ul class="list">
                  <li class="subtitle">
                    <div class="columns">
                      <div class="is-3 column">Adresse:</div>
                      <div class="is-9 column is-family-secondary">
                        <b-icon icon="map-marker-alt"></b-icon>17 Esshokour 2 Khouribga
                      </div>
                    </div>
                  </li>
                  <li class="subtitle">
                    <div class="columns">
                      <div class="is-3 column">Tél 1:</div>
                      <div class="is-9 column is-family-secondary">
                        <b-icon icon="phone-alt"></b-icon>+226 70 00 00 00
                      </div>
                    </div>
                  </li>
                  <li class="subtitle">
                    <div class="columns">
                      <div class="is-3 column">Tel 2:</div>
                      <div class="is-9 column is-family-secondary">
                        <b-icon icon="phone-alt"></b-icon>+226 70 00 00 00
                      </div>
                    </div>
                  </li>
                  <li class="subtitle">
                    <div class="columns">
                      <div class="is-3 column">Email:</div>
                      <div class="is-9 column is-family-secondary">
                        <b-icon icon="envelope"></b-icon>expressmoney@mail.com
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </div>
        <hr />
        <div class="columns is-centered">
          <div class="column is-6-desktop is-8-tablet">
            <section class="is-fullheight">
              <h1 class="title has-text-centered">Nous écrire</h1>
              <form action="POST" @submit.prevent="sendMail()">
                <p class="help has-text-centered is-danger">{{ error }}</p>
                <div class="field">
                  <input
                    id="sujbect"
                    v-model="email.subject"
                    class="input"
                    type="text"
                    placeholder="Sujet"
                  />
                </div>
                <div class="field">
                  <input
                    v-model="email.email"
                    id="mail"
                    class="input"
                    type="email"
                    placeholder="Votre adresse email"
                  />
                </div>
                <div class="field">
                  <textarea
                    v-model="email.message"
                    placeholder="Message ..."
                    id="msg"
                    class="textarea"
                  ></textarea>
                  <p class="has-text-right">
                    <button
                      class="button is-outlined is-fullwidth is-primary"
                      type="submit"
                    >Envoyer le message</button>
                  </p>
                </div>
              </form>
            </section>
          </div>
        </div>
        <hr />
        <div class="columns is-centered">
          <div class="column is-6-desktop is-8-tablet">
            <section>
              <h1 class="title has-text-centered">Sur la carte</h1>
              <div class="map"></div>
            </section>
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