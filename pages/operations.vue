<template>
  <section class="mt-6 container">
    <div class="columns is-centered">
      <div class="column" v-if="account.isAccountValidated === 'validated'">
        <div class="columns is-flex">
          <div class="column">
            <h2 class="title is-size-6-mobile">
              <b-icon pack="fas" icon="user" size="2x"></b-icon>
              Mes opérations
            </h2>
            <div class="v-divider"></div>
          </div>
          <div class="column is-align-self-end">
            <NuxtLink to="/request" class="button is-primary">
              Nouvelle Demande de Crédit
            </NuxtLink>
          </div>
        </div>
      </div>
      <div v-else>
          <Complete />
      </div>
        <b-table
            v-if="account.isAccountValidated === 'validated'"
            :data="operations ? [] : operations"
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
                <span :class="[{'is-success': props.row.status}, tag]">

                </span>
            </b-table-column>

            <b-table-column field="createdAt" label="Date" centered v-slot="props">
                <span class="tag is-success">
                    {{ this.$moment(props.row.createdAt).from() }}
                </span>
            </b-table-column>
    </b-table>

        <b-pagination
            v-if="account.isAccountValidated === 'validated'"
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
  </section>
</template>

<script>
export default {
data() {
      return {
        operations: [],
        total: 10,
        current: "sync",
        isLoading: true
      }
    },
    async created() {
      try {
        const response = await this.$axios.get(`/api/operations`);
        this.operations = response.data.map((operation, id) => {
          operation.id = id + 1;
          return operation;
        });
        console.log(this.operations);
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