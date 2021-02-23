<template>
  <div>
    <p class="has-text-right has-text-primary my-0 is-family-secondary">
      <b-button
        icon-left="pen"
        outlined
        size="is-small"
        class="mb-1"
        type="is-primary"
        @click="readonly = !readonly"
      >Modifier</b-button>
    </p>
    <p class="has-text-centered help is-danger">{{error}}</p>
    <div class="field mt-1 mb-0">
      <div class="control">
        <label for="name" class="label help">Prénom et Nom:</label>
        <b-input
          type="text"
          id="name"
          icon="user-circle"
          v-model="profile.name"
          required
          :disabled="!readonly"
          placeholder="Prénom et Nom"
        />
      </div>
    </div>
    <div class="field mt-1 mb-0">
      <div class="control">
        <label for="tel" class="label help">Numéro de téléphone:</label>
        <VueTelInput
          id="tel"
          aria-expanded
          :disabled="!readonly"
          @input="phoneNumberValidation"
          persistent
          mode="international"
          validCharactersOnly
          selectLabel="Pays"
          placeholder="+226 00 00 00 00"
          required
          type="tel"
          class="input my-0"
          v-model="profile.tel"
        ></VueTelInput>
      </div>
    </div>
    <div class="field mt-1 mb-0">
      <div class="control">
        <label for="email" class="label help">Adresse email:</label>
        <b-input
          type="email"
          icon="at"
          v-model="profile.email"
          required
          id="email"
          :disabled="!readonly"
          placeholder="Email"
        />
      </div>
    </div>
    <p class="has-text-right mt-2" v-if="readonly">
      <b-button
        class="is-primary is-fullwidth"
        @click="accountUpdateHandler()"
      >Enregistrer les modifications</b-button>
    </p>
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
      profile: {
        name: "",
        tel: "",
        email: "",
      },
    };
  },
  mounted() {
    this.profile.name = this.account.name;
    this.profile.tel = this.account.tel;
    this.profile.email = this.account.email;
  },
  methods: {
    phoneNumberValidation(value, payload) {
      if (!payload.valid) {
        this.canProceed = false;
        return;
      } else this.canProceed = true;
    },
    reset() {
      this.readonly = false;
      this.error = "";
      this.name = this.account.name;
      this.tel = this.account.tel;
      this.email = this.account.email;
    },
    async accountUpdateHandler() {
      if (!this.canProceed) {
        this.error = "Numéro de téléphone incorrect.";
        return;
      }
      try {
        const csrf = await this.$axios.$get("/api/auth/csrf");
        this.$axios.setHeader("XSRF-TOKEN", csrf.token);
        const res = await this.$axios.$post(
          "/api/auth/updateprofile",
          this.profile
        );
        if (res.message) {
          await this.$auth.fetchUser();
          this.profile.name = this.account.name;
          this.profile.tel = this.account.tel;
          this.profile.email = this.account.email;
          this.readonly = false;
          this.error = "";
          this.$buefy.snackbar.open({
            message: res.message.includes("email")
              ? res.message
              : "Compte mis à jour avec succès",
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
          : "Erreur technique. Veuillez réessayer";
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