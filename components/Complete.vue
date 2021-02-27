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
    <section>
      <div v-if="this.$auth.user.isAccountValidated !== 'Validé'" class="field mt-1 mb-0">
        <div class="control">
          <label for="files" class="label help">Informations professionnelles:</label>
          <b-upload v-model="dropFiles" multiple drag-drop expanded :disabled="!readonly">
            <section class="section py-2">
              <div class="content has-text-centered">
                <p>
                  <b-icon icon="upload" size="is-large"></b-icon>
                </p>
                <p>Cliquez pour charger ou glisser-déposez les fichers suivants:</p>
                <p class="help has-text-centered mt-0 pt-0 mb-3">
                  <b-icon icon="info-circle"></b-icon>&nbsp; Format: PDF/Image, Taille Max: 4M par fichier
                </p>
                <p class="help label has-text-left">
                  <span>1. Copie de CNIB/Passeport</span>
                  <br />
                  <span>2. Carte de travailleur</span>
                  <br />
                  <span>3. Attestation de prise de service</span>
                </p>
              </div>
            </section>
          </b-upload>
        </div>
      </div>
      <div class="tags">
        <span v-for="(file, index) in dropFiles" :key="index" class="tag is-primary">
          {{file.name}}
          <button class="delete is-small" type="button" @click="deleteDropFile(index)"></button>
        </span>
      </div>
    </section>

    <ul class="my-5" v-if="!readonly">
      <li class="columns m-0 p-0 is-mobile list-item mt-4">
        <div class="column m-0 py-0 px-1 has-text-weight-bold">CNIB/Passeport:</div>
        <div class="column m-0 py-0 px-1">
          <a :target="target" :href="idUri">
            <b-icon icon="link" />Visualiser
          </a>
        </div>
      </li>
      <li class="columns m-0 p-0 is-mobile list-item mt-1">
        <div class="column m-0 py-0 px-1 has-text-weight-bold">Carte de travailleur:</div>
        <div class="column m-0 py-0 px-1">
          <a :target="target" :href="wcardUri">
            <b-icon icon="link" />Visualiser
          </a>
        </div>
      </li>
      <li class="columns m-0 p-0 is-mobile mt-1">
        <div class="column m-0 py-0 px-1 has-text-weight-bold">Att. Prise de service:</div>
        <div class="column m-0 py-0 px-1">
          <a :target="target" :href="codcUri">
            <b-icon icon="link" />Visualiser
          </a>
        </div>
      </li>
    </ul>
    <div class="field">
      <label for="city" class="help label">Ville:</label>
      <b-select icon="city" v-model="city" expanded :disabled="!readonly" placeholder="Ville">
        <option
          v-for="(item, i) in cities"
          :value="item"
          :key="i"
          :selected="item === account.city"
        >{{ item }}</option>
      </b-select>
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
export default {
  layout: "account",
  data() {
    return {
      dropFiles: [],
      error: "",
      readonly: false,
      city: this.$auth.user.city,
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
  fetch() {
    this.city = this.account.city;
  },
  methods: {
    deleteDropFile(index) {
      this.dropFiles.splice(index, 1);
    },
    async accountUpdateHandler() {
      if (
        this.dropFiles.length !== 3 &&
        this.account.isAccountValidated !== "Validé"
      ) {
        this.error = "Veuillez charger touts les 3 fichiers requis";
        return;
      }
      if (
        this.account.isAccountValidated !== "Validé" &&
        (!(
          this.dropFiles[0].type.includes("image/") ||
          this.dropFiles[0].type.includes("pdf")
        ) ||
          !this.dropFiles[0].size > 4194304 ||
          !(
            this.dropFiles[1].type.includes("image/") ||
            this.dropFiles[1].type.includes("pdf")
          ) ||
          !this.dropFiles[1].size > 4194304 ||
          !(
            this.dropFiles[2].type.includes("image/") ||
            this.dropFiles[2].type.includes("pdf")
          ) ||
          !this.dropFiles[2].size > 4194304)
      ) {
        this.error = "Format supporté: Image et PDF, taille Max: 4M";
        return;
      }
      if (this.city === "") {
        this.error = "Veuillez sélectionner votre ville.";
        return;
      }
      let formData = new FormData();

      if (this.account.isAccountValidated !== "Validé") {
        this.dropFiles.map((file) => {
          formData.append("papers", file);
        });
      }

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
          "/api/auth/updatedossier",
          formData,
          config
        );
        if (res.message) {
          this.dropFiles = [];
          await this.$auth.fetchUser();
          this.error = "";
          this.city = this.$auth.user.city;
          this.readonly = false;
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