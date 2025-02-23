<template>
  <router-view class="main" />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useDBStore } from './stores/db-store';
const db = useDBStore();
onMounted(() => {
  db.initDB();
});
</script>
<style lang="scss" scoped>
.main{
  padding: 1rem;
}
</style>