import { serviceService } from '../services/ServiceService.js';

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
                R$ ${s.price.toFixed(2)} <span class="text-xs font-bold text-gray-400 uppercase tracking-wide">${s.unit || ''}</span>
            </div>
            <p class="text-gray-600 mb-10 text-base leading-relaxed">${s.description}</p>
        </div>
        
        <button class="w-full bg-primary text-white py-4 rounded-xl font-bold text-sm transition hover:bg-accent hover:shadow-xl hover:-translate-y-1">
            Solicitar Orçamento
        </button>
    </div>`;
}

export const ServicesView = {
    render: () => {
        const services = serviceService.getServices();

        return `
            <div class="text-center mb-16 animate-fade-in pt-10">
                <h2 class="text-5xl font-black text-primary mb-6 font-serif">Mentoria & Serviços</h2>
                <p class="text-gray-500 text-lg max-w-2xl mx-auto">
                    Do rascunho ao best-seller. Vamos trabalhar juntos na sua história.
                </p>
            </div>
            
            <div id="services-grid" class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto pb-20">
                ${services.map((s, index) => renderServiceCard(s, index)).join('')}
            </div>
        `;
    }
};