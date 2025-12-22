import { serviceRepository } from '../repositories/ServiceRepository.js';
import { db } from '../infra/MockDatabase.js'; // Import necessário para salvar no mock

class ServiceService {
    // O que você já tinha (para o site público)
    getServices() {
        const allServices = serviceRepository.getAll();
        return allServices.filter(s => s.active);
    }

    // --- ADIÇÕES PARA O DASHBOARD ---

    // Painel precisa ver inativos também
    getAllForAdmin() {
        return serviceRepository.getAll();
    }

    getById(id) {
        return serviceRepository.getAll().find(s => s.id === id);
    }

    save(data) {
        const service = {
            ...data,
            price: parseFloat(data.price),
            active: data.active === true || data.active === 'on',
            isPromotion: data.isPromotion === true || data.isPromotion === 'on',
            promoPrice: data.promoPrice ? parseFloat(data.promoPrice) : null
        };

        if (data.id) {
            // Editar
            const index = db.data.services.findIndex(s => s.id === data.id);
            if (index !== -1) db.data.services[index] = { ...db.data.services[index], ...service };
        } else {
            // Criar
            service.id = 'S' + Date.now();
            db.data.services.push(service);
        }
    }

    delete(id) {
        db.data.services = db.data.services.filter(s => s.id !== id);
    }
}

export const serviceService = new ServiceService();