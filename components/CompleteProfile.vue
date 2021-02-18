<template>
  <div>
    <h1 class="has-text-centered title mt-3">Compléter mon profil</h1>
    <div class="columns is-centered">
      <div class="column is-6-desktop is-8-tablet">
        <p class="help is-danger has-text-centered mb-0">{{ error }}</p>
        <form autocomplete="off" class="mt-2" method="POST" @submit.prevent="submitHandler">
          <p
            class="label help has-text-grey-dark has-text-centered"
          >(Format: PDF/Image, Taille Max: 4M par fichier)</p>
          <div class="field my-0 py-0 columns">
            <label for="id" class="column label help my-0 py-2">Copie de CNIB/Passeport:</label>
            <input type="file" class="column my-0 py-2" @change="upload($event, 'id')" id="id" />
          </div>
          <div class="field my-0 py-0 columns">
            <label for="wcard" class="column label help my-0 py-2">Carte de travailleur:</label>
            <input
              type="file"
              class="column my-0 py-2"
              id="wcard"
              @change="upload($event, 'wcard')"
            />
          </div>
          <div class="field my-0 py-0 columns">
            <label for="codc" class="column label help my-0 py-2">Attestation de prise de service:</label>
            <input type="file" class="column my-0 py-2" id="codc" @change="upload($event, 'codc')" />
          </div>
          <div class="field">
            <div class="control">
              <label class="help is-black" for="city">Ville:</label>
              <div class="select is-fullwidth" id="city">
                <select name="city" required v-model="city">
                  <option class="py-3" disabled>Ville</option>
                  <option class="py-3" v-for="city in cities" :key="city" :value="city">{{city}}</option>
                </select>
              </div>
            </div>
          </div>
          <div class="field">
            <p class="has-text-right">
              <button class="button is-primary is-fullwidth" type="submit">
                Compléter
                &nbsp;&nbsp;
                <b-icon icon="check"></b-icon>
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: {},
      wcard: {},
      codc: {},
      files: "",
      error: "",
      rib: "",
      city: "",
      pwd: "",
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
    upload(event, filename) {
      if (filename === "id") this.id = event.target.files[0];
      if (filename === "wcard") this.wcard = event.target.files[0];
      if (filename === "codc") this.codc = event.target.files[0];
    },
    async submitHandler() {
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
      formData.append("city", this.city);
      try {
        const csrf = await this.$axios.$get("/api/auth/csrf");
        const config = {
          headers: {
            "XSRF-TOKEN": csrf.token,
            "Content-Type": "multipart/form-data",
          },
        };
        await this.$axios.post("/api/complete", formData, config);
        await this.$auth.fetchUser();
        this.$buefy.notification.open({
          duration: 5000,
          message: `Dossier envoyé avec <b>succès</b>. Il ne reste que l'approbation du Service client d'Express Money avant de donner l'accès au service de demande de crédit.`,
          position: "is-top-right",
          type: "is-success",
          hasIcon: true,
        });
        this.$router.push("/credit");
      } catch (error) {
        this.error = error.response.data.message;
      }
    },
  },
};
</script>


<style scoped>
.drag-and-drop-field,
div.upload-draggable.is-primary {
  display: block;
  width: 100% !important;
}
</style>