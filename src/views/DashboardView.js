import { db } from '../infra/MockDatabase.js';
import { authService } from '../services/AuthService.js';
import { Modal } from '../components/Modal.js';
import { Toast } from '../components/assets/js/Toast.js';
import { BookManager } from './components/BookManager.js';
import { ServiceManager } from './components/ServiceManager.js';

export const DashboardView = {
    render: async () => {
        if (!authService.isAuthenticated()) {
            window.location.hash = '/login';
            return '';
        }

        return `
            <div class="animate-fade-in w-full max-w-7xl mx-auto p-4 md:p-8">
                <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <div>
                        <h2 class="text-3xl font-bold text-primary font-serif">Painel do Escritor</h2>
                        <p class="text-gray-500">Gestão completa de Produtos e Serviços.</p>
                    </div>
                    <div class="flex gap-3 w-full md:w-auto">
                        <button id="btn-logout" class="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition font-bold text-sm">
                            <i class="ph ph-sign-out"></i> Sair
                        </button>
                    </div>
                </div>

                <div class="flex gap-6 border-b border-gray-200 mb-8 overflow-x-auto">
                    <button onclick="window.app.setAdminTab('main')" id="tab-main" class="pb-3 text-sm font-bold border-b-2 border-accent text-accent transition whitespace-nowrap">Visão Geral & Cruds</button>
                    <button class="pb-3 text-sm font-bold border-b-2 border-transparent text-gray-300 cursor-not-allowed" title="Em breve">Relatórios</button>
                    <button class="pb-3 text-sm font-bold border-b-2 border-transparent text-gray-300 cursor-not-allowed" title="Em breve">Solicitações</button>
                    <button class="pb-3 text-sm font-bold border-b-2 border-transparent text-gray-300 cursor-not-allowed" title="Em breve">Comunidade</button>
                </div>

                <div id="dashboard-content"></div>
                <div class="h-20"></div>
            </div>
        `;
    },

    afterRender: async () => {
        // --- ESTADO LOCAL DA VIEW ---
        const state = {
            currentTab: 'main',
            cropper: null,
            cropCallback: null,
            pendingDeletion: null
        };

        // Certifica que o estado de ordenação existe nos Managers se ainda não existir
        if (!BookManager.state.sortKey) { BookManager.state.sortKey = 'title'; BookManager.state.sortOrder = 'asc'; }
        if (!ServiceManager.state.sortKey) { ServiceManager.state.sortKey = 'name'; ServiceManager.state.sortOrder = 'asc'; }

        // --- WINDOW.APP ---
        window.app = {
            // 1. Navegação
            setAdminTab: (tab) => { 
                state.currentTab = tab; 
                renderContent(); 
            },
            
            // 2. Controle dos Managers (Paginação, Filtro e Ordenação)
            changeAdminPage: (ctx, dir) => {
                if(ctx === 'books') BookManager.state.page += dir;
                if(ctx === 'services') ServiceManager.state.page += dir;
                renderContent();
            },
            setAdminFilter: (ctx, key, val) => {
                if(ctx === 'books') { BookManager.state[key] = val; BookManager.state.page = 1; }
                if(ctx === 'services') { ServiceManager.state[key] = val; ServiceManager.state.page = 1; }
                renderContent();
            },
            sortData: (ctx, key) => {
                const targetState = ctx === 'books' ? BookManager.state : ServiceManager.state;
                if(targetState.sortKey === key) {
                    targetState.sortOrder = targetState.sortOrder === 'asc' ? 'desc' : 'asc';
                } else {
                    targetState.sortKey = key;
                    targetState.sortOrder = 'asc';
                }
                renderContent();
            },

            // 3. Controle de Modais
            closeModal: () => Modal.close(),
            openBookModal: (id) => BookManager.openModal(id),
            openServiceEditModal: (id) => ServiceManager.openModal(id),

            // 4. Sistema de Exclusão
            askDelete: (type, id) => {
                state.pendingDeletion = { type, id };
                const bodyHTML = `
                    <div class="text-center p-4">
                        <div class="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-slow">
                            <i class="ph-bold ph-trash text-3xl"></i>
                        </div>
                        <h3 class="text-xl font-bold text-gray-800 mb-2">Tem certeza?</h3>
                        <p class="text-gray-500 text-sm max-w-xs mx-auto">Essa ação removerá o item permanentemente.</p>
                    </div>
                `;
                const footerHTML = `
                    <button onclick="window.app.closeModal()" class="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition">Cancelar</button>
                    <button onclick="window.app.confirmDelete()" class="px-6 py-2.5 rounded-xl bg-red-500 text-white font-bold text-sm shadow-lg hover:bg-red-600 transition flex items-center gap-2"><i class="ph-bold ph-trash"></i> Sim, Excluir</button>
                `;
                Modal.open('Confirmar Exclusão', bodyHTML, footerHTML);
            },

            confirmDelete: () => {
                if (!state.pendingDeletion) return;
                const { type, id } = state.pendingDeletion;

                if (type === 'book') {
                    db.data.books = db.data.books.filter(b => b.id != id);
                    Toast.show("Livro excluído.", "success");
                } else if (type === 'service') {
                    db.data.services = db.data.services.filter(s => s.id != id);
                    Toast.show("Serviço excluído.", "success");
                }

                state.pendingDeletion = null;
                Modal.close();
                renderContent();
            },

            // 5. Sistema de Cropper (Mantido igual)
            handleImageUpload: (input, imgId, hiddenId, aspectRatio = 1) => {
                if (input.files && input.files[0]) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const modal = document.getElementById('cropper-modal');
                        const image = document.getElementById('cropper-image');
                        image.src = e.target.result;
                        modal.classList.remove('hidden');
                        modal.classList.add('flex');
                        if (state.cropper) state.cropper.destroy();
                        state.cropper = new Cropper(image, {
                            aspectRatio: aspectRatio, viewMode: 1, dragMode: 'move', autoCropArea: 1, background: false
                        });
                        state.cropCallback = (base64) => {
                            const imgPreview = document.getElementById(imgId);
                            if(imgPreview) imgPreview.src = base64;
                            const inputHidden = document.getElementById(hiddenId);
                            if(inputHidden) inputHidden.value = base64;
                            input.value = ''; 
                        };
                    };
                    reader.readAsDataURL(input.files[0]);
                }
            },
            confirmCrop: () => {
                if (!state.cropper) return;
                const canvas = state.cropper.getCroppedCanvas({ maxWidth: 1200, maxHeight: 1200, fillColor: '#fff' });
                const base64 = canvas.toDataURL('image/jpeg', 0.85);
                if (state.cropCallback) state.cropCallback(base64);
                window.app.cancelCrop();
            },
            cancelCrop: () => {
                const modal = document.getElementById('cropper-modal');
                modal.classList.add('hidden');
                modal.classList.remove('flex');
                if (state.cropper) { state.cropper.destroy(); state.cropper = null; }
                state.cropCallback = null;
            }
        };

        // --- LISTENERS ---
        const btnLogout = document.getElementById('btn-logout');
        if(btnLogout) btnLogout.addEventListener('click', () => { authService.logout(); window.location.hash = '/login'; });

        const btnConfirmCrop = document.getElementById('btn-confirm-crop');
        if(btnConfirmCrop) btnConfirmCrop.onclick = window.app.confirmCrop;
        
        const btnCancelCrop = document.getElementById('btn-cancel-crop');
        if(btnCancelCrop) btnCancelCrop.onclick = window.app.cancelCrop;

        document.addEventListener('dashboard:refresh', renderContent);

        // --- RENDERIZAÇÃO DE CONTEÚDO ---
        function renderContent() {
            const container = document.getElementById('dashboard-content');
            if (!container) return;

            // Stats Básicos
            const totalBooks = db.data.books.length;
            const totalServices = db.data.services.filter(s => s.active).length;
            const totalLeads = db.data.leads ? db.data.leads.length : 0;
            const pendingLeads = db.data.leads ? db.data.leads.filter(l => l.status === 'pending').length : 0;

            // --- DEFINIÇÃO DE TEMAS PARA SERVIÇOS ---
            const THEMES = {
                'default': { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-600', active: 'bg-white border-slate-200' },
                'orange':  { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', active: 'bg-orange-50 border-orange-200' },
                'blue':    { bg: 'bg-blue-50',   border: 'border-blue-200',   text: 'text-blue-700', active: 'bg-blue-50 border-blue-200' },
                'purple':  { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', active: 'bg-purple-50 border-purple-200' },
                'green':   { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', active: 'bg-emerald-50 border-emerald-200' }
            };

            // --- LÓGICA DE ORDENAÇÃO GENÉRICA ---
            const sortList = (list, key, order) => {
                return list.sort((a, b) => {
                    let valA = a[key];
                    let valB = b[key];
                    if (typeof valA === 'string') valA = valA.toLowerCase();
                    if (typeof valB === 'string') valB = valB.toLowerCase();
                    
                    if (valA < valB) return order === 'asc' ? -1 : 1;
                    if (valA > valB) return order === 'asc' ? 1 : -1;
                    return 0;
                });
            };

            // 1. RENDERIZAR LINHAS DE SERVIÇOS (COM CORES VISUAIS)
            const renderServiceRows = () => {
                let services = db.data.services.filter(s => s.name.toLowerCase().includes(ServiceManager.state.filter.toLowerCase()));
                
                // Ordenação
                services = sortList(services, ServiceManager.state.sortKey, ServiceManager.state.sortOrder);

                // Paginação
                const start = (ServiceManager.state.page - 1) * ServiceManager.state.itemsPerPage;
                const paged = services.slice(start, start + ServiceManager.state.itemsPerPage);

                return paged.map(s => {
                    const theme = THEMES[s.theme || 'default'];
                    // Lógica visual: Se ativo, usa cor. Se inativo, fica cinza/opaco.
                    const rowClass = s.active 
                        ? `${theme.active} border-l-4` 
                        : 'bg-gray-50 opacity-60 border-l-4 border-gray-200';
                    
                    // Ícone de ordenação (visual helper)
                    const statusClass = s.active ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200';

                    return `
                    <tr class="border-b transition hover:brightness-95 ${rowClass}">
                        <td class="p-4 font-bold text-gray-700 flex items-center gap-3">
                            <div class="w-10 h-10 rounded-lg flex items-center justify-center bg-white shadow-sm text-gray-600 border border-gray-100">
                                <i class="ph-fill ${s.icon} text-xl"></i>
                            </div>
                            <div class="flex flex-col">
                                <span class="${theme.text}">${s.name}</span>
                                <span class="text-[10px] text-gray-400 font-normal uppercase">${s.theme || 'Padrão'}</span>
                            </div>
                        </td>
                        <td class="p-4 text-sm font-medium">R$ ${s.price.toFixed(2)}</td>
                        <td class="p-4 text-center">
                            <span class="px-2 py-1 rounded-full text-[10px] font-bold border ${statusClass}">
                                ${s.active ? 'Ativo' : 'Inativo'}
                            </span>
                        </td>
                        <td class="p-4 text-right">
                            <button onclick="window.app.openServiceEditModal('${s.id}')" class="text-blue-600 p-2 hover:bg-white rounded-full transition shadow-sm"><i class="ph-bold ph-pencil-simple"></i></button>
                            <button onclick="window.app.askDelete('service', '${s.id}')" class="text-red-500 p-2 hover:bg-white rounded-full transition shadow-sm"><i class="ph-bold ph-trash"></i></button>
                        </td>
                    </tr>`;
                }).join('') || '<tr><td colspan="4" class="p-8 text-center text-gray-400">Nenhum serviço encontrado.</td></tr>';
            };

            // 2. RENDERIZAR LINHAS DE LIVROS (COM COLUNA DE PROMOÇÃO)
            const renderBookRows = () => {
                let books = db.data.books.filter(b => b.title.toLowerCase().includes(BookManager.state.filter.toLowerCase()));
                
                // Ordenação
                books = sortList(books, BookManager.state.sortKey, BookManager.state.sortOrder);

                // Paginação
                const start = (BookManager.state.page - 1) * BookManager.state.itemsPerPage;
                const paged = books.slice(start, start + BookManager.state.itemsPerPage);

                return paged.map(b => {
                    const statusClass = b.active ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200';
                    const promoBadge = b.isPromotion 
                        ? `<div class="flex flex-col items-center">
                             <span class="px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-bold rounded border border-orange-200 uppercase mb-1">Promo</span>
                             <span class="text-[10px] text-gray-400 line-through">R$ ${b.price.toFixed(2)}</span>
                             <span class="text-sm font-bold text-green-600">R$ ${b.promoPrice.toFixed(2)}</span>
                           </div>`
                        : `<span class="text-gray-400 text-xs">-</span>`;

                    return `
                    <tr class="border-b border-gray-100 hover:bg-gray-50 transition group ${b.active ? 'bg-white' : 'bg-gray-50 opacity-70'}">
                        <td class="p-3"><img src="${b.cover}" class="w-10 h-14 object-cover rounded shadow-sm border border-gray-200"></td>
                        <td class="p-3 font-bold text-gray-700">${b.title}</td>
                        <td class="p-3 text-gray-600 text-sm font-medium">
                            ${!b.isPromotion ? `R$ ${b.price.toFixed(2)}` : '<span class="text-gray-400 text-xs italic">Ver ao lado</span>'}
                        </td>
                        <td class="p-3 text-center align-middle">
                            ${promoBadge}
                        </td>
                        <td class="p-3 text-center align-middle">
                            <span class="inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-full border ${statusClass}">
                                <span class="w-1.5 h-1.5 rounded-full ${b.active ? 'bg-green-500' : 'bg-gray-400'}"></span>
                                ${b.active ? 'Ativo' : 'Inativo'}
                            </span>
                        </td>
                        <td class="p-3 text-right">
                            <button onclick="window.app.openBookModal('${b.id}')" class="text-blue-500 hover:bg-blue-50 p-2 rounded-full transition"><i class="ph-bold ph-pencil-simple"></i></button>
                            <button onclick="window.app.askDelete('book', '${b.id}')" class="text-red-400 hover:bg-red-50 p-2 rounded-full transition"><i class="ph-bold ph-trash"></i></button>
                        </td>
                    </tr>
                    `;
                }).join('') || '<tr><td colspan="6" class="p-8 text-center text-gray-400">Nenhum livro encontrado.</td></tr>';
            };

            // Ícones de ordenação para os headers
            const getSortIcon = (ctx, key) => {
                const state = ctx === 'books' ? BookManager.state : ServiceManager.state;
                if (state.sortKey !== key) return '<i class="ph-bold ph-arrows-down-up text-gray-300"></i>';
                return state.sortOrder === 'asc' 
                    ? '<i class="ph-bold ph-arrow-up text-accent"></i>' 
                    : '<i class="ph-bold ph-arrow-down text-accent"></i>';
            };

            container.innerHTML = `
                <div class="animate-fade-in space-y-8">
                    
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div class="dashboard-card bg-white p-6 rounded-2xl shadow-sm border-l-4 border-accent">
                            <p class="text-gray-400 text-xs font-bold uppercase tracking-wide mb-1">Livros Publicados</p>
                            <h3 class="text-3xl font-black text-primary">${totalBooks}</h3>
                        </div>
                        <div class="dashboard-card bg-white p-6 rounded-2xl shadow-sm border-l-4 border-blue-500">
                            <p class="text-gray-400 text-xs font-bold uppercase tracking-wide mb-1">Serviços Ativos</p>
                            <h3 class="text-3xl font-black text-primary">${totalServices}</h3>
                        </div>
                        <div class="dashboard-card bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <p class="text-gray-400 text-xs font-bold uppercase tracking-wide mb-1">Total de Pedidos</p>
                            <h3 class="text-3xl font-black text-primary">${totalLeads}</h3>
                        </div>
                        <div class="dashboard-card bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <p class="text-gray-400 text-xs font-bold uppercase tracking-wide mb-1">Pendências</p>
                            <h3 class="text-3xl font-black text-accent">${pendingLeads}</h3>
                        </div>
                    </div>

                    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                            <div><h3 class="font-bold text-lg text-primary flex items-center gap-2"><i class="ph-fill ph-book text-accent"></i> Catálogo de Livros</h3></div>
                            <div class="flex gap-2 flex-1 justify-end w-full md:w-auto">
                                <input type="text" placeholder="Buscar livro..." oninput="window.app.setAdminFilter('books', 'filter', this.value)" value="${BookManager.state.filter}" class="bg-gray-50 border border-gray-200 rounded-lg text-xs p-2 w-full md:w-64 focus:outline-none focus:border-accent">
                                <button onclick="window.app.openBookModal()" class="text-white bg-primary px-4 py-2 rounded-lg text-xs font-bold uppercase hover:bg-accent transition shadow-lg flex items-center gap-2"><i class="ph-bold ph-plus"></i> Novo</button>
                            </div>
                        </div>
                        
                        <div class="overflow-x-auto min-h-[300px]">
                            <table class="w-full text-left text-sm text-gray-600">
                                <thead class="bg-gray-50 text-gray-400 uppercase text-[10px] border-b border-gray-200 select-none">
                                    <tr>
                                        <th class="p-3">Capa</th>
                                        <th class="p-3 cursor-pointer hover:text-primary transition" onclick="window.app.sortData('books', 'title')">Título ${getSortIcon('books', 'title')}</th>
                                        <th class="p-3 cursor-pointer hover:text-primary transition" onclick="window.app.sortData('books', 'price')">Preço Base ${getSortIcon('books', 'price')}</th>
                                        <th class="p-3 text-center cursor-pointer hover:text-primary transition" onclick="window.app.sortData('books', 'isPromotion')">Promoção ${getSortIcon('books', 'isPromotion')}</th>
                                        <th class="p-3 text-center cursor-pointer hover:text-primary transition" onclick="window.app.sortData('books', 'active')">Status ${getSortIcon('books', 'active')}</th>
                                        <th class="p-3 text-right">Ação</th>
                                    </tr>
                                </thead>
                                <tbody>${renderBookRows()}</tbody>
                            </table>
                        </div>
                        
                        <div class="flex justify-between items-center border-t border-gray-100 pt-4 mt-4">
                            <span class="text-xs text-gray-400">Página ${BookManager.state.page}</span>
                            <div class="flex gap-2">
                                <button onclick="window.app.changeAdminPage('books', -1)" class="w-8 h-8 rounded border hover:bg-gray-100 flex items-center justify-center disabled:opacity-50" ${BookManager.state.page === 1 ? 'disabled' : ''}><i class="ph-bold ph-caret-left"></i></button>
                                <button onclick="window.app.changeAdminPage('books', 1)" class="w-8 h-8 rounded border hover:bg-gray-100 flex items-center justify-center"><i class="ph-bold ph-caret-right"></i></button>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 border-t-4 border-t-blue-500">
                        <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                            <div><h3 class="font-bold text-lg text-primary flex items-center gap-2"><i class="ph-fill ph-briefcase text-blue-500"></i> Meus Serviços</h3></div>
                            <div class="flex gap-2 flex-1 justify-end w-full md:w-auto">
                                <input type="text" placeholder="Buscar serviço..." oninput="window.app.setAdminFilter('services', 'filter', this.value)" value="${ServiceManager.state.filter}" class="bg-gray-50 border border-gray-200 rounded-lg text-xs p-2 w-full md:w-64 focus:outline-none focus:border-blue-500">
                                <button onclick="window.app.openServiceEditModal()" class="text-white bg-blue-600 px-4 py-2 rounded-lg text-xs font-bold uppercase hover:bg-blue-700 transition shadow-lg flex items-center gap-2"><i class="ph-bold ph-plus"></i> Novo</button>
                            </div>
                        </div>
                        
                        <div class="overflow-x-auto min-h-[200px]">
                            <table class="w-full text-left text-sm text-gray-600">
                                <thead class="bg-blue-50 text-blue-500 uppercase text-[10px] border-b border-blue-100 select-none">
                                    <tr>
                                        <th class="p-3 cursor-pointer hover:text-blue-700 transition" onclick="window.app.sortData('services', 'name')">Serviço ${getSortIcon('services', 'name')}</th>
                                        <th class="p-3 cursor-pointer hover:text-blue-700 transition" onclick="window.app.sortData('services', 'price')">Preço ${getSortIcon('services', 'price')}</th>
                                        <th class="p-3 text-center cursor-pointer hover:text-blue-700 transition" onclick="window.app.sortData('services', 'active')">Status ${getSortIcon('services', 'active')}</th>
                                        <th class="p-3 text-right">Ação</th>
                                    </tr>
                                </thead>
                                <tbody>${renderServiceRows()}</tbody> 
                            </table>
                        </div>
                        
                        <div class="flex justify-between items-center border-t border-gray-100 pt-4 mt-4">
                            <span class="text-xs text-gray-400">Página ${ServiceManager.state.page}</span>
                            <div class="flex gap-2">
                                <button onclick="window.app.changeAdminPage('services', -1)" class="w-8 h-8 rounded border hover:bg-gray-100 flex items-center justify-center disabled:opacity-50" ${ServiceManager.state.page === 1 ? 'disabled' : ''}><i class="ph-bold ph-caret-left"></i></button>
                                <button onclick="window.app.changeAdminPage('services', 1)" class="w-8 h-8 rounded border hover:bg-gray-100 flex items-center justify-center"><i class="ph-bold ph-caret-right"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        renderContent();
    }
};