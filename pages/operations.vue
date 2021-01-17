<template>
  <div>
    <div class="columns mt-6 is-centered" v-if="account.isAccountValidated === 'validated'">
      <div class="column">
        <h2 class="title is-size-6-mobile">
          <b-icon pack="fas" icon="user" size="2x"></b-icon>
          Mes opérations
        </h2>
      </div>
      <div class="column is-align-self-end">
        <NuxtLink to="/request" class="button is-block is-outlined is-primary">
        <font-awesome-icon
              class="is-small"
              :icon="['fas', 'pencil-alt']"
            />
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
        :loading="isLoading">
        <b-table-column field="id" label="ID" width="40" numeric v-slot="props">
            {{ props.row.id }}
        </b-table-column>

        <b-table-column field="rname" label="Nom du Receveur" v-slot="props">
            {{ props.row.rname }}
        </b-table-column>

        <b-table-column field="rnumber" label="Numéro du Receveur" v-slot="props">
            {{ props.row.rnumber }}
        </b-table-column>

        <b-table-column field="amount" label="Montant" v-slot="props">
            {{ props.row.amount }}
        </b-table-column>

        <b-table-column field="devise" label="Devise" v-slot="props">
            {{ props.row.currency }}
        </b-table-column>
        
        <b-table-column field="status" label="Statut" v-slot="props">
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

        <b-table-column field="createdAt" label="Date" centered v-slot="props">
                {{ new Date(props.row.createdAt).toLocaleString('fr-FR') }}
        </b-table-column>
      </b-table>

      <b-pagination
        :total="total"
        v-model="current"
        order="is-left"
        size="is-small"
        per-page=10
        icon-prev="chevron-left"
        icon-next="chevron-right"
        aria-next-label="Suivant"
        aria-previous-label="Précédent"
        aria-page-label="Page"
        aria-current-label="Page actuelle">
      </b-pagination>
      </div>
    </div>
    <div v-if="account.isAccountValidated === ''">
      <Complete />
    </div>
    <div v-if="account.isAccountValidated === 'pending'" class="columns is-centered mt-6 pt-4">
      <div class="column is-third-desktop is-half-tablet">
        <b-notification type="is-info is-light" aria-close-label="Close notification">
        <h2 class="subtitle has-text-centered"><font-awesome-icon
              class="is-small"
              :icon="['fas', 'spinner']"
            />
            Votre compte est en cours de vérification</h2>
        <p>La durée habituelle de vérification peut aller jusqu'à 24h. <br>
        Une fois votre compte vérifié cette page sera mise à jour.<br>
        Express Money vous remercie pour votre confiance.
        </p>
      </b-notification>
      </div>
    </div>
  </div>
</template>

<script>
export default {
data() {
      return {
        operations: [],
        total: 0,
        current: "sync",
        isLoading: true
      }
    },
    async created() {
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