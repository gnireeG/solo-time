<template>
    <q-page>
        <q-breadcrumbs>
            <q-breadcrumbs-el label="Home" :to="{name: 'index'}" icon="home" />
            <q-breadcrumbs-el label="Projects" />
        </q-breadcrumbs>
        <h3>Projects page</h3>
        <ProjectsTable :projects="projects" defaultState="active" />
    </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ProjectsTable from 'src/components/ProjectsTable.vue';
import { useDBStore } from 'src/stores/db-store';

const db = useDBStore();
const projects = computed(() => db.projects);
</script>