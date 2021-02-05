<template>
  <section class="section mt-3 pt-4">
    <h1 class="has-text-centered title mt-3">Complétion de dossier</h1>
    <div class="columns is-centered">
      <div class="column is-6-desktop is-8-tablet">
        <p class="help is-danger has-text-centered mb-0">{{ error }}</p>
        <form autocomplete="off" class="mt-2" method="POST" @submit.prevent="submitHandler">
          <div class="field">
            <b-upload v-model="dropFiles" multiple drag-drop class="drag-and-drop-field">
              <div class="content has-text-centered">
                <p class="my-0 py-1">
                  <b-icon icon="upload" size="is-large"></b-icon>
                </p>
                <p
                  class="my-0 py-1"
                >Veuillez cliquer ici pour charger les 3 fichiers suivants (Format PDF ou Photo):</p>
                <p class="help has-text-left is-primary my-0">1. CNIB/Passeport</p>
                <p class="help has-text-left is-primary my-0">2. Carte de travailleur</p>
                <p class="help has-text-left is-primary my-0">3. Attestation de prise de service</p>
              </div>
            </b-upload>
          </div>
          <div class="field">
            <div class="tags">
              <span v-for="(file, index) in dropFiles" :key="index" class="tag is-primary">
                {{ file.name }}
                <button
                  class="delete is-small"
                  type="button"
                  @click="deleteDropFile(index)"
                ></button>
              </span>
            </div>
          </div>
          <div class="field">
            <div class="control mx-1">
              <label class="help is-black" for="city">Ville:</label>
              <div class="select is-fullwidth" id="city">
                <select name="city" required v-model="city">
                  <option class="py-3" value>Ville</option>
                  <option class="py-3" value="Ouagadougou">Ouagadougou</option>
                  <option class="py-3" value="Bobo Dioulasso">Bobo Dioulasso</option>
                  <option class="py-3" value="Banfora">Banfora</option>
                  <option class="py-3" value="Koudougou">Koudougou</option>
                  <option class="py-3" value="Kaya">Kaya</option>
                  <option class="py-3" value="Dori">Dori</option>
                  <option class="py-3" value="Fada N'Gourma">Fada N'Gourma</option>
                  <option class="py-3" value="Po">Po</option>
                </select>
              </div>
              <label class="help is-black" for="pass">Entrez votre mot de passe:</label>
              <input
                class="mt-0 input"
                id="pass"
                type="password"
                required="required"
                placeholder="Mot de passe"
                name="pwd"
                v-model="pwd"
              />
            </div>
          </div>
          <div class="field">
            <button class="button is-primary is-fullwidth is-radiusless" type="submit">Envoyer</button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  head: {
    title: "Dossier",
    meta: [
      {
        hid: "description",
        name: "description",
        content:
          "Compléter vos informations professionnelles. La dernière étape pour commencer à utiliser le platforme.",
      },
    ],
  },
  data() {
    return {
      dropFiles: [],
      files: "",
      error: "",
      rib: "",
      city: "",
      pwd: "",
    };
  },
  methods: {
    deleteDropFile(index) {
      this.dropFiles.splice(index, 1);
    },
    async submitHandler() {
      const csrf = await this.$axios.$get("/api/auth/csrf");
      const config = {
        headers: {
          "XSRF-TOKEN": csrf.token,
          "Content-Type": "multipart/form-data",
        },
      };
      let formData = new FormData();
      const len = this.dropFiles.length;
      if (len !== 3) {
        this.error = "Veuillez charger touts les fichiers requis";
        return;
      }

      this.dropFiles.map((file) => {
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
      });

      for (let i = 0; i < 3; i++) {
        formData.append("papers", this.dropFiles[i]);
      }
      formData.append("city", this.city);
      formData.append("rib", this.rib);
      formData.append("pwd", this.pwd);

      try {
        await this.$axios.post("/api/complete", formData, config);
        await this.$auth.fetchUser();
        this.$router.push("/operations");
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