import { db } from '../infra/MockDatabase.js';

class ServiceRepository {
    getAll() {
        return db.data.services;
    }
}

export const serviceRepository = new ServiceRepository();