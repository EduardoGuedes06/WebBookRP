import { db } from '../infra/MockDatabase.js';

class LeadService {
    create(data) {
        if (!data.name || !data.email) {
            throw new Error("Nome e E-mail são obrigatórios.");
        }

        const newLead = {
            id: Date.now(),
            name: data.name,
            email: data.email,
            phone: data.phone || '',
            desc: data.desc || '',
            service: data.serviceName,
            value: 0,
            date: new Date().toLocaleDateString('pt-BR'),
            timestamp: Date.now(),
            status: 'pending',
            notes: ''
        };

        db.data.leads.unshift(newLead);
        return newLead;
    }
}

export const leadService = new LeadService();