<template>
    <q-page>
        <h3>Clients page</h3>
        <div class="button-container"><q-btn round color="primary" icon="add" @click="showNewClientDialog = true"/></div>
        <q-table v-if="clients" :rows="clients"  />
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
                        <q-input v-model="newClientForm.email" label="Email" type="email" />
                        <q-input v-model="newClientForm.phone" label="Phone" type="tel" />
                        <q-btn label="Submit" type="submit" color="primary" />
                    </form>
                </q-card-section>
            </q-card>
            </q-dialog>
    </q-page>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useDBStore } from 'src/stores/db-store';

const db = useDBStore();

const clients = ref(useDBStore().$state.clients)
const showNewClientDialog = ref(false)
const newClientForm = ref({
    name: '',
    email: '',
    phone: ''
})

function onSubmitNewClient():void {
    db.addClient(newClientForm.value)
    showNewClientDialog.value = false
    newClientForm.value = {
        name: '',
        email: '',
        phone: ''
    }
}


</script>
<style lang="scss" scoped>
.button-container{
    text-align: right;
    margin-bottom: 1rem;
}
</style>