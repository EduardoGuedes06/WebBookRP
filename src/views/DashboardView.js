import { bookService } from '../services/BookService.js';
import { serviceService } from '../services/ServiceService.js';
import { db } from '../infra/MockDatabase.js';
import { authService } from '../services/AuthService.js';
import { Modal } from '../components/Modal.js';

// --- ESTADO LOCAL (UI) ---
const state = {
    books: { page: 1, filter: '', sortKey: 'title', sortOrder: 'asc' },
    services: { page: 1, filter: '', sortKey: 'name', sortOrder: 'asc' },
    itemsPerPage: 5
};

// --- CONFIGURAÇÃO DE TEMAS ---
const THEMES = {
    'default': { text: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-200' },
    'orange': { text: 'text-orange-800', bg: 'bg-orange-50', border: 'border-orange-200' },
    'blue': { text: 'text-blue-800', bg: 'bg-blue-50', border: 'border-blue-200' },
    'purple': { text: 'text-purple-800', bg: 'bg-purple-50', border: 'border-purple-200' },
    'green': { text: 'text-emerald-800', bg: 'bg-emerald-50', border: 'border-emerald-200' }
};

// --- RENDERIZADORES AUXILIARES ---

function renderBooksPanel() {
    // Busca dados
    let list = bookService.getAll().filter(b => b.title.toLowerCase().includes(state.books.filter.toLowerCase()));
    
    // Ordenação
    list.sort((a, b) => {
        let vA = a[state.books.sortKey], vB = b[state.books.sortKey];
        if (typeof vA === 'string') vA = vA.toLowerCase(); 
        if (typeof vB === 'string') vB = vB.toLowerCase();
        if (vA < vB) return state.books.sortOrder === 'asc' ? -1 : 1;
        if (vA > vB) return state.books.sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    // Paginação
    const totalPages = Math.ceil(list.length / state.itemsPerPage);
    if(state.books.page > totalPages && totalPages > 0) state.books.page = totalPages;
    if(state.books.page < 1) state.books.page = 1;
    
    const start = (state.books.page - 1) * state.itemsPerPage;
    const paged = list.slice(start, start + state.itemsPerPage);

    // Geração das Linhas
    const rows = paged.map(b => `
        <tr class="border-b border-gray-100 hover:bg-gray-50 transition group ${b.active ? '' : 'opacity-60 bg-gray-50'}">
            <td class="p-3"><img src="${b.cover}" class="w-10 h-14 object-cover rounded shadow-sm"></td>
            <td class="p-3 font-bold text-primary">${b.title}</td>
            <td class="p-3 text-gray-500 text-xs">
                ${b.isPromotion ? `<div class="flex flex-col"><span class="line-through text-xs text-gray-400">R$ ${Number(b.price).toFixed(2)}</span><span class="text-green-600 font-bold">R$ ${Number(b.promoPrice).toFixed(2)}</span></div>` : `R$ ${Number(b.price).toFixed(2)}`}
            </td>
            <td class="p-3 text-center">
                <span class="inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-full ${b.active ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-500 border border-gray-200'}">
                    <span class="w-1.5 h-1.5 rounded-full ${b.active ? 'bg-green-500' : 'bg-gray-400'}"></span>
                    ${b.active ? 'Ativo' : 'Inativo'}
                </span>
            </td>
            <td class="p-3 text-right">
                <button class="btn-edit-book text-blue-500 hover:bg-blue-50 p-2 rounded-full transition" data-id="${b.id}"><i class="ph-bold ph-pencil-simple"></i></button>
                <button class="btn-delete-book text-red-400 hover:bg-red-50 p-2 rounded-full transition" data-id="${b.id}"><i class="ph-bold ph-trash"></i></button>
            </td>
        </tr>
    `).join('');

    return `
        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div><h3 class="font-bold text-lg text-primary flex items-center gap-2"><i class="ph-fill ph-book text-accent"></i> Catálogo de Livros</h3></div>
                <div class="flex gap-2 flex-1 justify-end w-full md:w-auto">
                    <input type="text" id="filter-books" placeholder="Buscar livro..." value="${state.books.filter}" class="bg-gray-50 border border-gray-200 rounded-lg text-xs p-2 w-full md:w-64 focus:outline-none focus:border-accent">
                    <button id="btn-new-book" class="text-white bg-primary px-4 py-2 rounded-lg text-xs font-bold uppercase hover:bg-accent transition shadow-lg flex items-center gap-2 whitespace-nowrap"><i class="ph-bold ph-plus"></i> Novo</button>
                </div>
            </div>
            <div class="overflow-x-auto min-h-[300px]">
                <table class="w-full text-left text-sm text-gray-600">
                    <thead class="bg-gray-50 text-gray-400 uppercase text-[10px] border-b border-gray-200">
                        <tr>
                            <th class="p-3">Capa</th>
                            <th class="p-3 cursor-pointer hover:text-primary transition" data-sort="books:title">Título <i class="ph-bold ph-arrows-down-up ml-1"></i></th>
                            <th class="p-3 cursor-pointer hover:text-primary transition" data-sort="books:price">Preço <i class="ph-bold ph-arrows-down-up ml-1"></i></th>
                            <th class="p-3 text-center">Status</th>
                            <th class="p-3 text-right">Ação</th>
                        </tr>
                    </thead>
                    <tbody>${rows || '<tr><td colspan="5" class="p-4 text-center">Nada encontrado.</td></tr>'}</tbody>
                </table>
            </div>
            <div class="flex justify-between items-center border-t border-gray-100 pt-4 mt-4">
                <span class="text-xs text-gray-400">Mostrando ${paged.length} de ${list.length}</span>
                <div class="flex gap-2">
                    <button class="w-8 h-8 rounded border hover:bg-gray-100 flex items-center justify-center btn-page-book" data-dir="-1" ${state.books.page === 1 ? 'disabled' : ''}><i class="ph-bold ph-caret-left"></i></button>
                    <span class="text-xs font-bold px-2 self-center">Pág ${state.books.page}</span>
                    <button class="w-8 h-8 rounded border hover:bg-gray-100 flex items-center justify-center btn-page-book" data-dir="1" ${state.books.page >= totalPages ? 'disabled' : ''}><i class="ph-bold ph-caret-right"></i></button>
                </div>
            </div>
        </div>
    `;
}

function renderServicesPanel() {
    let list = serviceService.getAllForAdmin().filter(s => s.name.toLowerCase().includes(state.services.filter.toLowerCase()));
    
    list.sort((a, b) => {
        let vA = a[state.services.sortKey], vB = b[state.services.sortKey];
        if (typeof vA === 'string') vA = vA.toLowerCase();
        if (typeof vB === 'string') vB = vB.toLowerCase();
        if (vA < vB) return state.services.sortOrder === 'asc' ? -1 : 1;
        if (vA > vB) return state.services.sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    const totalPages = Math.ceil(list.length / state.itemsPerPage);
    if(state.services.page > totalPages && totalPages > 0) state.services.page = totalPages;
    if(state.services.page < 1) state.services.page = 1;

    const start = (state.services.page - 1) * state.itemsPerPage;
    const paged = list.slice(start, start + state.itemsPerPage);

    const rows = paged.map(s => {
        const theme = THEMES[s.theme || 'default'];
        return `
        <tr class="border-b ${theme.border} ${s.active ? theme.bg : 'bg-gray-50 opacity-60'} hover:brightness-95 transition">
            <td class="p-3">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-white/60 flex items-center justify-center shadow-sm text-lg ${theme.text}">
                        <i class="ph-fill ${s.icon || 'ph-star-four'}"></i>
                    </div>
                    <div>
                        <div class="font-bold text-gray-800 text-sm">${s.name}</div>
                    </div>
                </div>
            </td>
            <td class="p-3 font-mono text-xs ${theme.text}">
                ${s.isPromotion && s.promoPrice ? `<span class="line-through opacity-50">R$ ${Number(s.price).toFixed(2)}</span> <span class="font-bold">R$ ${Number(s.promoPrice).toFixed(2)}</span>` : `<span class="font-bold">R$ ${Number(s.price).toFixed(2)}</span>`}
            </td>
            <td class="p-3 text-center">
                <span class="inline-flex items-center gap-1.5 text-[10px] font-bold px-3 py-1 rounded-full bg-white/50 border ${theme.border} ${theme.text}">
                    <span class="w-1.5 h-1.5 rounded-full ${s.active ? 'bg-green-500' : 'bg-gray-400'}"></span>
                    ${s.active ? 'Ativo' : 'Inativo'}
                </span>
            </td>
            <td class="p-3 text-right">
                <button class="btn-edit-service text-blue-600 hover:bg-white p-2 rounded-full transition shadow-sm" data-id="${s.id}"><i class="ph-bold ph-pencil-simple"></i></button>
                <button class="btn-delete-service text-red-500 hover:bg-white p-2 rounded-full transition shadow-sm" data-id="${s.id}"><i class="ph-bold ph-trash"></i></button>
            </td>
        </tr>
    `}).join('');

    return `
        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 border-t-4 border-t-blue-500">
            <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div><h3 class="font-bold text-lg text-primary flex items-center gap-2"><i class="ph-fill ph-briefcase text-blue-500"></i> Meus Serviços</h3></div>
                <div class="flex gap-2 flex-1 justify-end w-full md:w-auto">
                    <input type="text" id="filter-services" placeholder="Buscar serviço..." value="${state.services.filter}" class="bg-gray-50 border border-gray-200 rounded-lg text-xs p-2 w-full md:w-64 focus:outline-none focus:border-blue-500">
                    <button id="btn-new-service" class="text-white bg-blue-600 px-4 py-2 rounded-lg text-xs font-bold uppercase hover:bg-blue-700 transition shadow-lg flex items-center gap-2 whitespace-nowrap"><i class="ph-bold ph-plus"></i> Novo</button>
                </div>
            </div>
            <div class="overflow-x-auto min-h-[300px]">
                <table class="w-full text-left text-sm text-gray-600">
                    <thead class="bg-blue-50 text-blue-400 uppercase text-[10px] border-b border-blue-100">
                        <tr>
                            <th class="p-3 cursor-pointer" data-sort="services:name">Serviço <i class="ph-bold ph-arrows-down-up ml-1"></i></th>
                            <th class="p-3 cursor-pointer" data-sort="services:price">Preço Base <i class="ph-bold ph-arrows-down-up ml-1"></i></th>
                            <th class="p-3 text-center">Status</th>
                            <th class="p-3 text-right">Ação</th>
                        </tr>
                    </thead>
                    <tbody>${rows || '<tr><td colspan="4" class="p-4 text-center">Nada encontrado.</td></tr>'}</tbody>
                </table>
            </div>
            <div class="flex justify-between items-center border-t border-gray-100 pt-4 mt-4">
                <span class="text-xs text-gray-400">Mostrando ${paged.length} de ${list.length}</span>
                <div class="flex gap-2">
                    <button class="w-8 h-8 rounded border hover:bg-gray-100 flex items-center justify-center btn-page-service" data-dir="-1" ${state.services.page === 1 ? 'disabled' : ''}><i class="ph-bold ph-caret-left"></i></button>
                    <span class="text-xs font-bold px-2 self-center">Pág ${state.services.page}</span>
                    <button class="w-8 h-8 rounded border hover:bg-gray-100 flex items-center justify-center btn-page-service" data-dir="1" ${state.services.page >= totalPages ? 'disabled' : ''}><i class="ph-bold ph-caret-right"></i></button>
                </div>
            </div>
        </div>
    `;
}

// --- MODAIS ---

function openBookModal(bookId = null) {
    const isEdit = !!bookId;
    const book = bookId ? bookService.getById(bookId) : { title: '', genre: 'Ficção', price: '', promoPrice: '', cover: 'https://placehold.co/300x450/333/FFF?text=Capa', synopsis: '', coverSynopsis: '', active: true, isPromotion: false };

    const bodyHTML = `
        <div class="space-y-4 h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            <input type="hidden" id="book-id" value="${book.id || ''}">
            <div class="flex gap-4 items-start bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div class="w-24 h-36 bg-gray-200 rounded shadow-sm overflow-hidden flex-shrink-0">
                    <img id="preview-book-cover" src="${book.cover}" class="w-full h-full object-cover">
                </div>
                <div class="flex-1">
                    <label class="text-xs font-bold text-primary uppercase block mb-2">Capa do Livro</label>
                    <input type="text" id="book-cover" value="${book.cover}" class="text-xs w-full bg-white border border-gray-200 rounded-lg p-2" onchange="document.getElementById('preview-book-cover').src = this.value">
                </div>
            </div>
            <div class="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div><label class="text-xs font-bold text-gray-500 uppercase block">Visibilidade</label><span class="text-sm font-bold text-primary">O livro está visível no site?</span></div>
                <label class="relative inline-flex items-center cursor-pointer"><input type="checkbox" id="book-active" class="sr-only peer" ${book.active ? 'checked' : ''}><div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div></label>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div class="col-span-2"><label class="text-xs font-bold text-gray-500 uppercase">Título</label><input type="text" id="book-title" value="${book.title}" class="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 form-input font-bold text-gray-700"></div>
                <div><label class="text-xs font-bold text-gray-500 uppercase">Gênero</label><select id="book-genre" class="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 form-input"><option value="Ficção" ${book.genre === 'Ficção' ? 'selected' : ''}>Ficção</option><option value="Fantasia" ${book.genre === 'Fantasia' ? 'selected' : ''}>Fantasia</option><option value="Terror" ${book.genre === 'Terror' ? 'selected' : ''}>Terror</option></select></div>
                <div><label class="text-xs font-bold text-gray-500 uppercase">Preço (R$)</label><input type="number" step="0.01" id="book-price" value="${book.price}" class="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 form-input"></div>
            </div>
            <div class="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <label class="text-xs font-bold text-primary uppercase flex justify-between">Resumo da Capa<span class="text-gray-400 font-normal text-[10px]">Máx 65 car.</span></label>
                <input type="text" id="book-cover-synopsis" value="${book.coverSynopsis || ''}" maxlength="65" class="w-full bg-white border border-gray-300 rounded-lg p-2 mt-1 form-input text-sm">
            </div>
            <div class="bg-orange-50 p-4 rounded-xl border border-orange-100 transition-all">
                <div class="flex items-center justify-between mb-2">
                    <div><h4 class="font-bold text-orange-800 text-sm">Modo Promoção</h4></div>
                    <label class="relative inline-flex items-center cursor-pointer"><input type="checkbox" id="book-promo" class="sr-only peer" ${book.isPromotion ? 'checked' : ''}><div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-accent after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div></label>
                </div>
                <div id="promo-input-container" class="${book.isPromotion ? '' : 'hidden'} mt-3 border-t border-orange-200 pt-3">
                    <label class="text-xs font-bold text-orange-700 uppercase">Preço Promocional (R$)</label>
                    <input type="number" step="0.01" id="book-promo-price" value="${book.promoPrice || ''}" class="w-full bg-white border border-orange-200 rounded-lg p-2 form-input text-orange-900 font-bold">
                </div>
            </div>
            <div><label class="text-xs font-bold text-gray-500 uppercase">Sinopse Completa</label><textarea id="book-synopsis" rows="4" class="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 form-input text-sm">${book.synopsis || ''}</textarea></div>
        </div>
    `;

    const footerHTML = `<button onclick="Modal.close()" class="px-4 py-2 text-gray-500 font-bold text-sm hover:bg-gray-100 rounded-lg">Cancelar</button><button id="btn-save-book" class="bg-primary text-white px-6 py-2 rounded-lg font-bold shadow-lg">Salvar Livro</button>`;
    
    Modal.open(isEdit ? 'Editar Livro' : 'Novo Livro', bodyHTML, footerHTML);

    // Lógica do Modal
    const promoCheck = document.getElementById('book-promo');
    if(promoCheck) {
        promoCheck.onchange = (e) => {
            document.getElementById('promo-input-container').classList.toggle('hidden', !e.target.checked);
        };
    }

    document.getElementById('btn-save-book').onclick = () => {
        const data = {
            id: document.getElementById('book-id').value,
            title: document.getElementById('book-title').value,
            genre: document.getElementById('book-genre').value,
            price: document.getElementById('book-price').value,
            cover: document.getElementById('book-cover').value,
            synopsis: document.getElementById('book-synopsis').value,
            coverSynopsis: document.getElementById('book-cover-synopsis').value,
            active: document.getElementById('book-active').checked,
            isPromotion: document.getElementById('book-promo').checked,
            promoPrice: document.getElementById('book-promo-price').value
        };
        bookService.save(data);
        Modal.close();
        window.location.reload(); // Simples refresh para ver mudanças
    };
}

function openServiceEditModal(serviceId = null) {
    const isEdit = !!serviceId;
    const s = serviceId ? serviceService.getById(serviceId) : { id: '', name: '', price: '', unit: '', description: '', active: true, isPromotion: false, promoPrice: '', icon: 'ph-star-four', theme: 'default' };

    const bodyHTML = `
        <div class="space-y-5 h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            <input type="hidden" id="service-id" value="${s.id || ''}">
            <div class="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                <span class="text-xs font-bold text-gray-500 uppercase">Status do Serviço</span>
                <label class="relative inline-flex items-center cursor-pointer"><input type="checkbox" id="service-active" class="sr-only peer" ${s.active ? 'checked' : ''}><div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div></label>
            </div>
            <div class="space-y-4">
                <div><label class="text-xs font-bold text-gray-500 uppercase">Nome do Serviço</label><input type="text" id="service-name" value="${s.name}" class="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 form-input font-bold text-gray-700"></div>
                <div class="grid grid-cols-2 gap-4">
                    <div><label class="text-xs font-bold text-gray-500 uppercase">Preço Base (R$)</label><input type="number" step="0.01" id="service-price" value="${s.price}" class="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 form-input"></div>
                    <div><label class="text-xs font-bold text-gray-500 uppercase">Unidade</label><input type="text" id="service-unit" value="${s.unit || ''}" placeholder="Ex: p/ hora" class="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 form-input"></div>
                </div>
            </div>
            <div class="bg-gray-50 p-5 rounded-xl border border-gray-200">
                <div class="mb-4 border-b border-gray-200 pb-2"><span class="font-bold text-gray-800 text-sm flex items-center gap-2"><i class="ph-fill ph-paint-brush text-accent"></i> Visual</span></div>
                <div><label class="text-xs font-bold text-gray-500 uppercase mb-2 block">Ícone (Phosphor)</label><input type="text" id="service-icon" value="${s.icon}" class="w-full bg-white border border-gray-300 rounded-lg p-2"></div>
                <div class="mt-4"><label class="text-xs font-bold text-gray-500 uppercase mb-2 block">Tema</label><select id="service-theme" class="w-full bg-white border border-gray-300 rounded-lg p-2"><option value="default">Midnight</option><option value="orange">Sunset</option><option value="blue">Ocean</option><option value="purple">Royal</option><option value="green">Forest</option></select></div>
            </div>
            <div><label class="text-xs font-bold text-gray-500 uppercase">Descrição</label><textarea id="service-desc" rows="3" class="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 form-input text-sm">${s.description}</textarea></div>
        </div>`;

    const footerHTML = `<button onclick="Modal.close()" class="px-4 py-2 text-gray-500">Cancelar</button><button id="btn-save-service" class="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold">Salvar</button>`;
    
    Modal.open(isEdit ? 'Editar Serviço' : 'Novo Serviço', bodyHTML, footerHTML);
    
    const themeSelect = document.getElementById('service-theme');
    if(themeSelect) themeSelect.value = s.theme || 'default';

    document.getElementById('btn-save-service').onclick = () => {
        const data = {
            id: document.getElementById('service-id').value,
            name: document.getElementById('service-name').value,
            price: document.getElementById('service-price').value,
            unit: document.getElementById('service-unit').value,
            description: document.getElementById('service-desc').value,
            active: document.getElementById('service-active').checked,
            icon: document.getElementById('service-icon').value,
            theme: document.getElementById('service-theme').value
        };
        serviceService.save(data);
        Modal.close();
        window.location.reload();
    };
}

// --- VIEW PRINCIPAL ---

export const DashboardView = {
    render: async () => {
        if (!authService.isAuthenticated()) {
            window.location.hash = '/login';
            return '';
        }

        // Dados seguros (evita erro se db.data ainda for null)
        const books = db.data?.books || [];
        const services = db.data?.services || [];
        const leads = db.data?.leads || [];

        const totalBooks = books.length;
        const totalServices = services.filter(s => s.active).length;
        const totalLeads = leads.length;
        const pendingLeads = leads.filter(l => l.status === 'pending').length;

        // Montagem do HTML completo
        return `
            <div class="animate-fade-in">
                <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <div>
                        <h2 class="text-3xl font-bold text-primary font-serif">Painel do Escritor</h2>
                        <p class="text-gray-500">Gestão completa de Produtos e Serviços.</p>
                    </div>
                    <button id="btn-logout" class="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition font-bold text-sm">
                        <i class="ph ph-sign-out"></i> Sair
                    </button>
                </div>

                <div class="flex gap-6 border-b border-gray-200 mb-8 overflow-x-auto">
                    <button class="pb-3 text-sm font-bold border-b-2 border-accent text-primary transition whitespace-nowrap">Visão Geral & Cruds</button>
                </div>

                <div id="dashboard-content-area" class="space-y-8">
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
                            <h3 class="text-3xl font-black text-gray-700">${totalLeads}</h3>
                        </div>
                        <div class="dashboard-card bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <p class="text-gray-400 text-xs font-bold uppercase tracking-wide mb-1">Pendências</p>
                            <h3 class="text-3xl font-black text-red-500">${pendingLeads}</h3>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div id="container-books">${renderBooksPanel()}</div>
                        <div id="container-services">${renderServicesPanel()}</div>
                    </div>
                </div>
                <div class="h-20"></div>
            </div>
        `;
    },

    afterRender: async () => {
        if (!authService.isAuthenticated()) return;

        const btnLogout = document.getElementById('btn-logout');
        if(btnLogout) {
            btnLogout.onclick = () => {
                authService.logout();
                window.location.hash = '/login'; // Ajuste conforme seu router
                // window.Toast.show('Você saiu do sistema.', 'success'); // Se tiver Toast global
            };
        }

        // --- EVENTOS LIVROS ---
        const setupBookEvents = () => {
            const btnNew = document.getElementById('btn-new-book');
            if(btnNew) btnNew.onclick = () => openBookModal();
            
            const filterInput = document.getElementById('filter-books');
            if(filterInput) {
                filterInput.oninput = (e) => {
                    state.books.filter = e.target.value;
                    state.books.page = 1;
                    document.getElementById('container-books').innerHTML = renderBooksPanel();
                    setupBookEvents();
                };
                // Mantém foco
                const len = filterInput.value.length;
                filterInput.focus();
                filterInput.setSelectionRange(len, len);
            }
            
            document.querySelectorAll('.btn-page-book').forEach(btn => btn.onclick = () => {
                state.books.page += parseInt(btn.dataset.dir);
                document.getElementById('container-books').innerHTML = renderBooksPanel();
                setupBookEvents();
            });
            
            document.querySelectorAll('[data-sort^="books:"]').forEach(th => th.onclick = () => {
                const key = th.dataset.sort.split(':')[1];
                state.books.sortKey = key;
                state.books.sortOrder = state.books.sortOrder === 'asc' ? 'desc' : 'asc';
                document.getElementById('container-books').innerHTML = renderBooksPanel();
                setupBookEvents();
            });
            
            document.querySelectorAll('.btn-edit-book').forEach(btn => btn.onclick = () => openBookModal(btn.dataset.id));
            
            document.querySelectorAll('.btn-delete-book').forEach(btn => btn.onclick = () => {
                if(confirm('Excluir livro?')) { bookService.delete(btn.dataset.id); window.location.reload(); }
            });
        };
        setupBookEvents();

        // --- EVENTOS SERVIÇOS ---
        const setupServiceEvents = () => {
            const btnNew = document.getElementById('btn-new-service');
            if(btnNew) btnNew.onclick = () => openServiceEditModal();
            
            const filterInput = document.getElementById('filter-services');
            if(filterInput) {
                filterInput.oninput = (e) => {
                    state.services.filter = e.target.value;
                    state.services.page = 1;
                    document.getElementById('container-services').innerHTML = renderServicesPanel();
                    setupServiceEvents();
                };
                 // Mantém foco
                const len = filterInput.value.length;
                filterInput.focus();
                filterInput.setSelectionRange(len, len);
            }
            
            document.querySelectorAll('.btn-page-service').forEach(btn => btn.onclick = () => {
                state.services.page += parseInt(btn.dataset.dir);
                document.getElementById('container-services').innerHTML = renderServicesPanel();
                setupServiceEvents();
            });
            
            document.querySelectorAll('[data-sort^="services:"]').forEach(th => th.onclick = () => {
                const key = th.dataset.sort.split(':')[1];
                state.services.sortKey = key;
                state.services.sortOrder = state.services.sortOrder === 'asc' ? 'desc' : 'asc';
                document.getElementById('container-services').innerHTML = renderServicesPanel();
                setupServiceEvents();
            });
            
            document.querySelectorAll('.btn-edit-service').forEach(btn => btn.onclick = () => openServiceEditModal(btn.dataset.id));
            
            document.querySelectorAll('.btn-delete-service').forEach(btn => btn.onclick = () => {
                if(confirm('Excluir serviço?')) { serviceService.delete(btn.dataset.id); window.location.reload(); }
            });
        };
        setupServiceEvents();
    }
};