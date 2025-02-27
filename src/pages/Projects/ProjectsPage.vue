<template>
    <h3>Projects page</h3>
    <q-btn icon="add" @click="showNewProjectDialog = true">Add project</q-btn>
    <q-table :rows="projects" :columns="columns">
        <template v-slot:body="props">
            <q-tr :props="props">
                <q-td>{{ props.row.id }}</q-td>
                <q-td><router-link :to="'/projects/'+props.row.id">{{props.row.name}}</router-link></q-td>
                <q-td><router-link :to="'/clients/'+props.row.clientId">{{getClientName(props.row.clientId)}}</router-link></q-td>
            </q-tr>
        </template>
    </q-table>
    <q-dialog v-model="showNewProjectDialog">
        <q-card>
            <q-card-section class="row items-center q-pb-none">
                <div class="text-h6">Add new project</div>
                <q-space />
                <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>

            <q-card-section>
                <form @submit.prevent.stop="onSubmitNewProject">
                    <q-input v-model="newProjectName" label="Name" />
                    <q-select
                        v-model="newProjectClient"
                        use-input
                        hide-selected
                        fill-input
                        input-debounce="0"
                        :options="clientOptions"
                        @filter="filterFn"
                        style="width: 250px; padding-bottom: 32px"
                    >
                        <template v-slot:no-option>
                            <q-item>
                                <q-item-section class="text-grey">
                                    No results
                                </q-item-section>
                            </q-item>
                        </template>
                    </q-select>
                    <q-btn label="Submit" type="submit" color="primary" />
                </form>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useDBStore } from 'src/stores/db-store';
import type { Project } from 'src/models/Project';
import type { Client } from 'src/models/Client';

const db = useDBStore();

const projects = computed(() => db.projects);

const clients = ref<Client[] | null>(null);
const clientOptions = ref<{ label: string, value: string | undefined }[]>([]);

const columns = [
    { name: 'id', label: 'ID', align: 'left' as const, field: 'id' },
    { name: 'name', label: 'Name', align: 'left' as const, field: 'name' },
    { name: 'client', label: 'Client', align: 'left' as const, field: 'clientId' },
];

onMounted(() => {
    clients.value = db.clients;
    clientOptions.value = clients.value?.filter(c => c.id !== undefined).map(c => ({ label: c.name, value: c.id?.toString() })) || [];
    console.log(clientOptions.value)
});

const showNewProjectDialog = ref(false);
const newProjectName = ref('');
const newProjectClient = ref()

function filterFn(val: string, update: (callback: () => void) => void) {
    update(() => {
        const needle = val.toLowerCase();
        if (!clients.value) return;
        clientOptions.value = clients.value
            .filter(v => v.name.toLowerCase().indexOf(needle) > -1)
            .map(c => ({ label: c.name, value: c.id?.toString() }));
    });
}

async function onSubmitNewProject(): Promise<void> {
    await db.addProject({ name: newProjectName.value, clientId: newProjectClient.value.value } as Project);
    showNewProjectDialog.value = false;
    newProjectName.value = '';
    newProjectClient.value = undefined;
}

function getClientName(id:string){
    if(!clients.value) return '';
    const idNum = parseInt(id);
    const client = db.clients.find(c => c.id === idNum);
    return client?.name || '';
}
</script>