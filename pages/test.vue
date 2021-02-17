<template>
  <section class="hero is-fullheight">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-8-desktop is-10-tablet">
            <h1 class="title has-text-centered mt-1">Compte</h1>
            <p class="has-text-centered has-text-error">{{ error }}</p>
            <p class="has-text-right">
              <b-button
                type="is-primary"
                v-if="account.isAccountValidated !== 'Suppression'"
                @click.prevent="readonly = !readonly"
                :class="[{'is-outlined': readonly}]"
              >
                <b-icon icon="pen" />&nbsp;&nbsp; Cliquez-ici pour modifier votre profile
              </b-button>
            </p>
            <ul hoverable>
              <li class="list-item">
                <div class="columns is-centered">
                  <div class="column is-4 py-0 px-2 has-text-weight-bold">Nom:</div>
                  <div class="column is-8">
                    <b-input
                      type="text"
                      icon="user-circle"
                      v-model="updateAccount.name"
                      required
                      class="my-0"
                      :disabled="readonly"
                      placeholder="Prénom et Nom"
                    />
                  </div>
                </div>
              </li>
              <li class="list-item mt-1">
                <div class="columns is-centered">
                  <div class="column is-4 py-0 px-2 has-text-weight-bold">Tel:</div>
                  <div class="column is-8">
                    <VueTelInput
                      aria-expanded
                      :disabled="readonly"
                      @input="phoneNumberValidation"
                      persistent
                      mode="international"
                      validCharactersOnly
                      selectLabel="Pays"
                      placeholder="Numéro de téléphone"
                      required
                      type="tel"
                      class="input my-0"
                      v-model="updateAccount.tel"
                    ></VueTelInput>
                  </div>
                </div>
              </li>
              <li class="list-item mt-1">
                <div class="columns is-centered">
                  <div class="column is-4 py-0 px-2 has-text-weight-bold">E-mail:</div>
                  <div class="column is-8">
                    <b-input
                      type="email"
                      icon="at"
                      v-model="updateAccount.email"
                      required
                      class="my-0"
                      :disabled="readonly"
                      placeholder="Email"
                    />
                  </div>
                </div>
              </li>
              <li class="list-item mt-1">
                <div class="columns is-centered">
                  <div class="column is-4 py-0 px-2 has-text-weight-bold">Ville:</div>
                  <div class="column is-8">
                    <b-select
                      expanded
                      v-model="updateAccount.city"
                      icon="city"
                      required
                      :disabled="readonly"
                      :placeholder="'Sélectionnner votre ville'"
                      :label="'Sélectionnner votre ville'"
                    >
                      <option v-for="option in cities" :value="option" :key="option">{{ option }}</option>
                    </b-select>
                  </div>
                </div>
              </li>
              <li class="list-item mt-1">
                <div class="columns is-centered">
                  <div class="column py-0 px-2 has-text-weight-bold">Status:</div>
                  <div class="column is-8 has-text-centered">
                    <b-tag
                      v-if="account.isAccountValidated === 'Validé'"
                      type="is-light is-success"
                    >{{ account.isAccountValidated }}</b-tag>
                    <b-tag
                      v-if="account.isAccountValidated === 'En attente'"
                      type="is-light is-primary"
                    >{{ account.isAccountValidated }}</b-tag>
                    <b-tag
                      v-if="account.isAccountValidated === 'Décliné'"
                      type="is-light is-error"
                    >{{ account.isAccountValidated }}</b-tag>
                    <b-tag v-if="account.isAccountValidated === ''" type="is-light is-info">Visiteur</b-tag>
                    <b-tag
                      v-if="account.isAccountValidated === 'Suppression'"
                      type="is-light is-error"
                    >Suppression</b-tag>
                  </div>
                </div>
              </li>
              <li class="list-item mt-4">
                <div class="columns is-centered">
                  <div class="column py-0 px-2 has-text-weight-bold">Copie de CNIB/Passeport:</div>
                  <div class="column is-8 has-text-centered">
                    <a class="text-decoration-none" :target="target" :href="idUri">
                      <b-icon icon="link" />&nbsp;Visualiser
                    </a>
                  </div>
                </div>
              </li>
              <li class="list-item mt-1">
                <div class="columns is-centered">
                  <div class="column py-0 px-2 has-text-weight-bold">Carte de travailleur:</div>
                  <div class="column is-8 has-text-centered">
                    <a class="text-decoration-none" :target="target" :href="wcardUri">
                      <b-icon icon="link" />&nbsp;Visualiser
                    </a>
                  </div>
                </div>
              </li>
              <li class="list-item mt-1">
                <div class="columns is-centered">
                  <div
                    class="column py-0 px-2 has-text-weight-bold"
                  >Attestation de prise de service:</div>
                  <div class="column is-8 has-text-centered">
                    <a class="text-decoration-none" :target="target" :href="codcUri">
                      <b-icon icon="link" />&nbsp;Visualiser
                    </a>
                  </div>
                </div>
              </li>
              <li class="list-item mt-4">
                <div class="columns is-centered">
                  <div class="column py-0 px-2 has-text-weight-bold">Date de création:</div>
                  <div
                    class="column is-8 has-text-centered"
                  >{{ new Date(account.createdAt).toLocaleString('fr-FR') }}</div>
                </div>
              </li>
              <li class="list-item mt-1">
                <div class="columns is-centered">
                  <div class="column py-0 px-2 has-text-weight-bold">Dernière mise à jour:</div>
                  <div
                    class="column is-8 has-text-centered"
                  >{{ new Date(account.updatedAt).toLocaleString('fr-FR') }}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <hr />
        <div class="columns is-centered" v-if="!readonly">
          <div class="column is-8-desktop is-10-tablet">
            <p class="title has-text-centered">Changement de mot de passe</p>
            <div class="field">
              <b-input
                icon="lock"
                class="my-0"
                placeholder="Ancien mot de passe"
                v-model="updateAccount.oldPWD"
                type="password"
                password-reveal
              />
            </div>
            <div class="field">
              <b-input
                placeholder="Créer un nouveau mot de passe"
                icon="lock"
                class="my-0"
                v-model="updateAccount.pwd"
                type="password"
                password-reveal
              />
            </div>
            <div class="field">
              <b-input
                placeholder="Confirmer le mot de passe"
                icon="lock"
                class="my-0"
                v-model="updateAccount.confirmedPWD"
                type="password"
                password-reveal
              />
            </div>
          </div>
        </div>
        <hr />
        <div
          class="columns is-centered"
          v-if="!readonly && account.isAccountValidated !== 'Validé' && account.isAccountValidated !== 'Suppression'"
        >
          <div class="column is-8-desktop is-10-tablet">
            <p class="title has-text-centered">Informations professionnelles</p>
            <div class="field mt-1 mb-0">
              <b-upload expanded v-model="updateAccount.id">
                <a class="button is-fullwidth is-outlined">
                  <b-icon icon="cloud-upload-alt"></b-icon>
                  <span>{{ updateAccount.id.name || "Copie de CNIB/Passeport (Format: PDF/Image, Taille Max: 4M)"}}</span>
                </a>
              </b-upload>
            </div>
            <div class="field mt-1 mb-0">
              <b-upload expanded v-model="updateAccount.wcard">
                <a class="button is-fullwidth is-outlined">
                  <b-icon icon="cloud-upload-alt"></b-icon>
                  <span>{{ updateAccount.wcard.name || "Carte de travailleur (Format: PDF/Image, Taille Max: 4M)"}}</span>
                </a>
              </b-upload>
            </div>
            <div class="field mt-1 mb-0">
              <b-upload expanded v-model="updateAccount.codc">
                <a class="button is-fullwidth is-outlined">
                  <b-icon icon="cloud-upload-alt"></b-icon>
                  <span>{{ updateAccount.codc.name || "Attestation de prise de service (Format: PDF/Image, Taille Max: 4M)"}}</span>
                </a>
              </b-upload>
            </div>
            <p class="has-text-right pr-1 mt-4">
              <b-button
                class="is-primary is-block is-fullwidth is-outlined"
                @click="accountUpdateHandler()"
              >Enregistrer les modifications</b-button>
            </p>
          </div>
        </div>
        <hr />
        <div
          class="columns is-centered"
          v-if="account.isAccountValidated !== 'En attente' && account.isAccountValidated !== 'Suppression' && readonly"
        >
          <div class="column is-8-desktop is-10-tablet">
            <b-message type="is-danger">
              <h2 class="has-text-centered title has-text-danger">
                <b-icon class="has-text-danger" icon="exclamation-triangle"></b-icon>&nbsp;&nbsp; Zone dangereuse
              </h2>
              <hr />
              <p class="has-text-centered mt-3">
                <b-button class="is-danger is-outlined" @click.prevent="openModal()">
                  <b-icon icon="trash"></b-icon>&nbsp;&nbsp;
                  Supprimer mon compte
                </b-button>
              </p>
            </b-message>
          </div>
        </div>
        <div class="columns is-centered">
          <div class="column is-8-desktop is-10-tablet">
            <div class="modal" :value="modal" width="500">
              <div class="card">
                <div class="card-header">
                  <h2 class="has-text-centered has-text-weight-bold h2">Confirmation</h2>
                </div>
                <div class="card-content">
                  <p class="has-text-centered has-text-error">
                    Êtes-vous sûr de vouloir supprimer votre compte ?
                    <br />Attention: Cette action est irréversible!
                  </p>
                </div>
                <hr />
                <footer class="card-footer-actions">
                  <b-button text class="primary" @click.prevent="closeModal()">
                    <b-icon icon="times"></b-icon>&nbsp; Annuler
                  </b-button>
                  <b-button class="error" @click.prevent="requestAccountDeletion()">
                    <b-icon icon="trash"></b-icon>&nbsp; Supprimer
                  </b-button>
                </footer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import "vue-tel-input/dist/vue-tel-input.css";
