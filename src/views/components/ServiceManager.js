import { db } from '../../infra/MockDatabase.js';
import { Modal } from '../../components/Modal.js';
import { Toast } from '../../components/assets/js/Toast.js';

// Temas completos para o fundo das linhas (Igual ao protótipo)
const THEMES = {
    'default': { dot: 'bg-slate-800',   rowBg: 'bg-slate-50',      text: 'text-slate-600', border: 'border-slate-100' },
    'orange':  { dot: 'bg-orange-500',  rowBg: 'bg-orange-50',     text: 'text-orange-700', border: 'border-orange-100' },
    'blue':    { dot: 'bg-blue-600',    rowBg: 'bg-blue-50',       text: 'text-blue-700',   border: 'border-blue-100' },
    'purple':  { dot: 'bg-purple-600',  rowBg: 'bg-purple-50',     text: 'text-purple-700', border: 'border-purple-100' },
    'green':   { dot: 'bg-emerald-600', rowBg: 'bg-emerald-50',    text: 'text-emerald-700', border: 'border-emerald-100' }
};

const ICONS = ['ph-star-four', 'ph-pen-nib', 'ph-book-open', 'ph-rocket', 'ph-fire', 'ph-briefcase', 'ph-student'];

export const ServiceManager = {
    state: { filter: '', page: 1, itemsPerPage: 5, sortKey: 'name', sortOrder: 'asc' },

    renderTable: () => {
        const services = db.data.services.filter(s => s.name.toLowerCase().includes(ServiceManager.state.filter.toLowerCase()));
        
        // Ordenação
        services.sort((a, b) => {
            const vA = a[ServiceManager.state.sortKey], vB = b[ServiceManager.state.sortKey];
            const valA = typeof vA === 'string' ? vA.toLowerCase() : vA;
            const valB = typeof vB === 'string' ? vB.toLowerCase() : vB;
            if(ServiceManager.state.sortOrder === 'asc') return valA > valB ? 1 : -1;
            return valA < valB ? 1 : -1;
        });

        const start = (ServiceManager.state.page - 1) * ServiceManager.state.itemsPerPage;
        const paged = services.slice(start, start + ServiceManager.state.itemsPerPage);

        // Helper de Ícone de Ordenação
        const sortIcon = (key) => ServiceManager.state.sortKey === key ? 
            (ServiceManager.state.sortOrder === 'asc' ? 'ph-caret-up text-blue-600' : 'ph-caret-down text-blue-600') : 
            'ph-arrows-down-up text-gray-300 group-hover:text-blue-500';

        const rows = paged.map(s => {
            const theme = THEMES[s.theme || 'default'];
            // Aplica a cor de fundo se ativo
            const rowClass = s.active ? `${theme.rowBg} ${theme.border}` : 'bg-gray-50 opacity-60 border-gray-100';
            const textClass = s.active ? theme.text : 'text-gray-400';

            return `
            <tr class="border-b ${rowClass} transition hover:brightness-95">
                <td class="p-3">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-lg bg-white/80 backdrop-blur flex items-center justify-center shadow-sm text-xl ${textClass}">
                            <i class="ph-fill ${s.icon || 'ph-star-four'}"></i>
                        </div>
                        <div>
                            <div class="font-bold text-gray-800">${s.name}</div>
                            <div class="text-xs ${textClass} opacity-80 truncate max-w-[150px]">${s.description}</div>
                        </div>
                    </div>
                </td>
                <td class="p-3 font-mono text-sm ${textClass}">
                    <div class="flex flex-col">
                        ${s.isPromotion && s.promoPrice ? 
                            `<span class="line-through text-xs opacity-50">R$ ${s.price.toFixed(2)}</span><span class="font-bold">R$ ${s.promoPrice.toFixed(2)}</span>` : 
                            `<span class="font-bold">R$ ${s.price.toFixed(2)}</span>`
                        }
                        ${s.unit ? `<span class="text-[10px] opacity-70 font-sans font-normal uppercase tracking-wide">${s.unit}</span>` : ''}
                    </div>
                </td>
                <td class="p-3 text-center">
                    ${s.isPromotion ? 
                        `<span class="text-[10px] bg-white/80 border ${theme.border} ${theme.text} px-2 py-1 rounded-lg font-bold shadow-sm uppercase">Oferta</span>` : 
                        '<span class="text-gray-400">-</span>'
                    }
                </td>
                <td class="p-3 text-center">
                    <span class="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-white/60 border ${theme.border} ${theme.text}">
                        <span class="w-1.5 h-1.5 rounded-full ${s.active ? 'bg-green-500' : 'bg-gray-400'}"></span>
                        ${s.active ? 'Ativo' : 'Inativo'}
                    </span>
                </td>
                <td class="p-3 text-right">
                    <div class="flex justify-end gap-2 items-center h-full">
                        <button onclick="window.app.openServiceEditModal('${s.id}')" class="bg-white/50 hover:bg-white text-blue-600 p-2 rounded-full transition shadow-sm border border-transparent hover:border-blue-100"><i class="ph-bold ph-pencil-simple"></i></button>
                        <button onclick="window.app.askDelete('service', '${s.id}')" class="bg-white/50 hover:bg-white text-red-500 p-2 rounded-full transition shadow-sm border border-transparent hover:border-red-100"><i class="ph-bold ph-trash"></i></button>
                    </div>
                </td>
            </tr>
        `}).join('');

        return `
            <div class="overflow-x-auto min-h-[200px]">
                <table class="w-full text-left text-sm text-gray-600">
                    <thead class="bg-blue-50 text-blue-500 uppercase text-[10px] border-b border-blue-100">
                        <tr>
                            <th class="p-3 cursor-pointer hover:text-blue-700 transition select-none group" onclick="window.app.sortData('services', 'name')">
                                Serviço <i class="ph-bold ${sortIcon('name')} ml-1 align-middle"></i>
                            </th>
                            <th class="p-3 cursor-pointer hover:text-blue-700 transition select-none group" onclick="window.app.sortData('services', 'price')">
                                Preço Base <i class="ph-bold ${sortIcon('price')} ml-1 align-middle"></i>
                            </th>
                            <th class="p-3 text-center cursor-pointer hover:text-blue-700 transition select-none group" onclick="window.app.sortData('services', 'isPromotion')">
                                Promoção <i class="ph-bold ${sortIcon('isPromotion')} ml-1 align-middle"></i>
                            </th>
                            <th class="p-3 text-center cursor-pointer hover:text-blue-700 transition select-none group" onclick="window.app.sortData('services', 'active')">
                                Status <i class="ph-bold ${sortIcon('active')} ml-1 align-middle"></i>
                            </th>
                            <th class="p-3 text-right">Ação</th>
                        </tr>
                    </thead>
                    <tbody>${rows || '<tr><td colspan="5" class="p-4 text-center">Nenhum serviço.</td></tr>'}</tbody>
                </table>
            </div>
        `;
    },

    openModal: (id = null) => {
        const s = id ? db.data.services.find(x => x.id == id) : { id: '', name: '', price: '', unit: '', description: '', active: true, icon: 'ph-star-four', theme: 'default', isPromotion: false, promoPrice: '' };
        const isEdit = !!id;

        const iconGrid = ICONS.map(ic => `
            <div class="p-2 hover:bg-gray-100 rounded cursor-pointer text-center service-icon-opt ${s.icon === ic ? 'bg-gray-200 ring-1 ring-gray-400' : ''}" data-val="${ic}">
                <i class="ph-fill ${ic} text-xl"></i>
            </div>
        `).join('');

        const themeDots = Object.keys(THEMES).map(k => `
            <div class="w-8 h-8 rounded-full cursor-pointer service-theme-opt ${THEMES[k].dot} ${s.theme === k ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''}" data-val="${k}"></div>
        `).join('');

        const bodyHTML = `
            <div class="space-y-5">
                <input type="hidden" id="service-id" value="${s.id || ''}">
                <input type="hidden" id="service-icon" value="${s.icon}">
                <input type="hidden" id="service-theme" value="${s.theme}">

                <div class="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <span class="text-xs font-bold text-gray-500 uppercase">Status do Serviço</span>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="service-active" ${s.active ? 'checked' : ''} class="w-5 h-5 accent-blue-600">
                    </label>
                </div>

                <div>
                    <label class="text-xs font-bold text-gray-500 uppercase">Nome do Serviço</label>
                    <input type="text" id="service-name" value="${s.name}" class="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm font-bold">
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="text-xs font-bold text-gray-500 uppercase">Preço Base (R$)</label>
                        <input type="number" id="service-price" value="${s.price}" class="w-full bg-white border border-gray-300 rounded-lg p-2.5">
                    </div>
                    <div>
                        <label class="text-xs font-bold text-gray-500 uppercase">Unidade</label>
                        <input type="text" id="service-unit" value="${s.unit || ''}" placeholder="Ex: p/ hora" class="w-full bg-white border border-gray-300 rounded-lg p-2.5">
                    </div>
                </div>

                <div class="bg-gray-50 p-5 rounded-xl border border-gray-200">
                    <label class="text-xs font-bold text-gray-500 uppercase mb-2 block">Ícone Principal</label>
                    <div class="w-full bg-white border border-gray-300 rounded-lg p-3 flex items-center justify-between hover:bg-gray-50 transition cursor-pointer" id="btn-toggle-icons">
                        <div class="flex items-center gap-3"><i id="icon-preview-display" class="ph-fill ${s.icon} text-xl text-primary"></i> <span class="text-sm font-bold text-gray-600">Escolher Ícone...</span></div><i class="ph-bold ph-caret-down text-gray-400"></i>
                    </div>
                    <div id="icon-picker-modal" class="hidden mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-4 animate-fade-in">
                        <div class="grid grid-cols-6 gap-2 max-h-40 overflow-y-auto custom-scrollbar">${iconGrid}</div>
                    </div>
                    
                    <label class="text-xs font-bold text-gray-500 uppercase mb-3 block mt-4">Tema do Card</label>
                    <div class="flex gap-4 flex-wrap">${themeDots}</div>
                </div>

                <div class="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <div class="flex items-center justify-between mb-2">
                        <span class="font-bold text-blue-800 text-sm">Preço Promocional?</span>
                        <label class="relative inline-flex items-center cursor-pointer"><input type="checkbox" id="service-promo" class="sr-only peer" ${s.isPromotion ? 'checked' : ''}><div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div></label>
                    </div>
                    <div id="serv-promo-container" class="${s.isPromotion ? '' : 'hidden'} mt-2">
                        <input type="number" step="0.01" id="serv-promo-price" value="${s.promoPrice || ''}" placeholder="Novo Valor" class="w-full bg-white border border-blue-200 rounded-lg p-2 form-input text-blue-900 font-bold">
                    </div>
                </div>

                <div>
                    <label class="text-xs font-bold text-gray-500 uppercase">Descrição</label>
                    <textarea id="service-desc" rows="3" class="w-full bg-white border border-gray-300 rounded-lg p-3 form-input text-sm">${s.description || ''}</textarea>
                </div>
            </div>
        `;

        const footerHTML = `
            <button onclick="window.app.closeModal()" class="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm">Cancelar</button>
            <button id="btn-save-service" class="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-lg flex items-center gap-2"><i class="ph-bold ph-floppy-disk"></i> Salvar</button>
        `;

        Modal.open(isEdit ? 'Editar Serviço' : 'Novo Serviço', bodyHTML, footerHTML);
        ServiceManager.attachModalEvents(isEdit);
    },

    attachModalEvents: (isEdit) => {
        document.getElementById('btn-toggle-icons').onclick = () => {
            document.getElementById('icon-picker-modal').classList.toggle('hidden');
        };

        document.querySelectorAll('.service-icon-opt').forEach(el => {
            el.onclick = () => {
                document.querySelectorAll('.service-icon-opt').forEach(i => i.classList.remove('bg-gray-200', 'ring-1', 'ring-gray-400'));
                el.classList.add('bg-gray-200', 'ring-1', 'ring-gray-400');
                document.getElementById('service-icon').value = el.dataset.val;
                document.getElementById('icon-preview-display').className = `ph-fill ${el.dataset.val} text-xl text-primary`;
                document.getElementById('icon-picker-modal').classList.add('hidden');
            };
        });

        document.querySelectorAll('.service-theme-opt').forEach(el => {
            el.onclick = () => {
                document.querySelectorAll('.service-theme-opt').forEach(t => t.classList.remove('ring-2', 'ring-offset-2', 'ring-gray-400'));
                el.classList.add('ring-2', 'ring-offset-2', 'ring-gray-400');
                document.getElementById('service-theme').value = el.dataset.val;
            };
        });

        document.getElementById('service-promo').onchange = (e) => {
            document.getElementById('serv-promo-container').classList.toggle('hidden', !e.target.checked);
        };

        document.getElementById('btn-save-service').onclick = () => {
            const id = document.getElementById('service-id').value;
            const name = document.getElementById('service-name').value;
            if(!name) return Toast.show("Nome obrigatório", "error");

            const data = {
                id: isEdit ? id : 'S' + Date.now(),
                name,
                price: parseFloat(document.getElementById('service-price').value) || 0,
                unit: document.getElementById('service-unit').value,
                description: document.getElementById('service-desc').value,
                active: document.getElementById('service-active').checked,
                icon: document.getElementById('service-icon').value,
                theme: document.getElementById('service-theme').value,
                isPromotion: document.getElementById('service-promo').checked,
                promoPrice: parseFloat(document.getElementById('serv-promo-price').value) || 0
            };

            if(isEdit) {
                const idx = db.data.services.findIndex(s => s.id == id);
                if(idx !== -1) db.data.services[idx] = { ...db.data.services[idx], ...data };
            } else {
                db.data.services.push(data);
            }

            Toast.show("Serviço salvo!", "success");
            Modal.close();
            document.dispatchEvent(new CustomEvent('dashboard:refresh'));
        };
    }
};