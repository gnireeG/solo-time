import { defineStore, acceptHMRUpdate } from 'pinia';
import { db } from 'src/classes/db';
import type { Client, Project } from 'src/classes/db';
import { useQuasar } from 'quasar';

export const useDBStore = defineStore('db-store', {
  state: () => ({
    clients: [] as Client[],
    projects: [] as Project[],
    $q: useQuasar()
  }),

  actions: {
    async loadClients() {
      try{
        this.clients = await db.clients.toArray();
      }
      catch(err){
        console.error(err)
      }
    },
    async loadProjects(){
        try{
          this.projects = await db.projects.toArray();
        }
        catch(err){
          console.error(err);
        }
    },
    async addClient(client: Client){
      const newClient: Client = client;
      if(!newClient.contacts){
        newClient.contacts = [];
      }
      try{
        await db.clients.add(newClient);
        await this.loadClients();
        this.$q.notify({
          message: 'Client added',
          color: 'positive',
          icon: 'check',
          position: 'bottom-right'
        })
      }
      catch(err){
        console.error(err)
      }
    },
    getClientById(id: number): Client | undefined{
      return this.clients.find(client => client.id === id);
    },
    async updateClient(client: Client){
      await db.clients.update(client.id, { ...client });
      await this.loadClients();
      this.$q.notify({
        message: 'Client updated',
        color: 'positive',
        icon: 'check',
        position: 'bottom-right'
      })
    },
    async updateProject(project: Project){
      await db.projects.update(project.id, { ...project });
      await this.loadProjects();
      this.$q.notify({
        message: 'Project updated',
        color: 'positive',
        icon: 'check',
        position: 'bottom-right'
      })
    },
    async addProject(project: Project){
      const newProject = {...project};
      try{
        await db.projects.add(newProject);
        await this.loadProjects();
        this.$q.notify({
          message: 'Project added',
          color: 'positive',
          icon: 'check',
          position: 'bottom-right'
        })
      }
      catch(err){
        console.error(err);
      }
  },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDBStore, import.meta.hot));
}