import { VueTelInput } from "vue-tel-input";

export default {
  components: {
    VueTelInput,
  },
  head: {
    title: "Infos",
    meta: [
      {
        hid: "description",
        name: "description",
        content: "Express Money - Consultez vos informations personnelles.",
      },
    ],
  },
  data() {
    return {
      modal: false,
      error: "",
      show: false,
      readonly: true,

      updateAccount: {
        name: "",
        tel: "",
        email: "",
        city: "",
        oldPWD: "",
        pwd: "",
        confirmedPWD: "",
        id: {},
        codc: {},
        wcard: {},
      },
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
      canProceed: true,
    };
  },
  mounted() {
    this.updateAccount.name = this.account.name;
    this.updateAccount.tel = this.account.tel;
    this.updateAccount.email = this.account.email;
    this.updateAccount.city = this.account.city;
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
    async requestAccountDeletion() {
      this.modal = false;
      try {
        const csrf = await this.$axios.$get("/api/auth/csrf");
        this.$axios.setHeader("XSRF-TOKEN", csrf.token);
        const res = await this.$axios.$post("/api/auth/delete");
        if (res.message) await this.$auth.fetchUser();
      } catch (err) {
        this.error = err.response.data.message;
      }
    },
    async accountUpdateHandler() {
      if (this.canProceed === false) return;
      if (
        this.updateAccount.name === "" ||
        this.updateAccount.tel === "" ||
        this.updateAccount.email === "" ||
        this.updateAccount.city === ""
      ) {
        this.error = "Veuillez renseigner touts les champs nécessaires.";
        return;
      }

      if (this.updateAccount.pwd !== this.updateAccount.confirmedPWD) {
        this.error = "Mots de passe différents";
        return;
      }

      if (this.updateAccount.oldPWD === "" && this.updateAccount.pwd !== "") {
        this.error = "Ancien mot de passe requis";
        return;
      }

      try {
        const csrf = await this.$axios.$get("/api/auth/csrf");
        this.$axios.setHeader("XSRF-TOKEN", csrf.token);
        const res = await this.$axios.$put(
          "/api/auth/update",
          this.updateAccount
        );
        if (res.message) {
          await this.$auth.fetchUser();
          this.error = "";
          this.readonly = true;
        }
      } catch (err) {
        this.error = err.response.data.message;
      }
    },
    closeModal() {
      this.modal = false;
    },
    openModal() {
      this.modal = true;
    },
  },
  computed: {
    account() {
      return this.$auth ? this.$auth.user : {};
    },
    isLoggedIn() {
      return this.$auth ? this.$auth.loggedIn : false;
    },
    idUri() {
      return this.$auth.user.idUri ? "/dossiers/" + this.$auth.user.idUri : "#";
    },
    wcardUri() {
      return this.$auth.user.wcardUri
        ? "/dossiers/" + this.$auth.user.wcardUri
        : "#";
    },
    codcUri() {
      return this.$auth.user.codcUri
        ? "/dossiers/" + this.$auth.user.codcUri
        : "#";
    },
    target() {
      return this.$auth.user.idUri ? "_blank" : "_self";
    },
  },
};
</script>

<style scoped>
.text-decoration-none {
  text-decoration: none !important;
}
</style>