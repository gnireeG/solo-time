export interface Task {
    id?: number;
    name: string;
    projectId?: number | null;
    completed: boolean;
    description: string;
}