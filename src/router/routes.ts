import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue'), name:"index" },
      { path: '/clients', component: () => import('pages/Clients/ClientIndex.vue'), name:'clients.index' },
      { path: '/clients/:id', component: () => import('pages/Clients/ClientDetail.vue'), name:'clients.detail' },
      { path: '/projects', component: () => import('src/pages/Projects/ProjectsPage.vue'), name: 'projects.index' },
      { path: '/projects/:id', component: () => import('src/pages/Projects/ProjectDetail.vue'), name: 'projects.detail' },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
