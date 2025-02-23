import { defineStore, acceptHMRUpdate } from 'pinia';
import { Database } from 'src/classes/Database';

export const useDBStore = defineStore('db-store', {
  state: () => ({
    db: null as Database | null,
    clients: [
        {
            id: 1,
            name: 'Company ABC',
            email: 'hello@abc.com',
            phone: '123-456-7890',
        },
        {
            id: 2,
            name: 'Company XYZ',
            email: 'hello@xyz.com',
            phone: '098-765-4321',
        },
        {
            id: 3,
            name: 'Company 123',
            email: 'hello@123.com',
            phone: '456-789-012'
        }
    ] as Array<{ id: number; name: string; email: string; phone: string }>,
  }),

  actions: {
    initDB() {
      this.db = new Database();
    },
    addClient(client: { name: string; email: string; phone: string }) {
        // get the client with the highest id and add 1
        const id = Math.max(...this.clients.map((c) => c.id)) + 1;
        const newClient = { id, ...client };
        this.clients.push(newClient);
    }
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDBStore, import.meta.hot));
}
