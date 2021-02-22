<template>
  <div class="bordered-box is-danger py-6 mb-5">
    <p class="has-text-centered">
      <b-button class="is-danger is-outlined" @click.prevent="openModal()">Supprimer mon compte</b-button>
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      modal: false,
      error: "",
    };
  },
  methods: {
    async requestAccountDeletion() {
      this.modal = false;
      try {
        const csrf = await this.$axios.$get("/api/auth/csrf");
        this.$axios.setHeader("XSRF-TOKEN", csrf.token);
        const res = await this.$axios.$post("/api/auth/delete");
        if (res.message) await this.$auth.fetchUser();
        this.$buefy.snackbar.open({
          message: "Demande de suppression envoyé avec succès",
          type: "is-success",
          actionText: "Fermer",
          duration: 10000,
          position: "is-top-right",
          queue: false,
        });
      } catch (err) {
        this.error = err.response.data
          ? err.response.data.message
          : "Erreur technique!";
        this.openNotification();
      }
    },
    openNotification() {
      this.$buefy.snackbar.open({
        message: this.error,
        type: "is-danger",
        actionText: "Fermer",
        duration: 10000,
        position: "is-top-right",
        queue: false,
      });
    },
    closeModal() {
      this.modal = false;
    },
    openModal() {
      this.$buefy.dialog.confirm({
        title: "Suppression de compte",
        message: "Êtes-vous sûr de vouloir <b>supprimer</b> votre compte?",
        confirmText: "Supprimer mon compte",
        type: "is-danger",
        hasIcon: true,
        cancelText: "Annuler",
        onConfirm: () => this.requestAccountDeletion(),
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