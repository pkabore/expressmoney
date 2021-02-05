<template>
  <div>
    <section class="section">
      <h1 class="title has-text-centered is-size-6-mobile">Mes opérations</h1>
      <p class="has-text-centered mb-3" v-if="account.isAccountValidated === 'Validé'">
        <b-button
          tag="nuxt-link"
          to="/request"
          type="is-success"
          class="is-block is-radiusless"
        >Cliquez ici pour une demande de crédit</b-button>
      </p>
      <div class="columns" v-if="account.isAccountValidated === 'Validé'">
        <div class="column mx-0" v-if="isLoading">
          <h2 class="subtitle has-text-centered">Chargement en cours ...</h2>
        </div>
        <div class="column" v-if="!isLoading">
          <b-table
            :data="operations"
            striped
            narrowed
            hoverable
            paginated
            :per-page="perPage"
            pagination-rounded
            default-sort="createdAt"
            default-sort-direction="desc"
            :loading="isLoading"
          >
            <b-table-column
              field="id"
              label="ID"
              width="40"
              sortable
              numeric
              v-slot="props"
            >{{ props.row.id }}</b-table-column>

            <b-table-column
              field="rname"
              label="Nom du Receveur"
              sortable
              v-slot="props"
            >{{ props.row.rname }}</b-table-column>

            <b-table-column
              field="rnumber"
              label="Numéro du Receveur"
              sortable
              v-slot="props"
            >{{ props.row.rnumber }}</b-table-column>

            <b-table-column
              field="amount"
              label="Montant"
              sortable
              v-slot="props"
            >{{ props.row.amount + ' FCFA'}}</b-table-column>

            <b-table-column
              field="devise"
              label="Frais"
              sortable
              v-slot="props"
            >{{ (props.row.fees) + ' FCFA' }}</b-table-column>

            <b-table-column field="status" label="Statut" sortable v-slot="props">
              <span
                v-if="props.row.status === 'Réussi'"
                class="tag is-success"
              >{{ props.row.status }}</span>
              <span
                v-if="props.row.status === 'En cours'"
                class="tag is-info"
              >{{ props.row.status }}</span>
              <span
                v-if="props.row.status === 'Échoué'"
                class="tag is-danger"
              >{{ props.row.status }}</span>
            </b-table-column>
            <b-table-column field="actions" label="Actions" sortable v-slot="props">
              <div v-if="props.row.status === 'En cours'">
                <button class="button is-small is-primary" @click.prevent="openModal(props.row.id)">
                  <b-icon icon="pen" />&nbsp;&nbsp;
                  Editer
                </button>
              </div>
            </b-table-column>
            <b-table-column
              field="createdAt"
              label="Date"
              sortable
              centered
              v-slot="props"
            >{{ new Date(props.row.createdAt).toLocaleString('fr-FR') }}</b-table-column>
          </b-table>
        </div>
      </div>
      <div v-if="account.isAccountValidated === ''" class="columns is-centered mt-6 pt-4">
        <div class="column is-half-desktop is-10-tablet">
          <div class="notification is-success is-light">
            <h2 class="subtitle has-text-centered">
              Félicitations
              <b-icon size="is-small" icon="check-circle" />
            </h2>
            <p>
              Merci d'avoir créé votre compte chez Express Money.
              <br />Pour effectuer une demande de crédit, veuillez completer les informations nécessaires.
              <br />Express Money vous remercie pour votre confiance.
            </p>
          </div>
          <p class="has-text-centered">
            <NuxtLink
              to="/complete"
              class="is-info is-block is-radiusless button"
            >Compléter mes informations</NuxtLink>
          </p>
        </div>
      </div>
      <div v-if="account.isAccountValidated === 'En attente'" class="columns is-centered mt-6 pt-4">
        <div class="column is-half-desktop is-10-tablet">
          <div class="notification is-info is-light">
            <h2 class="subtitle has-text-centered">
              <b-icon size="is-small" icon="spinner" />&nbsp; Votre compte est en cours de vérification
            </h2>
            <p>
              La durée habituelle de vérification peut aller jusqu'à 20min.
              <br />Une fois votre compte vérifié cette page sera mise à jour.
              <br />Express Money vous remercie pour votre confiance.
            </p>
          </div>
          <b-message type="is-warning">
            <NuxtLink
              to="/complete"
            >Pendant que votre compte n'est pas encore approuvé vous pouvez mettre à jour votre dossier si nécessaire.</NuxtLink>
          </b-message>
        </div>
      </div>
    </section>
    <div :class="['modal', {'is-active': modal}]">
      <div class="modal-background"></div>
      <div class="card is-radiusless">
        <header class="card-header">
          <p class="card-header-title has-text-centered">Editer la demande</p>
        </header>
        <section class="card-content">
          <form autocomplete="off" class="mt-4" method="POST" @submit.prevent="editRequest">
            <p class="help is-danger has-text-centered">{{ error }}</p>
            <b-message type="is-warning" class="my-0 is-size-7">
              <b-icon icon="info-circle" size="is-small" />Note importante: Il s'agit ici de renseigner le nom et le prénom
              qui ont identifié le numéro Orange Money que vous allez renseigner
            </b-message>
            <br />
            <div class="columns my-0 py-0">
              <div class="column my-0 py-0">
                <div class="field my-0">
                  <label for="rfname" class="label help py-0 my-0">Prénom du Receveur:</label>
                  <input
                    class="input"
                    v-model="updateOperation.rfname"
                    type="text"
                    id="rfname"
                    name="rfname"
                  />
                </div>
              </div>
              <div class="column my-0 py-0">
                <div class="field my-0">
                  <label for="rlname" class="label help py-0 my-0">Nom du Receveur:</label>
                  <input
                    class="input"
                    v-model="updateOperation.rlname"
                    type="text"
                    id="rlname"
                    name="rlname"
                  />
                </div>
              </div>
              <div class="column my-0 py-0">
                <div class="field my-0">
                  <label for="rnumber" class="label help py-0 my-0">Numéro Orange Money du Receveur:</label>
                  <input
                    class="input"
                    v-model="updateOperation.rnumber"
                    type="tel"
                    id="rnumber"
                    name="rnumber"
                  />
                </div>
              </div>
            </div>
            <div class="columns my-0 py-0">
              <div class="column">
                <div class="field my-0">
                  <label for="amount" class="label help py-0 my-0">Montant en FCFA:</label>
                  <input
                    class="input"
                    v-model="updateOperation.amount"
                    placeholder="10000"
                    type="number"
                    step="500"
                    id="amount"
                    name="amount"
                  />
                </div>
              </div>
            </div>
            <div class="columns">
              <div class="column">
                <div class="field my-0">
                  <label for="pwd" class="label help py-0 my-0">Confirmez votre mot de passe:</label>
                  <input
                    class="input"
                    v-model="updateOperation.pwd"
                    type="password"
                    id="pwd"
                    name="pwd"
                  />
                </div>
              </div>
            </div>
          </form>
        </section>
        <footer class="card-footer">
          <a href="#" class="card-footer-item has-text-danger" @click.prevent="modal = !modal">
            <b-icon icon="times"></b-icon>&nbsp; Annuler
          </a>
          <a
            href="#"
            class="card-footer-item has-text-primary"
            @click.prevent="updateOperationHandler()"
          >
            <b-icon icon="save"></b-icon>&nbsp; Mettre à jour
          </a>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  head: {
    title: "Opérations",
    meta: [
      {
        hid: "description",
        name: "description",
        content: "Prendre un crédit pour soi-même ou pour un(e) bénéficiaire.",
      },
    ],
  },
  data() {
    return {
      modal: false,
      operations: [],
      updateOperation: {},
      perPage: 5,
      isLoading: true,
      error: "",
    };
  },
  async fetch() {
    if (this.account.isAccountValidated === "Suppression") return;
    try {
      const response = await this.$axios.$get(`/api/operations`);
      this.operations = response.map((operation, id) => {
        operation.id = id + 1;
        return operation;
      });
      this.isLoading = false;
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    openModal(id) {
      id = parseInt(id) - 1;
      if (id < 0 || id >= this.operations.length) return;
      const updateOperation = this.operations[id];
      const rlname = updateOperation.rname.split(" ")[1];
      const rfname = updateOperation.rname.split(" ")[0];
      const rnumber = updateOperation.rnumber;
      const amount = updateOperation.amount;
      const _id = updateOperation._id;
      const pwd = "";
      this.updateOperation = {
        _id,
        rlname,
        rfname,
        rnumber,
        amount,
        pwd,
      };
      this.modal = true;
    },
    async updateOperationHandler() {
      try {
        const csrf = await this.$axios.$get("/api/auth/csrf");
        this.$axios.setHeader("XSRF-TOKEN", csrf.token);
        const response = await this.$axios.$put(
          "/api/operations/" + this.updateOperation._id,
          { data: this.account }
        );
        if (response.message) {
          this.modal = false;
          this.$fetch();
        }
      } catch (err) {
        this.error = err.response.data.message;
      }
    },
  },
  computed: {
    isAuthenticated() {
      return this.$auth.loggedIn;
    },
    account() {
      return this.$auth.user;
    },
  },
};
</script>