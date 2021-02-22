<template>
  <section class="section">
    <div class="columns is-centered">
      <div class="column is-6-desktop is-8-tablet pt-6">
        <Profile />
        <hr />
        <Complete />
        <hr />
        <Security />
        <!-- <b-steps type="is-twitter" :has-navigation="false" v-model="activeStep" class="mb-5">
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
        </b-steps>-->
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
  methods: {
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