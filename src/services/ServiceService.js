import { serviceRepository } from '../repositories/ServiceRepository.js';

class ServiceService {
    getServices() {
        const allServices = serviceRepository.getAll();
        return allServices.filter(s => s.active);
    }
}

export const serviceService = new ServiceService();