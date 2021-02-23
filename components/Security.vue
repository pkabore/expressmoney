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
    <div class="field mt-1 mb-0">
      <div class="control">
        <label for="opwd" class="label help">Ancien mot de passe:</label>
        <b-input
          :disabled="!readonly"
          icon="lock"
          id="opwd"
          placeholder="********"
          v-model="credentials.oldPWD"
          type="password"
          password-reveal
        />
      </div>
    </div>
    <div class="field mt-1 mb-0">
      <div class="control">
        <label for="pwd" class="label help">Créer un nouveau mot de passe:</label>
        <b-input
          :disabled="!readonly"
          placeholder="********"
          icon="lock"
          id="pwd"
          v-model="credentials.pwd"
          type="password"
          password-reveal
        />
      </div>
    </div>
    <div class="field mt-1">
      <div class="control">
        <label for="cpwd" class="label help">Confirmer le nouveau mot de passe:</label>
        <b-input
          :disabled="!readonly"
          placeholder="********"
          icon="lock"
          id="cpwd"
          v-model="credentials.confirmedPWD"
          type="password"
          password-reveal
        />
      </div>
    </div>
    <p class="has-text-right mt-2 mb-5" v-if="readonly">
      <b-button
        class="is-primary is-fullwidth"
        @click="accountUpdateHandler()"
      >Enregistrer les modifications</b-button>
    </p>
    <AccountDeletion />
  </div>
</template>


<script>
export default {
  layout: "account",
  data() {
    return {
      error: "",
      readonly: false,
      credentials: {
        oldPWD: "",
        pwd: "",
        confirmedPWD: "",
      },
    };
  },
  methods: {
    async accountUpdateHandler() {
      if (this.credentials.pwd !== this.credentials.confirmedPWD) {
        this.error = "Mots de passe différents";
        this.openNotification();
        return;
      }
      if (this.credentials.oldPWD === "" && this.credentials.pwd !== "") {
        this.error = "Ancien mot de passe requis";
        this.openNotification();
        return;
      }
      try {
        const csrf = await this.$axios.$get("/api/auth/csrf");
        this.$axios.setHeader("XSRF-TOKEN", csrf.token);
        const res = await this.$axios.$post(
          "/api/auth/updatepassword",
          this.credentials
        );
        if (res.message) {
          this.credentials = {
            oldPWD: "",
            pwd: "",
            confirmedPWD: "",
          };
          this.readonly = false;
          this.$buefy.snackbar.open({
            message: "Mot de passe mis à jour avec succès",
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