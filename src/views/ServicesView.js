import { serviceService } from '../services/ServiceService.js';
import { leadService } from '../services/LeadService.js';
import { Modal } from '../components/Modal.js';

const THEME_COLORS = {
    'default': 'text-primary border-primary',
    'orange': 'text-orange-500 border-orange-500',
    'blue': 'text-blue-600 border-blue-600',
    'purple': 'text-purple-600 border-purple-600',
    'green': 'text-emerald-600 border-emerald-600'
};

function renderServiceCard(s, index) {
    const themeClass = THEME_COLORS[s.theme || 'default'];
    const iconClass = s.icon || 'ph-star-four';

    return `
    <div class="card-interaction bg-white p-10 rounded-[2rem] shadow-xl border border-gray-100 flex flex-col h-full relative overflow-hidden group animate-fade-in" style="animation-delay: ${index * 100}ms">
        <div class="absolute top-0 left-0 w-full h-2 bg-current ${themeClass.split(' ')[0]} opacity-80"></div>
        
        <div class="flex justify-between items-start mb-6">
            <div class="p-3 bg-gray-50 rounded-2xl text-3xl ${themeClass.split(' ')[0]}">
                <i class="ph-fill ${iconClass}"></i>
            </div>
            <div class="text-6xl text-gray-100 font-black z-0 group-hover:text-gray-200 transition">0${index+1}</div>
        </div>

        <div class="relative z-10 flex-1">
            <h3 class="text-2xl font-bold text-gray-900 mb-3 font-serif">${s.name}</h3>
            <div class="text-4xl font-black text-slate-800 mb-6 flex items-baseline gap-2">
                ${s.price === 0 ? 'Sob Consulta' : `R$ ${s.price.toFixed(2)}`} 
                <span class="text-xs font-bold text-gray-400 uppercase tracking-wide">${s.unit || ''}</span>
            </div>
            <p class="text-gray-600 mb-10 text-base leading-relaxed">${s.description}</p>
        </div>
        
        <button data-id="${s.id}" class="btn-request-budget w-full bg-primary text-white py-4 rounded-xl font-bold text-sm transition hover:bg-accent hover:shadow-xl hover:-translate-y-1">
            Solicitar Orçamento
        </button>
    </div>`;
}

function openBudgetModal(serviceId) {
    const services = serviceService.getServices();
    const s = services.find(item => item.id === serviceId);
    
    if(!s) return;

    // AQUI ESTÁ A CORREÇÃO VISUAL "FORÇA BRUTA"
    const bodyHTML = `
        <div class="animate-fade-in">
            <div class="bg-gradient-to-r from-gray-50 to-white p-6 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden" style="margin-bottom: 30px;">
                <div class="absolute right-0 top-0 w-20 h-20 bg-accent/5 rounded-full -mr-5 -mt-5"></div>
                <h4 class="text-lg font-bold text-gray-900 mb-2">${s.name}</h4>
                <p class="text-gray-600 text-sm leading-relaxed mb-4">${s.description}</p>
                <div class="flex items-end justify-between border-t border-gray-100 pt-4">
                    <div><p class="text-xs text-gray-400 uppercase font-bold">Investimento Estimado</p><p class="text-2xl font-black text-primary">${s.price === 0 ? 'A Definir' : 'R$ '+s.price.toFixed(2)}</p></div>
                    <span class="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">${s.unit || 'Preço Fixo'}</span>
                </div>
            </div>

            <form id="budget-form">
                <p class="text-sm font-bold text-gray-700 uppercase tracking-wide border-b border-gray-100 pb-2" style="margin-bottom: 20px;">
                    Seus Dados de Contato
                </p>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4" style="margin-bottom: 20px;">
                    <input type="text" id="req-name" autocomplete="name" placeholder="Nome Completo" class="w-full bg-white border border-gray-200 rounded-lg p-3 text-gray-700 form-input text-sm">
                    <input type="tel" id="req-phone" autocomplete="tel" placeholder="WhatsApp (DDD+Num)" class="w-full bg-white border border-gray-200 rounded-lg p-3 text-gray-700 form-input text-sm">
                </div>
                
                <div style="margin-bottom: 20px;">
                    <input type="email" id="req-email" autocomplete="email" placeholder="E-mail Profissional" class="w-full bg-white border border-gray-200 rounded-lg p-3 text-gray-700 form-input text-sm">
                </div>
                
                <textarea id="req-desc" placeholder="Conte um pouco sobre seu projeto..." rows="3" class="w-full bg-white border border-gray-200 rounded-lg p-3 text-gray-700 form-input text-sm"></textarea>
            </form>
        </div>`; 

    // RODAPÉ: Uso style inline para garantir o padding gigante do botão e a ordem correta
    const footerHTML = `
        <div style="display: flex; gap: 15px; width: 100%; justify-content: flex-end; align-items: center;">
            <button id="btn-cancel-budget" class="text-gray-500 font-bold text-sm hover:text-gray-800 transition" style="padding: 10px 20px;">Cancelar</button>
            <button id="btn-submit-budget" class="bg-primary hover:bg-slate-800 text-white rounded-full font-bold shadow-lg transition" style="padding: 12px 60px; white-space: nowrap;">Enviar Proposta</button>
        </div>
    `; 

    Modal.open("Solicitar Orçamento", bodyHTML, footerHTML);

    document.getElementById('btn-cancel-budget').onclick = Modal.close;
    
    document.getElementById('btn-submit-budget').onclick = () => {
        const name = document.getElementById('req-name').value;
        const email = document.getElementById('req-email').value;
        const phone = document.getElementById('req-phone').value;
        const desc = document.getElementById('req-desc').value;

        const data = { name, email, phone, desc, serviceName: s.name };

        try {
            leadService.create(data);
            window.Toast.show('Solicitação enviada com sucesso!', 'success');
            Modal.close();
        } catch (error) {
            window.Toast.show(error.message, 'error');
        }
    };
}

export const ServicesView = {
    render: async () => {
        const services = serviceService.getServices();

        return `
            <div class="text-center mb-16 animate-fade-in pt-10">
                <h2 class="text-5xl font-black text-primary mb-6 font-serif">Mentoria & Serviços</h2>
                <p class="text-gray-500 text-lg max-w-2xl mx-auto">
                    Do rascunho ao best-seller. Vamos trabalhar juntos na sua história.
                </p>
            </div>
            
            <div id="services-grid" class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto pb-20 px-4">
                ${services.map((s, index) => renderServiceCard(s, index)).join('')}
            </div>
        `;
    },

    afterRender: async () => {
        document.querySelectorAll('.btn-request-budget').forEach(btn => {
            btn.onclick = () => {
                const id = btn.getAttribute('data-id');
                openBudgetModal(id);
            };
        });
        
        window.scrollTo(0, 0);
    }
};