import { bookRepository } from '../repositories/BookRepository.js';
import { serviceRepository } from '../repositories/ServiceRepository.js';
import { db } from '../infra/MockDatabase.js';

let currentTab = 'main';

function renderBooksTable() {
    const books = bookRepository.getAll();
    if(books.length === 0) return '<tr><td colspan="6" class="p-8 text-center text-gray-400">Nenhum livro.</td></tr>';

    return books.map(b => `
        <tr class="border-b border-gray-100 hover:bg-gray-50 transition group ${b.active ? '' : 'opacity-60 bg-gray-50'}">
            <td class="p-3"><img src="${b.cover}" class="w-10 h-14 object-cover rounded shadow-sm"></td>
            <td class="p-3 font-bold text-primary">${b.title}</td>
            <td class="p-3 text-gray-500">R$ ${b.price.toFixed(2)}</td>
            <td class="p-3 text-center">
                <span class="inline-flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-full ${b.active ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-500 border border-gray-200'}">
                    <span class="w-1.5 h-1.5 rounded-full ${b.active ? 'bg-green-500' : 'bg-gray-400'}"></span>
                    ${b.active ? 'Ativo' : 'Inativo'}
                </span>
            </td>
            <td class="p-3 text-right">
                <button class="text-blue-500 hover:bg-blue-50 p-2 rounded-full transition"><i class="ph-bold ph-pencil-simple"></i></button>
                <button class="text-red-400 hover:bg-red-50 p-2 rounded-full transition"><i class="ph-bold ph-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function renderServicesTable() {
    const services = serviceRepository.getAll();
    if(services.length === 0) return '<tr><td colspan="5" class="p-8 text-center text-gray-400">Nenhum serviço.</td></tr>';

    return services.map(s => `
        <tr class="border-b border-gray-100 hover:bg-gray-50 transition">
            <td class="p-3 font-bold text-gray-800 flex items-center gap-2"><i class="ph-fill ${s.icon} text-lg text-gray-400"></i> ${s.name}</td>
            <td class="p-3 text-gray-500">R$ ${s.price.toFixed(2)}</td>
            <td class="p-3 text-center">
                 <span class="inline-flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-full ${s.active ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-500 border border-gray-200'}">
                    ${s.active ? 'Ativo' : 'Inativo'}
                </span>
            </td>
            <td class="p-3 text-right">
                <button class="text-blue-500 hover:bg-blue-50 p-2 rounded-full transition"><i class="ph-bold ph-pencil-simple"></i></button>
                <button class="text-red-400 hover:bg-red-50 p-2 rounded-full transition"><i class="ph-bold ph-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function renderMainTab() {
    const totalBooks = bookRepository.getAll().length;
    const totalServices = serviceRepository.getAll().length;
    const pendingLeads = db.data.leads.filter(l => l.status === 'pending').length;

    return `
        <div class="animate-fade-in">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <div class="dashboard-card border-l-4 border-accent">
                    <p class="text-gray-400 text-xs font-bold uppercase tracking-wide mb-1">Livros Publicados</p>
                    <h3 class="text-3xl font-black text-primary">${totalBooks}</h3>
                </div>
                <div class="dashboard-card border-l-4 border-blue-500">
                    <p class="text-gray-400 text-xs font-bold uppercase tracking-wide mb-1">Serviços Ativos</p>
                    <h3 class="text-3xl font-black text-primary">${totalServices}</h3>
                </div>
                <div class="dashboard-card">
                    <p class="text-gray-400 text-xs font-bold uppercase tracking-wide mb-1">Pendências</p>
                    <h3 class="text-3xl font-black text-accent">${pendingLeads}</h3>
                </div>
            </div>

            <div class="grid grid-cols-1 gap-12">
                <div class="dashboard-card">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="font-bold text-lg text-primary"><i class="ph-fill ph-book text-accent"></i> Catálogo de Livros</h3>
                        <button class="bg-primary text-white px-4 py-2 rounded-lg text-xs font-bold uppercase shadow hover:bg-accent transition">Novo Livro</button>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-sm text-gray-600">
                            <thead class="bg-gray-50 text-gray-400 uppercase text-xs border-b border-gray-200">
                                <tr><th class="p-3">Capa</th><th class="p-3">Título</th><th class="p-3">Preço</th><th class="p-3 text-center">Status</th><th class="p-3 text-right">Ação</th></tr>
                            </thead>
                            <tbody>${renderBooksTable()}</tbody>
                        </table>
                    </div>
                </div>

                <div class="dashboard-card border-t-4 border-blue-500">
                     <div class="flex justify-between items-center mb-6">
                        <h3 class="font-bold text-lg text-primary"><i class="ph-fill ph-briefcase text-blue-500"></i> Meus Serviços</h3>
                        <button class="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase shadow hover:bg-blue-700 transition">Novo Serviço</button>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-sm text-gray-600">
                            <thead class="bg-blue-50 text-blue-400 uppercase text-xs border-b border-blue-100">
                                <tr><th class="p-3">Serviço</th><th class="p-3">Preço Base</th><th class="p-3 text-center">Status</th><th class="p-3 text-right">Ação</th></tr>
                            </thead>
                            <tbody>${renderServicesTable()}</tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export const DashboardView = {
    render: () => {
        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        if (!isAdmin) {
            window.location.hash = '#/login';
            return '';
        }

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
                    <button data-tab="main" class="tab-btn pb-3 text-sm font-bold border-b-2 transition whitespace-nowrap ${currentTab === 'main' ? 'border-accent text-primary' : 'border-transparent text-gray-400 hover:text-primary'}">Visão Geral & Cruds</button>
                    <button data-tab="analytics" class="tab-btn pb-3 text-sm font-bold border-b-2 border-transparent text-gray-400 hover:text-primary transition whitespace-nowrap">Relatórios (Em breve)</button>
                    <button data-tab="leads" class="tab-btn pb-3 text-sm font-bold border-b-2 border-transparent text-gray-400 hover:text-primary transition whitespace-nowrap">Solicitações</button>
                </div>

                <div id="dashboard-content">
                    ${currentTab === 'main' ? renderMainTab() : '<div class="p-10 text-center text-gray-400">Módulo em construção...</div>'}
                </div>
                <div class="h-20"></div>
            </div>
        `;
    },

    afterRender: () => {
        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        if (!isAdmin) return;

        document.getElementById('btn-logout').onclick = () => {
            localStorage.removeItem('isAdmin');
            window.location.hash = '#/login';
        };

        const contentDiv = document.getElementById('dashboard-content');
        const tabBtns = document.querySelectorAll('.tab-btn');

        tabBtns.forEach(btn => {
            btn.onclick = () => {
                tabBtns.forEach(b => {
                    b.classList.remove('border-accent', 'text-primary');
                    b.classList.add('border-transparent', 'text-gray-400');
                });
                btn.classList.remove('border-transparent', 'text-gray-400');
                btn.classList.add('border-accent', 'text-primary');

                const tab = btn.dataset.tab;
                currentTab = tab;

                if (tab === 'main') contentDiv.innerHTML = renderMainTab();
                else contentDiv.innerHTML = '<div class="p-10 text-center text-gray-400 italic bg-gray-50 rounded-xl border border-dashed border-gray-200">Módulo carregado sob demanda (Próxima etapa).</div>';
            };
        });
    }
};