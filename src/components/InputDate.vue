<template>
    <q-input v-model="date" mask="date" :label="label" clearable>
        <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="date">
                <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
                </q-date>
            </q-popup-proxy>
            </q-icon>
        </template>
    </q-input>
</template>
<script setup lang="ts">
const date = defineModel<string>()

defineProps({
    label: {
        type: String,
        required: false
    }
})
</script>