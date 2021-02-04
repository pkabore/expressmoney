<template>
  <div>
    <section class="section">
      <h1 class="title has-text-centered is-size-6-mobile">Mes opérations</h1>
      <p class="has-text-centered mb-3" v-if="account.isAccountValidated === 'Validé'">
        <NuxtLink
          to="/request"
          class="button is-fullwidth is-success"
        >Cliquez ici pour faire une nouvelle demande de crédit</NuxtLink>
      </p>
      <div class="columns" v-if="account.isAccountValidated === 'Validé'">
        <div class="column" v-if="isLoading">
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
              <div v-if="props.row.isAccountValidated === 'En cours'">
                <button class="button is-small is-primary" @click="openModal(props.row.id)">Editer</button>
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
      <div class="card">
        <header class="card-header">
          <p class="card-header-title has-text-centered">Editer la demande</p>
        </header>
        <section class="card-content">
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
          </ul>
        </section>
        <footer class="card-footer">
          <a href="#" class="card-footer-item has-text-danger" @click.prevent="modal = !modal">
            <b-icon icon="times"></b-icon>&nbsp; Annuler
          </a>
          <a
            href="#"
            class="card-footer-item has-text-link"
            @click.prevent="handleStatusUpdate('Décliné')"
          >
            <b-icon icon="times"></b-icon>&nbsp; Décliner
          </a>
          <a href="#" class="card-footer-item" @click.prevent="handleStatusUpdate('Réussi')">
            <b-icon icon="check"></b-icon>&nbsp; Valider
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
  methods: {},
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