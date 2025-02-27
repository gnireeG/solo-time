import Dexie, {type EntityTable} from 'dexie';
import type {Client} from '../models/Client';
import type {Project} from '../models/Project';
import type {Task} from '../models/Task';
import type { Timeentry } from 'src/models/Timeentry';

const db = new Dexie('SoloTime') as Dexie & {
    clients: EntityTable<Client, 'id'>;
    projects: EntityTable<Project, 'id'>;
    tasks: EntityTable<Task, 'id'>;
    timeEntries: EntityTable<Timeentry, 'id'>;
}

db.version(3).stores({
    clients: '++id',
    projects: '++id, clientId',
    tasks: '++id, projectId',
    timeEntries: '++id, taskId'
})

export type {Client, Project, Task, Timeentry};
export { db };