<template>
    <q-page>
        <h3 v-if="client">{{ client.name }}</h3>
        <form v-if="client" @submit.prevent.stop="onSubmit">
            <q-input v-model="client.name" label="Name" />

            <q-btn label="Submit" type="submit" color="primary" value="Save" />
        </form>
        <q-table :rows="projects">

        </q-table>
    </q-page>
</template>
<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useDBStore } from 'src/stores/db-store';
import { useRouter } from 'vue-router';

import type { Client } from 'src/models/Client';

const router = useRouter()
const idParam = router.currentRoute.value.params.id;
const id = idParam ? parseInt(idParam as string) : NaN;
const db = useDBStore()

const client = ref<Client | undefined>(undefined)

const projects = computed(() => db.projects.filter( p => p.clientId === id))

onMounted( () => {
    client.value = db.clients.find( c => c.id === id)
})

//const client = computed( () => db.clients.find( c => c.id === id) )

async function onSubmit():Promise<void> {
    if(!client.value) return
    await db.updateClient({name: client.value.name, id: client.value.id} as Client)
    await router.push('/clients')
}

</script>