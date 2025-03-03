<template>
    <q-table :rows="filteredProjects" :columns="columns" :filter="filter" :rows-per-page-options="[20, 50, 100]">
        <template v-slot:top>
                <div class="row w-full justify-between">
                    <div class="row q-gutter-md">
                        <q-input v-model="filter" debounce="300" placeholder="Search" label="Search" />
                        <q-select v-model="selectedState" :options="stateOptions" label="State" emit-value map-options class="select-client" />
                    </div>
                    <div>
                        <q-btn color="primary" label="New" @click="showNewProjectDialog = true" />
                    </div>
                </div>
            </template>
        <template v-slot:body="props">
            <q-tr :props="props">
                <q-td><router-link class="text-link" :to="'/projects/'+props.row.id">{{props.row.name}}</router-link></q-td>
                <q-td><router-link class="text-link" :to="'/clients/'+props.row.clientId">{{getClientName(props.row.clientId)}}</router-link></q-td>
                <q-td>{{ props.row.state }}</q-td>
                <q-td><FormattedDate :date="props.row.startDate" /></q-td>
                <q-td><FormattedDate :date="props.row.endDate" /></q-td>
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
                    <div class="row  q-gutter-md">
                        <div class="col">
                            <q-input v-model="newProjectName" label="Name" />
                            
                            
                            <q-input v-model="newProjectStartDate" mask="date" :rules="['date']" label="Start date">
                                <template v-slot:append>
                                    <q-icon name="event" class="cursor-pointer">
                                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                        <q-date v-model="newProjectStartDate">
                                        <div class="row items-center justify-end">
                                            <q-btn v-close-popup label="Close" color="primary" flat />
                                        </div>
                                        </q-date>
                                    </q-popup-proxy>
                                    </q-icon>
                                </template>
                            </q-input>
                            <q-select
                                v-model="newProjectClient"
                                use-input
                                hide-selected
                                fill-input
                                input-debounce="0"
                                :options="clientOptions"
                                @filter="filterFn"
                                style="width: 250px; padding-bottom: 32px"
                                label="Client"
                                emit-value
                                map-options
                            >
                                <template v-slot:no-option>
                                    <q-item>
                                        <q-item-section class="text-grey">
                                            No results
                                        </q-item-section>
                                    </q-item>
                                </template>
                            </q-select>
                        </div>
                        <div class="col">
                            <q-select class="w-full" v-model="newProjectState" label="State" :options="['planning', 'active', 'completed']" />
                            <q-input v-model="newProjectEndDate" mask="date" :rules="['date']" label="End date">
                                <template v-slot:append>
                                    <q-icon name="event" class="cursor-pointer">
                                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                        <q-date v-model="newProjectEndDate">
                                        <div class="row items-center justify-end">
                                            <q-btn v-close-popup label="Close" color="primary" flat />
                                        </div>
                                        </q-date>
                                    </q-popup-proxy>
                                    </q-icon>
                                </template>
                            </q-input>
                            
                        </div>
                    </div>

                    <q-separator class="q-my-md" />
                    <q-btn label="Submit" type="submit" color="primary" />
                </form>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref, onMounted} from 'vue';
import type { PropType } from 'vue';
import { useDBStore } from 'src/stores/db-store';
import type { Project } from 'src/models/Project';
import type { Client } from 'src/models/Client';
import { useQuasar } from 'quasar'

import FormattedDate from 'src/components/FormattedDate.vue';

const $q = useQuasar();

const props = defineProps({
    projects: Array as PropType<Project[]>,
    defaultClientId: {
        type: Number,
        required: false
    },
    defaultState: {
        type: String as PropType<'planning' | 'active' | 'completed'>,
        required: false
    }
})

const db = useDBStore();

//const projects = computed(() => db.projects);

const clients = ref<Client[] | null>(null);
const clientOptions = ref<{ label: string, value: string | undefined }[]>([]);

const filter = ref('');

const selectedState = ref('');
const stateOptions = [
    { label: 'All', value: '' },
    { label: 'Planning', value: 'planning' },
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' },
];

const filteredProjects = computed(() => {
    if(!props.projects) return [];
    return props.projects.filter(project => {
        const matchesState = selectedState.value === '' || project.state === selectedState.value;
        const matchesFilter = filter.value === '' || project.name.toLowerCase().includes(filter.value.toLowerCase());
        return matchesState && matchesFilter;
    });
});

const columns = [
    { sortable: true, name: 'name', label: 'Name', align: 'left' as const, field: 'name' },
    { sortable: true, name: 'client', label: 'Client', align: 'left' as const, field: 'clientId' },
    { sortable: true, name: 'state', label: 'State', align: 'left' as const, field: 'state' },
    { sortable: true, name: 'startDate', label: 'Start date', align: 'left' as const, field: 'startDate' },
    { sortable: true, name: 'endDate', label: 'End date', align: 'left' as const, field: 'endDate' },
];

onMounted(() => {
    clients.value = db.clients;
    clientOptions.value = clients.value?.filter(c => c.id !== undefined).map(c => ({ label: c.name, value: c.id?.toString() })) || [];
    newProjectClient.value = clientOptions.value.find(c => c.value === props.defaultClientId?.toString())?.value;
    selectedState.value = props.defaultState || '';
});

const showNewProjectDialog = ref(false);
const newProjectName = ref('');
const newProjectClient = ref()
const newProjectState = ref('planning');
const newProjectStartDate = ref('');
const newProjectEndDate = ref('');

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
    const newProject:Project =  {
        name: newProjectName.value,
        clientId: parseInt(newProjectClient.value?.toString() || '0'),
        state: newProjectState.value as 'planning' | 'active' | 'completed'
    };

    if(newProjectStartDate.value.length > 0) newProject.startDate = new Date(newProjectStartDate.value);
    if(newProjectEndDate.value.length > 0) newProject.endDate = new Date(newProjectEndDate.value);
    await db.addProject(newProject);
    clearNewProjectForm();
    showNewProjectDialog.value = false;
    $q.notify({
        message: 'Project added',
        color: 'positive',
        position: 'bottom-right',
        icon: 'check'
    })
}

function clearNewProjectForm(){
    newProjectName.value = '';
    newProjectClient.value = props.defaultClientId || undefined;
    newProjectState.value = 'planning';
    newProjectStartDate.value = '';
    newProjectEndDate.value = '';
}

function getClientName(id:string){
    if(!clients.value) return '';
    const idNum = parseInt(id);
    const client = db.clients.find(c => c.id === idNum);
    return client?.name || '';
}
</script>
<style scoped>
.select-client{
    min-width: 100px;
}
</style>