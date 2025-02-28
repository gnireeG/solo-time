<template>
    <span v-if="date">{{ new Date(date).toLocaleDateString() }}</span>
</template>
<script setup lang="ts">
defineProps({
    date:{
        type: Date,
    }
})
</script>