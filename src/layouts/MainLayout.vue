<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Quasar App
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Essential Links
        </q-item-label>

        <RouterLink class="nav-link" v-for="link in linksList" :key="link.title" :to="link.link"><q-icon :name="link.icon" />{{ link.title }}</RouterLink>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref,  } from 'vue';


const linksList: Array<{title: string, link: string, icon: string}> = [
  {
    title: 'Home',
    icon: 'home',
    link: '/'
  },
  {
    title: 'Clients',
    icon: 'school',
    link: '/clients'
  },
  {
    title: 'Projects',
    icon: 'work',
    link: '/projects'
  }
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
