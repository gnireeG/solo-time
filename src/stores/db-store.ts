import { defineStore, acceptHMRUpdate } from 'pinia';
import { db } from 'src/classes/db';
import type { Client, Project } from 'src/classes/db';

export const useDBStore = defineStore('db-store', {
  state: () => ({
    clients: [] as Client[],
    projects: [] as Project[]
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
    },
    async addProject(project: Project){
      const newProject = {...project};
      try{
        await db.projects.add(newProject);
        await this.loadProjects();
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
