<template>
<q-select
    v-model="client"
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
/>
</template>
<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useDBStore } from 'src/stores/db-store'

const db = useDBStore();
const client = defineModel<number>()

const clients = computed(() => db.clients)

const clientOptions = ref()

onMounted(() =>{
    clientOptions.value = db.clients.map(c => ({label: c.name, value: c.id}))
})

function filterFn(val: string, update: (callback: () => void) => void) {
    update(() => {
        const needle = val.toLowerCase();
        if (!clients.value) return;
        clientOptions.value = clients.value
            .filter(v => v.name.toLowerCase().indexOf(needle) > -1)
            .map(c => ({ label: c.name, value: c.id }));
    });
}
</script>