<template>
    <q-breadcrumbs>
        <q-breadcrumbs-el label="Home" :to="{name: 'index'}" icon="home" />
        <q-breadcrumbs-el label="Projects" :to="{name: 'projects.index'}" />
        <q-breadcrumbs-el :label="project ? project.name : 'Project'" />
    </q-breadcrumbs>
    <h3>Projekt Details</h3>
    <form @submit.prevent.stop="onSaveProject">
        <div class="row q-gutter-md">
            <div>
                <q-input v-model="projectForm.name" label="Name" />
                <InputDate v-model="projectForm.startDate" label="Start date" />
                <SelectClient v-model="projectForm.clientId" label="Client" />
            </div>
            <div>
                <q-select
                    v-model="projectForm.state"
                    fill-input
                    :options="stateOptions"
                    label="Client"
                    emit-value
                    map-options
                    class="w-full"
                />
                <InputDate v-model="projectForm.endDate" label="End date" />
            </div>
        </div>
        <q-toggle v-model="showDescriptionEdit" label="Edit description" />
        <InputWysiwyg v-if="showDescriptionEdit" v-model="projectForm.description" label="Description" class="q-mb-md" />
        <div v-if="!showDescriptionEdit" class="project-description" v-html="projectForm.description"></div>
        <q-btn label="Save" type="submit" color="primary" />
    </form>
    <div>
        <h5>Tasks</h5>
        <TaskAdder :projectId="id" />
        <q-input v-model="newTaskForm.name" label="Name" @keydown.enter.prevent="addTask" />
        <div>{{ tasks }}</div>
    </div>
</template>
<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useDBStore } from 'src/stores/db-store';

import InputDate from 'src/components/InputDate.vue';
import SelectClient from 'src/components/SelectClient.vue';
import InputWysiwyg from 'src/components/InputWysiwyg.vue';

import type { Task } from 'src/models/Task';
import TaskAdder from 'src/components/TaskAdder.vue';

const db = useDBStore();

const route = useRoute()
const idParam = route.params.id;
const id = idParam ? parseInt(idParam as string) : NaN;

const project = computed(( )=> db.projects.find(p => p.id == id));

const tasks = ref<Task[]>([]);

const showDescriptionEdit = ref(false)

const projectForm = ref({
    id: 0,
    name: '',
    description: '',
    clientId: 0,
    state: <'planning' | 'active' | 'completed'> 'planning',
    startDate: '',
    endDate: ''
})

const newTaskForm = ref<Task>({
    projectId: id,
    name: '',
    description: '',
    completed: false,
})

const stateOptions = ['planning', 'active', 'completed'];

onMounted(async () =>{
    projectForm.value.id = parseInt(project.value?.id?.toString() ?? '0');
    projectForm.value.clientId = project.value?.clientId || 0;
    projectForm.value.name = project.value?.name || '';
    projectForm.value.description = project.value?.description || '';
    projectForm.value.state = project.value?.state || 'planning';
    projectForm.value.startDate = project.value?.startDate || '';
    projectForm.value.endDate = project.value?.endDate || '';
    
    await loadTasks();
})

async function loadTasks(){
    tasks.value = await db.getTasksByProjectId(project.value?.id || 0);
}

const onSaveProject = async () =>{
    if(!project.value) return;
    await db.updateProject(projectForm.value)
}

async function addTask(){
    await db.addTask({...newTaskForm.value});
    await loadTasks();
}

</script>