export class Database {
    constructor() {
        
    }
    getClients(): Array<{ id: number, name: string, email: string, phone: string }> {
        return [
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
        ];
    }
}