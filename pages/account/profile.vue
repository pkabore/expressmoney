<template>
  <div class="columns mt-0 is-centered">
    <div class="column is-6-desktop is-8-tablet">
      <h2 class="title has-text-centered">Profile</h2>
      <p class="has-text-right has-text-primary is-family-secondary">
        <b-button
          icon-left="pen"
          outlined
          is-small
          class="my-2"
          type="is-primary"
          @click="readonly = !readonly"
        >Modifier</b-button>
      </p>
      <b-field>
        <b-input
          type="text"
          icon="user-circle"
          v-model="name"
          required
          :disabled="!readonly"
          placeholder="Prénom et Nom"
        />
      </b-field>
      <b-field>
        <VueTelInput
          aria-expanded
          :disabled="!readonly"
          @input="phoneNumberValidation"
          persistent
          mode="international"
          validCharactersOnly
          selectLabel="Pays"
          placeholder="Numéro de téléphone"
          required
          type="tel"
          class="input my-0"
          v-model="tel"
        ></VueTelInput>
      </b-field>
      <b-field>
        <b-input
          type="email"
          icon="at"
          v-model="email"
          required
          :disabled="!readonly"
          placeholder="Email"
        />
      </b-field>
      <p class="has-text-right mt-2" v-if="readonly">
        <b-button
          icon-right="check"
          class="is-primary is-fullwidth is-outlined"
          @click="accountUpdateHandler()"
        >Enregistrer les modifications</b-button>
      </p>
    </div>
  </div>
</template>


<script>
import "vue-tel-input/dist/vue-tel-input.css";
import { VueTelInput } from "vue-tel-input";

export default {
  components: {
    VueTelInput,
  },
  layout: "account",
  data() {
    return {
      error: "",
      readonly: false,
      name: "",
      tel: "",
      email: "",
      city: "",
      cities: [
        "Ouagadougou",
        "Bobo Dioulasso",
        "Banfora",
        "Dori",
        "Koudougou",
        "Fada N'Gourma",
        "Ouahigouya",
        "Po",
        "Kaya",
      ],
    };
  },
  methods: {
    phoneNumberValidation(value, payload) {
      if (payload.isValid === false) {
        this.error = "Numéro de téléphone incorrect.";
        this.canProceed = false;
        return;
      } else {
        this.canProceed = true;
        if (this.error.includes("Numéro de téléphone")) this.error = "";
      }
    },

    async accountUpdateHandler() {
      formData.append("name", this.name);
      formData.append("tel", this.tel);
      formData.append("email", this.email);
      formData.append("city", this.city);
      try {
        const csrf = await this.$axios.$get("/api/auth/csrf");
        const config = {
          headers: {
            "XSRF-TOKEN": csrf.token,
            "Content-Type": "multipart/form-data",
          },
        };
        const res = await this.$axios.$post(
          "/api/auth/update",
          formData,
          config
        );
        if (res.message) {
          await this.$fetch();
          this.reset();
          this.$buefy.snackbar.open({
            message: "Compte mis à jour avec succès",
            type: "is-success",
            actionText: "Fermer",
            indefinite: true,
            position: "is-top-right",
            queue: false,
          });
        }
      } catch (err) {
        this.error = err.response.data
          ? err.response.data.message
          : "Erreur technique. Veuillez reéssayer";
        this.openNotification();
      }
    },
    openNotification() {
      this.$buefy.snackbar.open({
        message: this.error,
        type: "is-danger",
        actionText: "Fermer",
        indefinite: true,
        position: "is-top-right",
        queue: false,
      });
    },
  },
  computed: {
    account() {
      return this.$auth ? this.$auth.user : {};
    },
    isLoggedIn() {
      return this.$auth ? this.$auth.loggedIn : false;
    },
  },
};
</script>