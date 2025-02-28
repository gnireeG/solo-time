export interface Project {
    id?: number;
    name: string;
    clientId: number;
    description?: string;
    state: 'planning' | 'active' | 'completed';
    startDate?: Date;
    endDate?: Date;
}