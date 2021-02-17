<template>
  <section class="section">
    <div class="container">
      <CompleteProfile
        v-if="account.isAccountValidated==='' && account.accountRegistrationCode===''"
      />
      <div class="columns is-centered">
        <div class="column is-6-desktop is-8-tablet bordered-box is-secondary">
          <h2 class="title has-text-centered">Profil</h2>
          <p class="has-text-right my-2 has-text-primary is-family-secondary">
            <b-switch
              v-if="account.isAccountValidated!=='Suppression'&&account.accountRegistrationCode===''&&account.isAccountValidated!==''"
              type="is-success"
              v-model="readonly"
              size="is-medium"
            >Modifier</b-switch>
          </p>
        </div>
      </div>
      <div class="columns is-centered">
        <div class="column is-6-desktop is-8-tablet bordered-box is-secondary">
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
          <div class="field">
            <div class="control">
              <div class="select is-fullwidth" id="city">
                <select name="city" :disabled="!readonly" required v-model="city">
                  <option class="py-3" value disabled>Ville</option>
                  <option class="py-3" v-for="city in cities" :key="city" :value="city">{{city}}</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="columns is-centered" v-if="readonly">
        <div class="column is-6-desktop is-8-tablet bordered-box is-secondary">
          <b-field class="mt-1 mb-0">
            <b-input
              icon="lock"
              placeholder="Ancien mot de passe"
              v-model="oldPWD"
              type="password"
              password-reveal
            />
          </b-field>
          <b-field class="mt-1 mb-0">
            <b-input
              placeholder="Créer un nouveau mot de passe"
              icon="lock"
              v-model="pwd"
              type="password"
              password-reveal
            />
          </b-field>
          <b-field class="mt-1 mb-0">
            <b-input
              placeholder="Confirmer le mot de passe"
              icon="lock"
              v-model="confirmedPWD"
              type="password"
              password-reveal
            />
          </b-field>
        </div>
      </div>
      <div
        id="dossier"
        class="columns is-centered"
        v-if="readonly && account.isAccountValidated !== 'Validé' && account.isAccountValidated !== 'Suppression'"
      >
        <div class="column is-6-desktop is-8-tablet bordered-box is-secondary">
          <p
            class="label help has-text-grey-dark has-text-centered"
          >(Format: PDF/Image, Taille Max: 4M par fichier)</p>
          <div
            class="field my-0 py-0 columns"
            v-if="account.isAccountValidated==='' || account.isAccountValidated==='En attente' || (account.isAccountValidated === 'Décliné' && account.updatingFile.includes('id'))"
          >
            <label for="id" class="column label help my-0 py-2">Copie de CNIB/Passeport:</label>
            <input type="file" class="column my-0 py-2" @change="upload($event, 'id')" id="id" />
          </div>
          <div
            class="field my-0 py-0 columns"
            v-if="account.isAccountValidated==='' || account.isAccountValidated==='En attente' || (account.isAccountValidated === 'Décliné' && account.updatingFile.includes('wcard'))"
          >
            <label for="wcard" class="column label help my-0 py-2">Carte de travailleur:</label>
            <input type="file" class="column my-0 py-2" @change="upload($event, 'wcard')" />
          </div>
          <div
            class="field my-0 py-0 columns"
            v-if="account.isAccountValidated==='' || account.isAccountValidated==='En attente' || (account.isAccountValidated === 'Décliné' && account.updatingFile.includes('codc'))"
          >
            <label for="codc" class="column label help my-0 py-2">Attestation de prise de service:</label>
            <input type="file" class="column my-0 py-2" id="codc" @change="upload($event, 'codc')" />
          </div>
        </div>
      </div>
      <div class="columns is-centered">
        <div class="column is-6-desktop is-8-tablet bordered-box is-secondary">
          <div class="columns is-mobile mt-4 mb-4">
            <div class="column is-8 py-0 my-0 has-text-weight-bold">Status:</div>
            <div class="column is-4 has-text-centered py-0 my-0">
              <b-tag
                v-if="account.isAccountValidated === 'Validé'"
                type="is-success"
              >{{ account.isAccountValidated }}</b-tag>
              <b-tag
                v-if="account.isAccountValidated === 'En attente'"
                type="is-primary"
              >{{ account.isAccountValidated }}</b-tag>
              <b-tag
                v-if="account.isAccountValidated === 'Décliné'"
                type="is-danger"
              >{{ account.isAccountValidated }}</b-tag>
              <b-tag v-if="account.isAccountValidated === ''" type="is-info">Visiteur</b-tag>
              <b-tag
                v-if="account.isAccountValidated === 'Suppression'"
                type="is-danger"
              >Suppression</b-tag>
            </div>
          </div>
          <div class="columns is-mobile">
            <div class="column is-8 py-0 my-0 has-text-weight-bold">Copie de CNIB/Passeport:</div>
            <div class="column is-4 has-text-centered py-0 my-0">
              <a class="text-decoration-none" :target="target" :href="idUri">
                <b-icon icon="link" />&nbsp;Visualiser
              </a>
            </div>
          </div>
          <div class="columns is-mobile">
            <div class="column is-8 py-0 my-0 has-text-weight-bold">Carte de travailleur:</div>
            <div class="column is-4 has-text-centered py-0 my-0">
              <a class="text-decoration-none" :target="target" :href="wcardUri">
                <b-icon icon="link" />&nbsp;Visualiser
              </a>
            </div>
          </div>
          <div class="columns is-mobile">
            <div class="column is-8 py-0 my-0 has-text-weight-bold">Attestation de prise de service:</div>
            <div class="column is-4 has-text-centered py-0 my-0">
              <a class="text-decoration-none" :target="target" :href="codcUri">
                <b-icon icon="link" />&nbsp;Visualiser
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="columns is-centered" v-if="readonly">
        <div class="column is-6-desktop is-8-tablet">
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
        class="columns is-mobile is-centered mt-6"
        v-if="account.isAccountValidated !== 'En attente' && account.isAccountValidated !== 'Suppression' && readonly"
      >
        <div class="column is-6-desktop is-8-tablet bordered-box is-danger mt-6">
          <p class="has-text-centered mt-3">
            <b-button
              class="is-danger is-outlined"
              @click.prevent="openModal()"
            >Supprimer mon compte</b-button>
          </p>
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
    title: "Profil",
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
      readonly: false,
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
    this.name = this.account.name;
    this.tel = this.account.tel;
    this.email = this.account.email;
    this.city = this.account.city;
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
    upload(event, filename) {
      if (filename === "id") this.id = event.target.files[0];
      if (filename === "wcard") this.wcard = event.target.files[0];
      if (filename === "codc") this.codc = event.target.files[0];
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
    verifyfile(file) {
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
      return null;
    },
    async accountUpdateHandler() {
      if (this.canProceed === false) return;
      if (
        this.name === "" ||
        this.tel === "" ||
        this.email === "" ||
        this.city === ""
      ) {
        this.error = "Veuillez renseigner touts les champs nécessaires.";
        return;
      }

      if (this.pwd !== this.confirmedPWD) {
        this.error = "Mots de passe différents";
        return;
      }

      if (this.oldPWD === "" && this.pwd !== "") {
        this.error = "Ancien mot de passe requis";
        return;
      }
      let formData = new FormData();

      if (this.id.name) {
        const errMsg = this.verifyfile(this.id);
        if (errMsg) {
          this.error = errMsg;
          return;
        }
        formData.append("papers", this.id);
      }
      if (this.wcard.name) {
        const errMsg = this.verifyfile(this.wcard);
        if (errMsg) {
          this.error = errMsg;
          return;
        }
        formData.append("papers", this.wcard);
      }
      if (this.codc.name) {
        const errMsg = this.verifyfile(this.codc);
        if (errMsg) {
          this.error = errMsg;
          return;
        }
        formData.append("papers", this.codc);
      }

      formData.append("name", this.name);
      formData.append("tel", this.tel);
      formData.append("email", this.email);
      formData.append("city", this.city);
      formData.append("oldPWD", this.oldPWD);
      formData.append("pwd", this.pwd);
      formData.append("confirmedPWD", this.confirmedPWD);
      try {
        const a = formData.getAll("papers");

        let b = {};
        b.name = formData.get("name");
        b.tel = formData.get("tel");
        b.email = formData.get("email");
        b.city = formData.get("city");
        b.oldPWD = formData.get("oldPWD");
        b.pwd = formData.get("pwd");
        b.confirmedPWD = formData.get("confirmedPWD");
        console.log(b, a);
        return;
        const csrf = await this.$axios.$get("/api/auth/csrf");
        const config = {
          headers: {
            "XSRF-TOKEN": csrf.token,
            "Content-Type": "multipart/form-data",
          },
        };
        const res = await this.$axios.$put("/api/auth/update", this.config);
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