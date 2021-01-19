<template>
  <div>
    <section class="section">
    <div class="columns is-centered" v-if="account.isAccountValidated === 'validated'">
      <div class="column">
        <h1 class="title is-size-6-mobile">
          Mes opérations
        </h1>
      </div>
      <div class="column is-align-self-end">
        <NuxtLink to="/request" class="button is-block is-primary">
          Nouvelle Demande de Crédit
        </NuxtLink>
      </div>
    </div>
    <div class="columns" v-if="account.isAccountValidated === 'validated'">
      <div class="column">
        <b-table
        :data="operations"
        striped
        narrowed
        hoverable
        paginated
        :per-page="perPage"
        :current-page.sync="current"
        :pagination-position="paginationPosition"
        pagination-rounded
        default-sort="createdAt"
        default-sort-direction="desc"
        :loading="isLoading">
        <b-table-column field="id" label="ID" width="40" sortable numeric v-slot="props">
            {{ props.row.id }}
        </b-table-column>

        <b-table-column field="rname" label="Nom du Receveur" sortable v-slot="props">
            {{ props.row.rname }}
        </b-table-column>

        <b-table-column field="rnumber" label="Numéro du Receveur" sortable v-slot="props">
            {{ props.row.rnumber }}
        </b-table-column>

        <b-table-column field="amount" label="Montant" sortable v-slot="props">
            {{ props.row.amount }}
        </b-table-column>

        <b-table-column field="devise" label="Devise" sortable v-slot="props">
            {{ props.row.currency }}
        </b-table-column>
        
        <b-table-column field="status" label="Statut" sortable v-slot="props">
            <span v-if="props.row.status === 'Réussi'" class="tag is-success">
                {{ props.row.status }}
            </span>
            <span v-if="props.row.status === 'En cours'" class="tag is-info">
                {{ props.row.status }}
            </span>
            <span v-if="props.row.status === 'Échoué'" class="tag is-danger">
                {{ props.row.status }}
            </span>
        </b-table-column>

        <b-table-column field="createdAt" label="Date" sortable centered v-slot="props">
                {{ new Date(props.row.createdAt).toLocaleString('fr-FR') }}
        </b-table-column>
      </b-table>
      </div>
    </div>
    <div v-if="account.isAccountValidated === ''" class="columns is-centered mt-6 pt-4">
        <div class="column is-third-desktop is-half-tablet">
        <div class="notification is-success is-light">
          <h2 class="subtitle has-text-centered">Félicitations <font-awesome-icon class="is-small" :icon="['fas', 'check-circle']" /></h2>
          <p>Merci d'avoir créé votre compte chez Express Money. <br>
          Pour effectuer une demande de crédit, veuillez completer les informations nécessaires.<br>
          Express Money vous remercie pour votre confiance.
          </p>
        </div>
        <p class="has-text-centered">
          <NuxtLink to="/complete" class="is-info is-block button">Compléter mes informations</NuxtLink>
        </p>
      </div>
    </div>
    <div v-if="account.isAccountValidated === 'pending'" class="columns is-centered mt-6 pt-4">
      <div class="column is-third-desktop is-half-tablet">
        <div class="notification is-info is-light">
        <h2 class="subtitle has-text-centered"><font-awesome-icon
              class="is-small"
              :icon="['fas', 'spinner']"
            />
            Votre compte est en cours de vérification</h2>
        <p>La durée habituelle de vérification peut aller jusqu'à 24h. <br>
        Une fois votre compte vérifié cette page sera mise à jour.<br>
        Express Money vous remercie pour votre confiance.
        </p>
      </div>
      </div>
    </div>
    </section>
  </div>
</template>

<script>
export default {
data() {
      return {
        operations: [],
        total: 10,
        current: 'sync',
        perPage: 5,
        rangeBefore: 1,
        rangeAfter: 1,
        isRounded: true,
        isLoading: true
      }
    },
    async fetch() {
      try {
        const response = await this.$axios.get(`/api/operations`);
        let total = 0;
        this.operations = response.data.map((operation, id) => {
          operation.id = id + 1;
          ++total;
          return operation;
        });
        this.total = total;
        this.isLoading = false; 
      } catch (error) {
        console.log(error);
      }
    },
    watch: {
      dialog (val) {
        val || this.close()
      }
    },
    methods: {
      getDate(createdAt) {
        return this.$moment(createdAt).from();
      }
    },
    computed: {
        isAuthenticated() {
            return this.$auth.loggedIn;
        },
        account() {
            return this.$auth.user;
        }
    }
}
</script>