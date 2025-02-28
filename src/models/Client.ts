import type { Contact } from './Contact';
export interface Client {
    id?: number;
    name: string;
    website?: string;
    contacts: Contact[]
}