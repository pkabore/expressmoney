<template>
  <div>
    <p class="has-text-primary has-text-weight-bold">2. Informations professionnelles</p>
    <p class="has-text-right has-text-primary is-family-secondary">
      <b-button
        icon-left="pen"
        outlined
        size="is-small"
        class="my-2"
        type="is-primary"
        @click="readonly = !readonly"
      >Modifier</b-button>
    </p>
    <p class="has-text-centered help is-danger">{{error}}</p>
    <section>
      <div class="field mt-1 mb-0">
        <div class="control">
          <label for="files" class="label help">Informations professionnelles:</label>
          <b-upload v-model="dropFiles" multiple drag-drop expanded :disabled="!readonly">
            <section class="section py-2">
              <div class="content has-text-centered">
                <p>
                  <b-icon icon="upload" size="is-large"></b-icon>
                </p>
                <p>Cliquez pour charger les fichers suivants ou les glisser-déposer:</p>
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
    <div class="field my-0">
      <div class="control my-0">
        <label for="city" class="label help my-0 py-2">Ville:</label>
        <div class="select is-fullwidth" id="city">
          <select name="city" :disabled="!readonly" required v-model="city">
            <option class="py-3" value disabled>Ville</option>
            <option class="py-3" v-for="city in cities" :key="city" :value="city">{{city}}</option>
          </select>
        </div>
      </div>
    </div>
    <p class="has-text-right mt-2" v-if="readonly">
      <b-button
        icon-right="check"
        class="is-primary is-fullwidth is-outlined"
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
    deleteDropFile(index) {
      this.dropFiles.splice(index, 1);
    },
    async accountUpdateHandler() {
      if (this.dropFiles.length !== 3) {
        this.error = "Veuillez charger touts les 3 fichiers requis";
        return;
      }
      if (
        !(
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
        !this.dropFiles[2].size > 4194304
      ) {
        this.error = "Format supporté: Image et PDF, taille Max: 4M";
        return;
      }
      if (this.city === "") {
        this.error = "Veuillez sélectionner votre ville.";
        return;
      }
      let formData = new FormData();

      this.dropFiles.map((file) => {
        formData.append("papers", file);
      });
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