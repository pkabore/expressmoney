<template>
  <form class="mt-6" method="POST" @submit.prevent="submitHandler">
    <p class="help is-danger has-text-centered">{{ error }}</p>
    <b-field>
      <b-upload
        v-model="dropFiles"
        multiple
        drag-drop
        id="files"
        ref="files"
        @change="handleFilesUpload()"
      >
        <section class="section">
          <div class="content has-text-centered">
            <p class="my-0 py-1">
              <b-icon icon="upload" size="is-large"> </b-icon>
            </p>
            <p class="my-0 py-1">
              Veuillez charger les 3 fichiers suivants en format PDF ou Image:
            </p>
            <p class="help has-text-left is-primary my-0">1. CNIB/Passeport</p>
            <p class="help has-text-left is-primary my-0">
              2. Carte de travailleur
            </p>
            <p class="help has-text-left is-primary my-0">
              3. Attestation de prise de service
            </p>
          </div>
        </section>
      </b-upload>
    </b-field>
    <div class="field">
      <div class="tags">
        <span
          v-for="(file, index) in dropFiles"
          :key="index"
          class="tag is-primary"
        >
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
          <select name="city" required>
            <option class="py-3" value="">Ville</option>
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
        <label class="help is-black" for="rib">Numéro RIB:</label>
        <input
          class="mt-0 input"
          id="rib"
          type="text"
          required="required"
          placeholder="Numéro RIB"
          name="rib"
        />
        <label class="help is-black" for="pass"
          >Entrez votre mot de passe:</label
        >
        <input
          class="mt-0 input"
          id="pass"
          type="password"
          required="required"
          placeholder="Mot de passe"
          name="pwd"
        />
      </div>
    </div>
    <div class="field">
      <button class="button is-primary is-fullwidth" type="submit">
        Envoyer
      </button>
    </div>
  </form>
</template>

<script>
export default {
  data() {
    return {
      dropFiles: [],
      files: "",
      error: ""
    };
  },
  methods: {
    deleteDropFile(index) {
      this.dropFiles.splice(index, 1);
    },
    handleFilesUpload() {
      this.files = this.$refs.files.files;
    },
    async submitHandler() {
      /*
          Initialize the form data
        */
      const csrf = await this.$axios.$get("/api/auth/csrf");
      const config = {
        headers: {
          "XSRF-TOKEN": csrf.token,
          "Content-Type": "multipart/form-data"
        }
      };
      this.$axios.setHeader("XSRF-TOKEN", csrf.token);
      let formData = new FormData();

      /*
          Iterate over any file sent over appending the files
          to the form data.
        */
      for (var i = 0; i < this.files.length; i++) {
        let file = this.files[i];

        formData.append("files[" + i + "]", file);
      }

      /*
          Make the request to the POST /multiple-files URL
        */
      this.$axios
        .post("/api/complete", formData, config)
        .then(function() {
          console.log("SUCCESS!!");
          this.$route.push("/operations");
        })
        .catch(e => {
          this.error = e.response.data.message;
        });
    }
  }
};
</script>
