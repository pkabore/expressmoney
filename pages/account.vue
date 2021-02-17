<template>
  <section class="section">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-8-desktop is-10-tablet">
          <p class="has-text-right">
            <b-button
              icon-left="pen"
              type="is-primary"
              v-if="account.isAccountValidated !== 'Suppression'"
              @click.prevent="readonly = !readonly"
            >Cliquez-ici pour modifier</b-button>
          </p>
          <p class="title has-text-centered mt-5 has-text-primary">1. Profile</p>
          <b-field>
            <b-input
              type="text"
              icon="user-circle"
              v-model="updateAccount.name"
              required
              :disabled="readonly"
              placeholder="Prénom et Nom"
            />
          </b-field>
          <b-field>
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
          </b-field>
          <b-field>
            <b-input
              type="email"
              icon="at"
              v-model="updateAccount.email"
              required
              :disabled="readonly"
              placeholder="Email"
            />
          </b-field>

          <b-field>
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
          </b-field>
        </div>
      </div>
      <div class="columns is-mobile is-centered" v-if="!readonly">
        <div class="column is-8-desktop is-10-tablet">
          <p class="title has-text-centered has-text-primary">2. Changement de mot de passe</p>
          <b-field class="mt-1 mb-0">
            <b-input
              icon="lock"
              placeholder="Ancien mot de passe"
              v-model="updateAccount.oldPWD"
              type="password"
              password-reveal
            />
          </b-field>
          <b-field class="mt-1 mb-0">
            <b-input
              placeholder="Créer un nouveau mot de passe"
              icon="lock"
              v-model="updateAccount.pwd"
              type="password"
              password-reveal
            />
          </b-field>
          <b-field class="mt-1 mb-0">
            <b-input
              placeholder="Confirmer le mot de passe"
              icon="lock"
              v-model="updateAccount.confirmedPWD"
              type="password"
              password-reveal
            />
          </b-field>
        </div>
      </div>
      <div
        id="dossier"
        class="columns is-mobile is-centered"
        v-if="!readonly && account.isAccountValidated !== 'Validé' && account.isAccountValidated !== 'Suppression'"
      >
        <div class="column is-8-desktop is-10-tablet">
          <p class="title has-text-centered has-text-primary">3. Informations professionnelles</p>
          <p
            class="label help has-text-grey-dark has-text-centered"
          >(Format: PDF/Image, Taille Max: 4M par fichier)</p>
          <div
            class="field my-0 py-0 columns"
            v-if="account.isAccountValidated==='' || account.isAccountValidated==='En attente' || (account.isAccountValidated === 'Décliné' && account.updatingFile.includes('id'))"
          >
            <label for="id" class="column label help my-0 py-2">Copie de CNIB/Passeport:</label>
            <input type="file" class="column my-0 py-2" ref="id" id="id" />
          </div>
          <div
            class="field my-0 py-0 columns"
            v-if="account.isAccountValidated==='' || account.isAccountValidated==='En attente' || (account.isAccountValidated === 'Décliné' && account.updatingFile.includes('wcard'))"
          >
            <label for="wcard" class="column label help my-0 py-2">Carte de travailleur:</label>
            <input type="file" class="column my-0 py-2" id="wcard" ref="wcard" />
          </div>
          <div
            class="field my-0 py-0 columns"
            v-if="account.isAccountValidated==='' || account.isAccountValidated==='En attente' || (account.isAccountValidated === 'Décliné' && account.updatingFile.includes('codc'))"
          >
            <label for="codc" class="column label help my-0 py-2">Attestation de prise de service:</label>
            <input type="file" class="column my-0 py-2" id="codc" ref="codc" />
          </div>
        </div>
      </div>
      <div class="columns is-centered">
        <div class="column is-8-desktop is-10-tablet">
          <ul>
            <li class="columns list-item is-mobile mt-4">
              <div class="column py-0 my-0 has-text-weight-bold">Status:</div>
              <div class="column is-8 has-text-centered py-0 my-0">
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
            </li>
            <li class="columns list-item is-mobile">
              <div class="column py-0 my-0 has-text-weight-bold">Copie de CNIB/Passeport:</div>
              <div class="column is-8 has-text-centered py-0 my-0">
                <a class="text-decoration-none" :target="target" :href="idUri">
                  <b-icon icon="link" />&nbsp;Visualiser
                </a>
              </div>
            </li>
            <li class="columns list-item is-mobile">
              <div class="column py-0 my-0 has-text-weight-bold">Carte de travailleur:</div>
              <div class="column is-8 has-text-centered py-0 my-0">
                <a class="text-decoration-none" :target="target" :href="wcardUri">
                  <b-icon icon="link" />&nbsp;Visualiser
                </a>
              </div>
            </li>
            <li class="columns list-item is-mobile">
              <div class="column py-0 my-0 has-text-weight-bold">Attestation de prise de service:</div>
              <div class="column is-8 has-text-centered py-0 my-0">
                <a class="text-decoration-none" :target="target" :href="codcUri">
                  <b-icon icon="link" />&nbsp;Visualiser
                </a>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="columns is-mobile is-centered">
        <div class="column is-8-desktop is-10-tablet">
          <p class="has-text-right pr-1 my-5">
            <b-button
              icon-right="check"
              class="is-primary is-outlined"
              @click="accountUpdateHandler()"
            >Enregistrer toutes les modifications</b-button>
          </p>
        </div>
      </div>
      <div
        class="columns is-mobile is-centered"
        v-if="account.isAccountValidated !== 'En attente' && account.isAccountValidated !== 'Suppression' && readonly"
      >
        <div class="column is-8-desktop is-10-tablet">
          <b-message type="is-warning">
            <h2 class="has-text-centered title has-text-danger is-family-primary">
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
          <div :class="['modal', {'is-active': modal}]">
            <div class="modal-background"></div>
            <div class="card">
              <header class="card-header py-2">
                <h2 class="has-text-centered subtitle has-text-weight-bold h2">Confirmation</h2>
              </header>
              <section class="card-content">
                <p class="has-text-centered has-text-danger-dark">
                  Êtes-vous sûr de vouloir supprimer votre compte ?
                  <br />
                  <b-icon class="has-text-danger" icon="exclamation-triangle"></b-icon>&nbsp;&nbsp;Attention: Cette action est irréversible!
                </p>
              </section>
              <footer class="card-footer">
                <a href="#" class="card-footer-item has-text-primary" @click.prevent="closeModal()">
                  <b-icon icon="times"></b-icon>&nbsp; Annuler
                </a>
                <a
                  href="#"
                  class="card-footer-item has-text-danger"
                  @click.prevent="requestAccountDeletion()"
                >
                  <b-icon icon="trash"></b-icon>&nbsp; Supprimer
                </a>
              </footer>
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
    title: "Profile",
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
      readonly: true,

      updateAccount: {
        name: "",
        tel: "",
        email: "",
        city: "",
        oldPWD: "",
        pwd: "",
        confirmedPWD: "",
      },
      id: {},
      codc: {},
      wcard: {},
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
    verifyfiles(file) {
      const maxSize = 4194304;
      if (
        !file.type.includes("image/") &&
        !file.type.includes("application/pdf")
      ) {
        return "Formats supportés: PDF/Image";
      }
      if (file.size > maxSize) {
        return "Taille maximale par fichier: 4Mo";
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
      let formData = new FormData();
      const maxSize = 4194304;
      if (
        !file.type.includes("image/") &&
        !file.type.includes("application/pdf")
      ) {
        this.error = "Formats supportés: PDF/Image";
        return;
      }
      if (file.size > maxSize) {
        this.error = "Taille maximale par fichier: 4Mo";
        return;
      }

      if (this.updateAccount.id.name)
        formData.append("papers", this.updateAccount.id);
      if (this.updateAccount.wcard.name)
        formData.append("papers", this.updateAccount.wcard);
      if (this.updateAccount.codc.name)
        formData.append("papers", this.updateAccount.codc);

      formData.append("city", this.updateAccount.city);
      try {
        const csrf = await this.$axios.$get("/api/auth/csrf");
        const config = {
          headers: {
            "XSRF-TOKEN": csrf.token,
            "Content-Type": "multipart/form-data",
          },
        };
        const res = await this.$axios.$put(
          "/api/auth/update",
          this.updateAccount,
          config
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