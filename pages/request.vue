<template>
  <div class="mt-6">
    <h1 class="mt-6 title has-text-centered">Demande de crédit</h1>
    <div class="columns is-centered">
      <div class="column is-10-desktop is-11-tablet">
        <form autocomplete="off" class="box mt-4" method="POST" @submit.prevent="submitHandler">
          <p class="help is-danger has-text-centered">{{ error }}</p>
          <b-message type="is-warning" class="my-0 is-size-7">
            <b-icon icon="info-circle" size="is-small" />Note importante: Il s'agit ici de renseigner le nom et le prénom
            qui ont identifié le numéro Orange Money que vous allez renseigner
          </b-message>
          <br />
          <div class="columns my-0 py-0">
            <div class="column my-0 py-0">
              <div class="field my-0">
                <label for="rfname" class="label help py-0 my-0">Prénom du Receveur:</label>
                <input class="input" v-model="request.rfname" type="text" id="rfname" name="rfname" />
              </div>
            </div>
            <div class="column my-0 py-0">
              <div class="field my-0">
                <label for="rlname" class="label help py-0 my-0">Nom du Receveur:</label>
                <input class="input" v-model="request.rlname" type="text" id="rlname" name="rlname" />
              </div>
            </div>
            <div class="column my-0 py-0">
              <div class="field my-0">
                <label for="rnumber" class="label help py-0 my-0">Numéro Orange Money du Receveur:</label>
                <input
                  class="input"
                  v-model="request.rnumber"
                  type="tel"
                  id="rnumber"
                  name="rnumber"
                />
              </div>
            </div>
          </div>
          <div class="columns my-0 py-0">
            <div class="column">
              <div class="field my-0">
                <label for="amount" class="label help py-0 my-0">Montant en FCFA:</label>
                <input
                  class="input"
                  v-model="request.amount"
                  placeholder="10000"
                  type="number"
                  step="0.0001"
                  id="amount"
                  name="amount"
                />
              </div>
            </div>
          </div>
          <div class="columns">
            <div class="column">
              <div class="field my-0">
                <label for="pwd" class="label help py-0 my-0">Confirmez votre mot de passe:</label>
                <input class="input" v-model="request.pwd" type="password" id="pwd" name="pwd" />
                <button class="button mt-2 is-radiusless is-fullwidth is-primary" type="submit">
                  <b-icon icon="greater-than"></b-icon>&nbsp; Envoyer la demande
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
    <div :class="['modal', {'is-active': modal}]">
      <div class="modal-background"></div>
      <div class="card is-radiusless larger">
        <header class="card-header">
          <p class="card-header-title has-text-centered">Confirmation</p>
        </header>
        <section class="card-content">
          <ul class="is-hoverable">
            <li class="columns m-0 p-0 is-mobile list-item mt-1">
              <div class="column m-0 py-0 px-2 has-text-weight-bold">Nom du Receveur:</div>
              <div class="column m-0 py-0 px-2">{{ request.rfname + ' ' + request.rlname }}</div>
            </li>
            <li class="columns m-0 p-0 is-mobile list-item mt-1">
              <div class="column m-0 py-0 px-2 has-text-weight-bold">Numéro du Receveur:</div>
              <div class="column m-0 py-0 px-2">{{ request.rnumber }}</div>
            </li>
            <li class="columns m-0 p-0 is-mobile list-item mt-1">
              <div class="column m-0 py-0 px-2 has-text-weight-bold">Montant:</div>
              <div class="column m-0 py-0 px-2">{{ request.amount }} FCFA</div>
            </li>
            <li class="columns m-0 p-0 is-mobile list-item mt-1">
              <div class="column m-0 py-0 px-2 has-text-weight-bold">Frais d'envoi:</div>
              <div class="column m-0 py-0 px-2">{{ request.amount * fee_rate}} FCFA</div>
            </li>
          </ul>
        </section>
        <footer class="card-footer">
          <a href="#" class="card-footer-item has-text-danger" @click.prevent="closeModal()">
            <b-icon icon="times"></b-icon>&nbsp; Annuler
          </a>
          <a href="#" class="card-footer-item" @click.prevent="submitFinalHandler()">
            <b-icon icon="check"></b-icon>&nbsp; Envoyer
          </a>
        </footer>
      </div>
    </div>
    <b-loading is-full-page v-model="isLoading" :can-cancel="false"></b-loading>
  </div>
</template>

<script>
export default {
  head: {
    title: "Demande de crédit",
    meta: [
      {
        hid: "description",
        name: "description",
        content:
          "Faîtes une demande de crédit chez Express Money en temps de besoins urgents.",
      },
    ],
  },
  data() {
    return {
      modal: false,
      error: "",
      fee_rate: 0.05,
      request: {
        rfname: "",
        rlname: "",
        rnumber: "",
        amount: 0,
        pwd: "",
      },
      isLoading: false,
    };
  },
  methods: {
    async submitHandler() {
      if (
        this.request.rfname === "" ||
        this.request.rlname === "" ||
        this.request.rnumber === "" ||
        this.request.pwd === ""
      ) {
        this.error = "Veuillez renseignez touts les champs";
        this.isLoading = false;
        return;
      }
      if (this.request.amount < 500 || this.request.amount > 50000) {
        this.error = "Veuillez choisir un montant entre 500 et 50 000.";
        this.isLoading = false;
        return;
      }
      this.modal = true;
    },
    async submitFinalHandler() {
      this.modal = false;
      this.isLoading = true;
      try {
        const csrf = await this.$axios.$get("/api/auth/csrf");
        this.$axios.setHeader("XSRF-TOKEN", csrf.token);
        await this.$axios.post("/api/operations/request", this.request);
        this.$router.push("/operations");
      } catch (err) {
        this.isLoading = false;
        this.error = err.response.data.message;
      }
    },
    closeModal() {
      this.modal = false;
      this.isLoading = false;
    },
  },
};
</script>


<style lang="css" scoped>
form {
  width: 100% !important;
}
</style>