<template>
    <RouterLink class="nav-link" :key="link.title" :to="link.link"><q-btn class="w-full" align="left" flat :icon="link.icon">{{ link.title }}</q-btn></RouterLink>
</template>
<script setup lang="ts">
import type { PropType } from 'vue';

interface Navlink {
    title: string;
    icon?: string;
    link: string;
}
defineProps({
    link:{
        type: Object as PropType<Navlink>,
        required: true
    }
})
</script>
<style scoped lang="scss">
.nav-link{
    display: block;
    font-size: 1.2rem;
    padding: 0.2rem 0.5rem;
    color: initial;
    &:hover{
        color: $primary;
    }

    &.router-link-exact-active{
        color: $primary;
    }
}
</style>