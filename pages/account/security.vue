<template>
  <div class="columns is-centered">
    <div class="column is-6-desktop is-8-tablet">
      <h2 class="title has-text-centered">Sécurité</h2>
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
      <b-field class="mt-1 mb-0">
        <b-input
          :disabled="!readonly"
          icon="lock"
          placeholder="Ancien mot de passe"
          v-model="oldPWD"
          type="password"
          password-reveal
        />
      </b-field>
      <b-field class="mt-1 mb-0">
        <b-input
          :disabled="!readonly"
          placeholder="Créer un nouveau mot de passe"
          icon="lock"
          v-model="pwd"
          type="password"
          password-reveal
        />
      </b-field>
      <b-field class="mt-1">
        <b-input
          :disabled="!readonly"
          placeholder="Confirmer le mot de passe"
          icon="lock"
          v-model="confirmedPWD"
          type="password"
          password-reveal
        />
      </b-field>
      <p class="has-text-right mt-2 mb-5" v-if="readonly">
        <b-button
          icon-right="check"
          class="is-primary is-fullwidth is-outlined"
          @click="accountUpdateHandler()"
        >Enregistrer les modifications</b-button>
      </p>
      <hr />
      <AccountDeletion />
    </div>
  </div>
</template>


<script>
export default {
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