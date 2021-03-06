<template>
  <div class="mt-6">
    <h1 class="mt-6 title has-text-centered">Demande de crédit</h1>
    <div class="columns is-centered">
      <div class="column is-6-desktop is-8-tablet">
        <form autocomplete="off" class="mt-4" method="POST">
          <b-message type="is-info">
            <b-icon icon="info-circle" size="is-small" />&nbsp;Note importante: Il s'agit ici de renseigner le nom et le prénom
            qui ont identifié le numéro Orange Money que vous allez renseigner.
          </b-message>
          <p class="has-text-danger label has-text-centered">{{ error }}</p>
          <div class="columns my-0 py-0">
            <div class="column my-0 py-0">
              <div class="field my-0">
                <label for="rfname" class="label help py-0 my-0">Prénom du Receveur:</label>
                <b-input
                  icon="user"
                  v-model="request.rfname"
                  type="text"
                  id="rfname"
                  name="rfname"
                />
              </div>
            </div>
            <div class="column my-0 py-0">
              <div class="field my-0">
                <label for="rlname" class="label help py-0 my-0">Nom du Receveur:</label>
                <b-input
                  icon="user"
                  v-model="request.rlname"
                  type="text"
                  id="rlname"
                  name="rlname"
                />
              </div>
            </div>
          </div>
          <div class="columns my-0 py-0">
            <div class="column">
              <div class="field my-0">
                <label for="amount" class="label help py-0 my-0">Montant en FCFA:</label>
                <b-input
                  icon="sort-amount-up"
                  v-model="request.amount"
                  placeholder="Montant en FCFA"
                  type="number"
                  step="0.0001"
                  id="amount"
                  name="amount"
                />
              </div>
            </div>
            <div class="column">
              <div class="field my-0">
                <label for="rnumber" class="label help py-0 my-0">Numéro Orange Money du Receveur:</label>
                <VueTelInput
                  @input="phoneNumberValidation"
                  v-model="request.rnumber"
                  validCharactersOnly
                  mode="international"
                  id="rnumber"
                  class="input telInput"
                  inputClasses="input"
                  placeholder="Numéro de téléphone"
                ></VueTelInput>
              </div>
            </div>
          </div>
          <div class="columns">
            <div class="column">
              <div class="field my-0">
                <label for="pwd" class="label help py-0 my-0">Confirmez votre mot de passe:</label>
                <b-input icon="lock" v-model="request.pwd" type="password" id="pwd" name="pwd" />
                <button
                  class="button mt-2 is-fullwidth is-primary box"
                  @click.prevent="submitHandler()"
                >Envoyer la demande</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
    <div :class="['modal', {'is-active': confirmationModal}]">
      <div class="modal-background"></div>
      <div class="card is-radiusless larger">
        <header class="card-header">
          <p class="card-header-title has-text-centered">Confirmation</p>
        </header>
        <section class="card-content">
          <p class="has-text-centered is-danger help">{{error}}</p>
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
              <div class="column m-0 py-0 px-2">{{ (request.amount * fee_rate).toFixed(3)}} FCFA</div>
            </li>
          </ul>
        </section>
        <footer class="card-footer">
          <a class="card-footer-item has-text-danger" @click.prevent="confirmationModal = false">
            <b-icon icon="times"></b-icon>&nbsp; Annuler
          </a>
          <a class="card-footer-item" @click.prevent="requestCodeHandler()">
            <b-icon icon="check"></b-icon>&nbsp; Envoyer
          </a>
        </footer>
      </div>
    </div>
    <b-loading is-full-page v-model="isLoading" :can-cancel="false"></b-loading>
  </div>
</template>

<script>
import "vue-tel-input/dist/vue-tel-input.css";
import { VueTelInput } from "vue-tel-input";

export default {
  components: {
    VueTelInput,
  },
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
        code: "",
        pwd: "",
      },
      isLoading: false,
      show: false,
      confirmationModal: false,
      codeConfirmationModal: false,
      codeSent: false,
      canProceed: true,
    };
  },
  methods: {
    phoneNumberValidation(value, payload) {
      if (!payload.valid) {
        this.canProceed = false;
        return;
      } else this.canProceed = true;
    },
    submitHandler() {
      this.error = "";
      if (
        this.request.rfname === "" ||
        this.request.rlname === "" ||
        this.request.rnumber === "" ||
        this.request.pwd === ""
      ) {
        this.error = "Veuillez renseignez touts les champs";
        return;
      }
      if (this.canProceed === false) {
        this.error = "Numéro de téléphone incorrect.";
        console.log("something")
        return;
      }
      if (this.request.amount < 500 || this.request.amount > 50000) {
        this.error = "Veuillez choisir un montant entre 500 et 50 000.";
        return;
      }
      if (this.codeSent) this.confirmCode();
      else this.confirmationModal = true;
    },
    async requestCodeHandler() {

      this.confirmationModal = false;
      try {
        const csrf = await this.$axios.$get("/api/auth/csrf");
        this.$axios.setHeader("XSRF-TOKEN", csrf.token);
        await this.$axios.$post("/api/operations/request/code", {
          amount: this.request.amount,
        });
        this.codeSent = true;
        this.confirmCode();
      } catch (err) {
        if (!err.response.data) {
          this.error = "Erreur survenue, veuillez réessayer";
        } else this.error = err.response.data.message;
      }
    },
    confirmCode(){
      this.$buefy.dialog.prompt({
                message: `Veuillez entrer le code envoyé à votre adresse email:`,
                inputAttrs: {
                    placeholder: 'Code',
                    maxlength: 6
                },
                confirmText: "Envoyer",
                cancelText: "Annuler",
                trapFocus: true,
                onConfirm: (value) => {
                  this.request.code = value;
                  this.submitFinalHandler();
                }
            })
    },
    async submitFinalHandler() {
      this.isLoading = true;
      try {
        const csrf = await this.$axios.$get("/api/auth/csrf");
        this.$axios.setHeader("XSRF-TOKEN", csrf.token);
        await this.$axios.$post("/api/operations/request", this.request);
        this.$router.push("/credit");
      } catch (err) {
        this.isLoading = false;
        if (!err.response.data) {
          this.error = "Erreur survenue, veuillez réessayer";
        } else this.error = err.response.data.message;
        this.codeConfirmationModal = false;
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