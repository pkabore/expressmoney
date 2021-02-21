<template>
  <div class="columns is-centered">
    <div class="column is-8-desktop is-10-tablet">
      <b-steps type="is-twitter" :has-navigation="false" v-model="activeStep" class="mb-5">
        <template>
          <b-step-item step="1" key="compte" label="Compte crée" clickable>
            <div class="box">
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
            </div>
          </b-step-item>
        </template>
        <template>
          <b-step-item
            step="2"
            key="profile"
            label="Profile"
            :clickable="currentLevel >= 1 ? true: false"
          >
            <div class="box">
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
              <p class="help has-text-centered has-text-info mt-0 pt-0 mb-3">
                <b-icon icon="info-circle"></b-icon>&nbsp; Format: PDF/Image, Taille Max: 4M par fichier
              </p>
              <div class="field my-0">
                <div class="control columns my-0 py-0">
                  <label for="id" class="column label help my-0 py-2">Copie de CNIB/Passeport:</label>
                  <input
                    type="file"
                    :disabled="!readonly && account.isAccountValidated !== 'Validé'"
                    class="column my-0 py-2"
                    @change="upload($event, 'id')"
                    id="id"
                  />
                </div>
              </div>
              <div class="field my-0">
                <div class="control columns my-0 py-0">
                  <label for="wcard" class="column label help my-0 py-2">Carte de travailleur:</label>
                  <input
                    type="file"
                    :disabled="!readonly && account.isAccountValidated !== 'Validé'"
                    class="column my-0 py-2"
                    @change="upload($event, 'wcard')"
                  />
                </div>
              </div>
              <div class="field my-0">
                <div class="control columns my-0 py-0">
                  <label
                    for="codc"
                    class="label column help my-0 py-2"
                  >Attestation de prise de service:</label>
                  <input
                    type="file"
                    :disabled="!readonly && account.isAccountValidated !== 'Validé'"
                    class="my-0 column py-2"
                    id="codc"
                    @change="upload($event, 'codc')"
                  />
                </div>
                <div class="field my-0">
                  <div class="control my-0">
                    <label for="city" class="label help my-0 py-2">Ville:</label>
                    <div class="select is-fullwidth" id="city">
                      <select name="city" :disabled="!readonly" required v-model="city">
                        <option class="py-3" value disabled>Ville</option>
                        <option
                          class="py-3"
                          v-for="city in cities"
                          :key="city"
                          :value="city"
                        >{{city}}</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <p class="has-text-right mt-2" v-if="readonly">
                <b-button
                  icon-right="check"
                  class="is-primary is-outlined"
                  @click="accountUpdateHandler()"
                >Enregistrer les modifications</b-button>
              </p>
            </div>
          </b-step-item>
        </template>
        <template>
          <b-step-item
            step="3"
            :clickable="currentLevel >= 2 ? true: false"
            :icon="account.isAccountValidated==='Validé' ? 'check': 'circle'"
            key="validation"
            label="Compte validé"
          >
            <div class="box">
              <div v-if="account.isAccountValidated === 'Validé'">
                <div class="block has-text-centered has-text-success">
                  <h2 class>
                    Félicitations! &nbsp;
                    <b-icon icon="check"></b-icon>
                  </h2>
                  <p
                    class="help"
                  >Votre compte a été approuvé. Veuillez-vous rediriger à la page crédit pour effectuer vos opérations de demande.</p>
                </div>
              </div>
              <div v-else>
                <p class="has-text-centered">
                  Statut du compte:&nbsp;
                  <b-tag size="is-large">{{ account.isAccountValidated }}</b-tag>
                </p>
              </div>
            </div>
          </b-step-item>
        </template>
      </b-steps>
    </div>
  </div>
</template>

<script>
import "vue-tel-input/dist/vue-tel-input.css";
import { VueTelInput } from "vue-tel-input";

export default {
  layout: "account",
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
      expandOnHover: false,
      mobile: "reduce",
      reduce: false,
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
      activeStep: undefined,
      currentLevel: 0,
    };
  },
  fetch() {},
  mounted() {
    this.readonly = true;
    this.name = this.account.name;
    this.tel = this.account.tel;
    this.email = this.account.email;
    this.city = this.account.city;

    if (this.account.isAccountValidated === "" && this.account.isEmailVerified)
      this.currentLevel = 1;
    else if (this.account.isAccountValidated === "En attente")
      this.currentLevel = 2;
    else this.currentLevel = 0;
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
        if (res.message) await this.$fetch();
        this.reset();
      } catch (err) {
        this.error = err.response.data
          ? err.response.data.message
          : "Erreur technique!";
        this.openNotification();
      }
    },
    reset() {
      this.modal = false;
      this.error = "";
      this.readonly = true;
      this.oldPWD = "";
      this.pwd = "";
      this.confirmedPWD = "";
      this.id = {};
      this.codc = {};
      this.wcard = {};
      this.name = this.account.name;
      this.tel = this.account.tel;
      this.email = this.account.email;
      this.city = this.account.city;
      if (
        this.account.isAccountValidated === "" &&
        this.account.isEmailVerified
      )
        this.currentLevel = 1;
      else if (this.account.isAccountValidated === "En attente")
        this.currentLevel = 2;
      else this.currentLevel = 0;
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
        this.openNotification();
        return;
      }
      if (this.pwd !== this.confirmedPWD) {
        this.error = "Mots de passe différents";
        this.openNotification();
        return;
      }
      if (this.oldPWD === "" && this.pwd !== "") {
        this.error = "Ancien mot de passe requis";
        this.openNotification();
        return;
      }
      let formData = new FormData();
      if (this.id.name) {
        const errMsg = this.verifyfile(this.id);
        if (errMsg) {
          this.error = errMsg;
          this.openNotification();
          return;
        }
        formData.append("papers", this.id);
      }
      if (this.wcard.name) {
        const errMsg = this.verifyfile(this.wcard);
        if (errMsg) {
          this.error = errMsg;
          this.openNotification();
          return;
        }
        formData.append("papers", this.wcard);
      }
      if (this.codc.name) {
        const errMsg = this.verifyfile(this.codc);
        if (errMsg) {
          this.error = errMsg;
          this.openNotification();
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

<style lang="scss">
.p-1 {
  padding: 1em;
}
.sidebar-page {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
  // min-height: 100vh;
  .sidebar-layout {
    display: flex;
    flex-direction: row;
    min-height: 100%;
    // min-height: 100vh;
  }
}
@media screen and (max-width: 1023px) {
  .b-sidebar {
    .sidebar-content {
      &.is-mini-mobile {
        &:not(.is-mini-expand),
        &.is-mini-expand:not(:hover) {
          .menu-list {
            li {
              a {
                span:nth-child(2) {
                  display: none;
                }
              }
              ul {
                padding-left: 0;
                li {
                  a {
                    display: inline-block;
                  }
                }
              }
            }
          }
          .menu-label:not(:last-child) {
            margin-bottom: 0;
          }
        }
      }
    }
  }
}
@media screen and (min-width: 1024px) {
  .b-sidebar {
    .sidebar-content {
      &.is-mini {
        &:not(.is-mini-expand),
        &.is-mini-expand:not(:hover) {
          .menu-list {
            li {
              a {
                span:nth-child(2) {
                  display: none;
                }
              }
              ul {
                padding-left: 0;
                li {
                  a {
                    display: inline-block;
                  }
                }
              }
            }
          }
          .menu-label:not(:last-child) {
            margin-bottom: 0;
          }
        }
      }
    }
  }
}
.is-mini-expand {
  .menu-list a {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>