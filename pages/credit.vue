<template>
  <div class="section">
    <div class="columns is-centered" v-if="account.isAccountValidated === 'Validé'">
      <div class="column">
        <h1 class="title has-text-centered mt-2">Mes opérations</h1>
        <p class="has-text-centered mb-3">
          <b-button tag="nuxt-link" to="/request" type="primary" class="is-success label">
            <b-icon icon="pencil" />&nbsp;&nbsp;
            Cliquez ici pour une demande de crédit
          </b-button>
        </p>
        <div v-if="isLoading">
          <h2 class="subtitle has-text-centered">Chargement en cours ...</h2>
        </div>
        <div v-if="!isLoading">
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
                class="tag is-light is-success"
              >{{ props.row.status }}</span>
              <span
                v-if="props.row.status === 'En cours'"
                class="tag is-light is-info"
              >{{ props.row.status }}</span>
              <span
                v-if="props.row.status === 'Décliné'"
                class="tag is-light is-danger"
              >{{ props.row.status }}</span>
              <span v-if="props.row.status === 'Payé'" class="tag is-success">{{ props.row.status }}</span>
            </b-table-column>
            <b-table-column field="actions" label="Modifier" sortable v-slot="props">
              <div v-if="props.row.status === 'En cours'">
                <button class="button is-small is-primary" @click.prevent="openModal(props.row.id)">
                  <b-icon icon="pen" />&nbsp;&nbsp;
                  Modifier
                </button>
              </div>
            </b-table-column>
            <b-table-column field="actions" label="Annuler" sortable v-slot="props">
              <div v-if="props.row.status === 'En cours'">
                <button
                  class="button is-small is-danger"
                  @click.prevent="openDeletionModal(props.row.id)"
                >
                  <b-icon icon="trash" />&nbsp;&nbsp;
                  Annuler
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
    </div>
    <div
      v-else-if="account.isAccountValidated === '' && account.accountRegistrationCode !== ''"
      class="columns is-centered mt-6 pt-4"
    >
      <div class="column is-half-desktop is-10-tablet">
        <div class="notification is-success is-light">
          <h2 class="subtitle has-text-centered">
            Félicitations
            <b-icon size="is-small" icon="check-circle" />
          </h2>
          <p>
            Merci d'avoir créé votre compte chez Express Money.
            <br />Un lien de confirmation a été envoyé à votre adress email
            <strong>{{ account.email }}</strong>. Veuillez consulter votre boîte mail pour valider votre compte.
          </p>
        </div>
        <hr />
        <p class="has-text-centered">
          <NuxtLink
            to="/complete"
            class="is-success is-block is-radiusless button is-outlined"
          >Compléter mes informations</NuxtLink>
        </p>
      </div>
    </div>
    <div
      v-else-if="account.isAccountValidated === '' && account.accountRegistrationCode === ''"
      class="columns is-centered mt-6 pt-4"
    >
      <div class="column is-half-desktop is-10-tablet">
        <div class="notification is-link-light">
          <h2 class="subtitle has-text-centered has-text-primary">
            <b-icon size="is-small" icon="check" />&nbsp; Félicitations
          </h2>
          <p class="has-text-centered">
            Vous avez terminé votre inscription. Pour faire votre premier emprunt, veuillez
            <NuxtLink
              class="has-text-primary has-text-weight-bold has-text-decoration-none"
              to="/complete"
            >cliquer ici pour continuer</NuxtLink>
          </p>
          <hr />
          <p class="has-text-centered mt-3">
            <NuxtLink to="/complete" class="is-block is-primary button">
              <b-icon icon="pen" class="has-text-white my-0"></b-icon>&nbsp;
              Compléter mes informations
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
    <div :class="['modal', {'is-active': updateModal}]">
      <div class="modal-background"></div>
      <div class="card larger is-radiusless p-2">
        <h2 class="has-text-centered has-text-weight-bold subtitle mt-3">Editer la demande</h2>
        <form autocomplete="off" class="mt-4" method="POST" @submit.prevent="editRequest">
          <p class="help is-danger has-text-centered">{{ error }}</p>
          <b-message type="is-warning help" size="is-small" class="my-0 py-0">
            Note importante: Il s'agit ici de renseigner le nom et le prénom
            qui ont identifié le numéro Orange Money que vous allez renseigner.
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
        <footer class="card-footer">
          <a
            href="#"
            class="card-footer-item has-text-danger"
            @click.prevent="updateModal = !updateModal"
          >
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
    <div :class="['modal', {'is-active': deletionModal}]">
      <div class="modal-background"></div>
      <div class="card larger is-radiusless">
        <header class="card-header">
          <p
            class="card-header-title has-text-centered has-text-danger"
          >Attention! Voulez-vous supprimer cette opération ?</p>
        </header>
        <section class="card-content">
          <p class="class help is-danger has-text-centered">{{ error }}</p>
          <ul class="is-hoverable">
            <li class="columns m-0 p-0 is-mobile list-item mt-1">
              <div class="column m-0 py-0 px-2 has-text-weight-bold">Nom du Receveur:</div>
              <div class="column m-0 py-0 px-2">{{ updateOperation.rname }}</div>
            </li>
            <li class="columns m-0 p-0 is-mobile list-item mt-1">
              <div class="column m-0 py-0 px-2 has-text-weight-bold">Numéro du Receveur:</div>
              <div class="column m-0 py-0 px-2">{{ updateOperation.rnumber }}</div>
            </li>
            <li class="columns m-0 p-0 is-mobile list-item mt-1">
              <div class="column m-0 py-0 px-2 has-text-weight-bold">Montant:</div>
              <div class="column m-0 py-0 px-2">{{ updateOperation.amount }} FCFA</div>
            </li>
            <li class="columns m-0 p-0 is-mobile mt-1">
              <div class="column m-0 py-0 px-2 has-text-weight-bold">Status:</div>
              <div class="column m-0 py-0 px-2">
                <b-tag
                  v-if="updateOperation.status === 'En cours'"
                  type="is-primary"
                >{{ updateOperation.status }}</b-tag>
                <b-tag
                  v-else-if="updateOperation.status === 'Réussi'"
                  type="is-success"
                >{{ updateOperation.status }}</b-tag>
                <b-tag
                  v-else-if="updateOperation.status === 'Décliné'"
                  type="is-primary"
                >{{ updateOperation.status }}</b-tag>
                <b-tag v-else>{{ updateOperation.status }}</b-tag>
              </div>
            </li>
            <li class="columns m-0 p-0 is-mobile list-item mt-4">
              <div class="column m-0 py-0 px-2 has-text-weight-bold">Date de création:</div>
              <div
                class="column m-0 py-0 px-2"
              >{{ new Date(updateOperation.createdAt).toLocaleString('fr-FR') }}</div>
            </li>
            <li class="columns m-0 p-0 is-mobile mt-1">
              <div class="column m-t py-0 px-2 has-text-weight-bold">Dernière mise à Jour:</div>
              <div
                class="column m-t mb-4 py-0 px-2"
              >{{ new Date(updateOperation.updatedAt).toLocaleString('fr-FR') }}</div>
            </li>
          </ul>
          <div class="field">
            <div class="control">
              <p class="label help" for="pass">Veuillez confirmer votre mot de passe:</p>
              <input class="input" id="pass" type="password" v-model="updateOperation.pwd" />
            </div>
          </div>
        </section>
        <footer class="card-footer">
          <a
            href="#"
            class="card-footer-item has-text-primary"
            @click.prevent="deletionModal = !deletionModal"
          >
            <b-icon icon="times"></b-icon>&nbsp; Abandonner
          </a>
          <a href="#" class="card-footer-item has-text-danger" @click.prevent="cancelOperation()">
            <b-icon icon="trash"></b-icon>&nbsp; Supprimer
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
      updateModal: false,
      deletionModal: false,
      operations: [],
      updateOperation: {},
      perPage: 5,
      isLoading: true,
      isLoadingFullPage: false,
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
      this.error = "";
      id = parseInt(id) - 1;
      if (id < 0 || id >= this.operations.length) return;
      const updateOperation = this.operations[id];
      const rlname = updateOperation.rname.split(" ").slice(1).join(" ");
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
      this.updateModal = true;
    },
    openDeletionModal(id) {
      this.error = "";
      id = parseInt(id) - 1;
      if (id < 0 || id >= this.operations.length) return;
      this.updateOperation = this.operations[id];
      this.updateOperation.pwd = "";
      this.deletionModal = true;
    },
    async updateOperationHandler() {
      if (this.updateOperation.pwd === "") {
        this.error = "Veuillez confirmer votre mot de passe!";
        return;
      }
      try {
        const csrf = await this.$axios.$get("/api/auth/csrf");
        this.$axios.setHeader("XSRF-TOKEN", csrf.token);
        const response = await this.$axios.$put(
          "/api/operations/" + this.updateOperation._id,
          this.updateOperation
        );
        if (response.message) {
          this.updateModal = false;
          this.$fetch();
        }
      } catch (err) {
        this.error = err.response.data.message;
      }
    },
    async cancelOperation() {
      if (this.updateOperation.pwd === "") {
        this.error = "Veuillez confirmer votre mot de passe!";
        return;
      }
      try {
        const csrf = await this.$axios.$get("/api/auth/csrf");
        this.$axios.setHeader("XSRF-TOKEN", csrf.token);
        const response = await this.$axios.$post(
          "/api/operations/delete/" + this.updateOperation._id,
          { pwd: this.updateOperation.pwd }
        );
        if (response.message) {
          this.deletionModal = false;
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
      // this.$auth.user.isAccountValidated = "En attente";
      // this.$auth.user.accountRegistrationCode = "";
      return this.$auth.user;
    },
  },
};
</script>

<style scoped>
</style>