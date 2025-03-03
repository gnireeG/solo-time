<template>
    <q-page>
        <h3>All clients</h3>
        <q-table v-if="clients" :rows="clients" :columns="columns">
            <template v-slot:top>
                <div class="row w-full justify-end">
                    <q-btn color="primary" label="New" @click="showNewClientDialog = true" />
                </div>
            </template>
            <template v-slot:body="props">
                <q-tr :props="props">
                    <q-td>{{ props.row.id }}</q-td>
                    <q-td><router-link class="text-link" :to="'/clients/'+props.row.id">{{props.row.name}}</router-link></q-td>
                </q-tr>
            </template>
        </q-table>
        <q-dialog v-model="showNewClientDialog">
            <q-card>
                <q-card-section class="row items-center q-pb-none">
                <div class="text-h6">Add new client</div>
                <q-space />
                <q-btn icon="close" flat round dense v-close-popup />
                </q-card-section>

                <q-card-section>
                    <form @submit.prevent.stop="onSubmitNewClient">
                        <q-input v-model="newClientForm.name" label="Name" />
                        <q-btn label="Submit" type="submit" color="primary" />
                    </form>
                </q-card-section>
            </q-card>
            </q-dialog>
    </q-page>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDBStore } from 'src/stores/db-store';
import type { Client } from 'src/models/Client';
import { useQuasar } from 'quasar';

const db = useDBStore();
const $q = useQuasar();

const clients = computed(() => db.clients)
const showNewClientDialog = ref(false)
const newClientForm = ref({
    name: ''
})

async function onSubmitNewClient():Promise<void> {
    await db.addClient({name: newClientForm.value.name} as Client)
    showNewClientDialog.value = false
    $q.notify({
        type: 'positive',
        message: 'Client added',
        icon: 'check',
        position: 'bottom-right'
    })
    newClientForm.value = {
        name: '',
    }
}

const columns = [
    {
        name: 'id',
        required: true,
        label: 'ID',
        align: 'left' as const,
        sortable: true,
        field: 'id'
    },
    {
        name: 'name',
        required: true,
        label: 'Name',
        align: 'left' as const,
        sortable: true,
        field: 'name'
    }
]


</script>
<style lang="scss" scoped>
.button-container{
    text-align: right;
    margin-bottom: 1rem;
}
</style>