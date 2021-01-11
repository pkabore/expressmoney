<template>
  <v-data-table
    :headers="headers"
    :items="operations"
    sort-by="date"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>Opérations</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog
          v-model="dialog"
          max-width="500px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
            >
              Demande de Crédit
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">Nouvelle Demande</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                    <v-text-field
                      v-model="newRequest.rname"
                      label="Nom du receveur"
                    ></v-text-field>
                    <v-text-field
                      v-model="newRequest.rphone"
                      label="Numéro Orange Money Receveur"
                      type="tel"
                    ></v-text-field>
                    <v-text-field
                      v-model="newRequest.amount"
                      label="Montant"
                      type="number"
                      min=0
                      max=50000
                    ></v-text-field>
                    <v-text-field
                      v-model="newRequest.rib"
                      label="Numéro RIB du receveur"
                      type="number"
                    ></v-text-field>
                    <v-text-field
                      v-model="newRequest.pwd"
                      label="Votre mot de passe"
                      type="password"
                    ></v-text-field>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="close"
              >
                Cancel
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="save"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
     <template> <!-- v-slot:item.actions="{/* item */}" -->
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>
</template>

<script>
export default {
    data() {
      return {
        headers: [
          {
            text: 'Demande de crédit',
            align: 'start',
            sortable: false,
            value: '_id',
          },
          { text: 'Nom du receveur', value: 'rname' },
          { text: 'Numéro du receveur', value: 'rphone' },
          { text: 'Montant', value: 'request_amount' },
          { text: 'Statut', value: 'request_status' },
          { text: 'Date', value: 'request_date' },
        ],
        newRequest: {
          rfname: '',
          rlname: '',
          rphone: '',
          amount: 0,
          rib: '',
          pwd: '',
        }
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