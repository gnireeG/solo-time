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
          <RouterLink to="/">Authless timetracking</RouterLink>
        </q-toolbar-title>
        <div>
          <q-toggle
            v-model="isDark"
            checked-icon="dark_mode"
            color="orange"
            unchecked-icon="light_mode"
            @update:model-value="$q.dark.toggle()"
          />
        </div>
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
          Menu
        </q-item-label>
        <NavLink v-for="link in linksList" :key="link.title" :link="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref,  } from 'vue';
import NavLink from 'src/components/NavLink.vue';

const linksList: Array<{title: string, link: string, icon?: string}> = [
  {
    title: 'Dashboard',
    link: '/'
  },
  {
    title: 'Clients',
    link: '/clients'
  },
  {
    title: 'Projects',
    link: '/projects'
  }
];

const isDark = ref(false)

const leftDrawerOpen = ref(false);

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
