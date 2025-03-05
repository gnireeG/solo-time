<template>
    <div class="row q-gutter-md">
        <q-input v-model="newTask.name" label="Name" @keydown.enter.prevent="addTask" />
        <q-select
            v-model="newTask.projectId"
            fill-input
            use-input
            :options="projectOptions"
            label="Project"
            emit-value
            map-options
            @filter="filterFn"
            hide-selected
        />
    </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useDBStore } from 'src/stores/db-store';

const db = useDBStore();

const projects = computed(() => db.projects);
const projectOptions = ref()

onMounted(() =>{
    projectOptions.value = db.projects.map(c => ({label: c.name, value: c.id}))
    if(props.projectId){
        newTask.value.projectId = props.projectId
    }
})

const props = defineProps({
    projectId: {
        type: Number,
        required: false
    }
})

const newTask = ref({
    name: '',
    projectId: <number | null> null,
})

function addTask(){
    console.log(newTask.value.name);
    clearForm()
}

function clearForm(){
    newTask.value.name = '';
    newTask.value.projectId = props.projectId || null
}

function filterFn(val: string, update: (callback: () => void) => void) {
    update(() => {
        const needle = val.toLowerCase();
        if (!projectOptions.value) return;
        projectOptions.value = projects.value
            .filter(v => v.name.toLowerCase().indexOf(needle) > -1)
            .map(c => ({ label: c.name, value: c.id }));
    });
}

</script>