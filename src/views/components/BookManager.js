import { db } from '../../infra/MockDatabase.js';
import { Modal } from '../../components/Modal.js';
import { Toast } from '../../components/assets/js/Toast.js';

export const BookManager = {
    state: { filter: '', page: 1, itemsPerPage: 5, sortKey: 'title', sortOrder: 'asc' },

    renderTable: () => {
        const books = db.data.books.filter(b => b.title.toLowerCase().includes(BookManager.state.filter.toLowerCase()));
        
        books.sort((a, b) => {
            const vA = a[BookManager.state.sortKey], vB = b[BookManager.state.sortKey];
            const valA = typeof vA === 'string' ? vA.toLowerCase() : vA;
            const valB = typeof vB === 'string' ? vB.toLowerCase() : vB;
            if(BookManager.state.sortOrder === 'asc') return valA > valB ? 1 : -1;
            return valA < valB ? 1 : -1;
        });

        const start = (BookManager.state.page - 1) * BookManager.state.itemsPerPage;
        const paged = books.slice(start, start + BookManager.state.itemsPerPage);

        // Helper de Ícone de Ordenação
        const sortIcon = (key) => BookManager.state.sortKey === key ? 
            (BookManager.state.sortOrder === 'asc' ? 'ph-caret-up text-primary' : 'ph-caret-down text-primary') : 
            'ph-arrows-down-up text-gray-300 group-hover:text-primary';

        const rows = paged.map(b => `
            <tr class="border-b border-gray-100 hover:bg-gray-50 transition group ${b.active ? '' : 'opacity-60 bg-gray-50'}">
                <td class="p-3"><img src="${b.cover}" class="w-10 h-14 object-cover rounded shadow-sm"></td>
                <td class="p-3 font-bold text-primary">${b.title}</td>
                <td class="p-3 text-gray-500 text-xs">
                    ${b.isPromotion ? `<div class="flex flex-col"><span class="line-through text-xs text-gray-400">R$ ${b.price.toFixed(2)}</span><span class="text-green-600 font-bold">R$ ${b.promoPrice.toFixed(2)}</span></div>` : `R$ ${b.price.toFixed(2)}`}
                </td>
                
                <td class="p-3 text-center">
                    ${b.isPromotion ? 
                        '<span class="px-2 py-1 bg-orange-100 text-orange-700 text-[10px] font-bold rounded uppercase border border-orange-200">Oferta</span>' : 
                        '<span class="text-gray-300">-</span>'
                    }
                </td>

                <td class="p-3 text-center">
                    <span class="inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-full ${b.active ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-500 border border-gray-200'}">
                        <span class="w-1.5 h-1.5 rounded-full ${b.active ? 'bg-green-500' : 'bg-gray-400'}"></span>
                        ${b.active ? 'Ativo' : 'Inativo'}
                    </span>
                </td>
                <td class="p-3 text-right">
                    <button onclick="window.app.openBookModal('${b.id}')" class="btn-edit-book text-blue-500 hover:bg-blue-50 p-2 rounded-full transition"><i class="ph-bold ph-pencil-simple"></i></button>
                    <button onclick="window.app.askDelete('book', '${b.id}')" class="btn-delete-book text-red-400 hover:bg-red-50 p-2 rounded-full transition"><i class="ph-bold ph-trash"></i></button>
                </td>
            </tr>
        `).join('');

        return `
            <div class="overflow-x-auto min-h-[300px]">
                <table class="w-full text-left text-sm text-gray-600">
                    <thead class="bg-gray-50 text-gray-400 uppercase text-[10px] border-b border-gray-200">
                        <tr>
                            <th class="p-3">Capa</th>
                            <th class="p-3 cursor-pointer hover:text-primary transition select-none group" onclick="window.app.sortData('books', 'title')">
                                Título <i class="ph-bold ${sortIcon('title')} ml-1 align-middle"></i>
                            </th>
                            <th class="p-3 cursor-pointer hover:text-primary transition select-none group" onclick="window.app.sortData('books', 'price')">
                                Preço <i class="ph-bold ${sortIcon('price')} ml-1 align-middle"></i>
                            </th>
                            <th class="p-3 text-center cursor-pointer hover:text-primary transition select-none group" onclick="window.app.sortData('books', 'isPromotion')">
                                Promoção <i class="ph-bold ${sortIcon('isPromotion')} ml-1 align-middle"></i>
                            </th>
                            <th class="p-3 text-center cursor-pointer hover:text-primary transition select-none group" onclick="window.app.sortData('books', 'active')">
                                Status <i class="ph-bold ${sortIcon('active')} ml-1 align-middle"></i>
                            </th>
                            <th class="p-3 text-right">Ação</th>
                        </tr>
                    </thead>
                    <tbody>${rows || '<tr><td colspan="6" class="p-4 text-center">Nada encontrado.</td></tr>'}</tbody>
                </table>
            </div>
        `;
    },

    openModal: (id = null) => {
        const book = id ? db.data.books.find(b => b.id == id) : { 
            id: '', title: '', genre: 'Ficção', price: '', promoPrice: '', 
            cover: 'https://placehold.co/300x450/333/FFF?text=Capa', 
            synopsis: '', coverSynopsis: '', 
            active: true, isPromotion: false, 
            linkAmazon: '', linkML: '', linkShopee: '', linkGeneric: ''
        };
        const isEdit = !!id;

        const toggleScript = `if(this.checked){document.getElementById('promo-input-container').classList.remove('hidden');document.getElementById('book-promo-price').focus();}else{document.getElementById('promo-input-container').classList.add('hidden');document.getElementById('book-promo-price').value='';}`;

        const bodyHTML = `
            <div class="space-y-4 h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                <input type="hidden" id="book-id" value="${book.id || ''}">
                
                <div class="flex gap-4 items-start bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div class="w-24 h-36 bg-gray-200 rounded shadow-sm overflow-hidden flex-shrink-0">
                        <img id="preview-book-cover" src="${book.cover}" class="w-full h-full object-cover">
                    </div>
                    <div class="flex-1">
                        <label class="text-xs font-bold text-primary uppercase block mb-2">Capa do Livro</label>
                        <p class="text-xs text-gray-400 mb-3">Recomendado: Proporção 2:3 (Ex: 600x900px)</p>
                        <input type="file" id="file-upload-book" accept="image/*" class="text-xs w-full text-gray-500 file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-white file:border-gray-200 file:text-primary file:shadow-sm hover:file:bg-gray-50 cursor-pointer">
                        <input type="hidden" id="book-cover" value="${book.cover}">
                    </div>
                </div>

                <div class="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <div>
                        <label class="text-xs font-bold text-gray-500 uppercase block">Visibilidade</label>
                        <span class="text-sm font-bold text-primary">O livro está visível no site?</span>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="book-active" class="sr-only peer" ${book.active ? 'checked' : ''}>
                        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <div class="col-span-2">
                        <label class="text-xs font-bold text-gray-500 uppercase">Título da Obra</label>
                        <input type="text" id="book-title" value="${book.title}" class="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 form-input font-bold text-gray-700">
                    </div>
                    <div>
                        <label class="text-xs font-bold text-gray-500 uppercase">Gênero</label>
                        <select id="book-genre" class="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 form-input">
                            <option value="Ficção" ${book.genre === 'Ficção' ? 'selected' : ''}>Ficção</option>
                            <option value="Fantasia" ${book.genre === 'Fantasia' ? 'selected' : ''}>Fantasia</option>
                            <option value="Terror" ${book.genre === 'Terror' ? 'selected' : ''}>Terror</option>
                            <option value="Romance" ${book.genre === 'Romance' ? 'selected' : ''}>Romance</option>
                        </select>
                    </div>
                    <div>
                        <label class="text-xs font-bold text-gray-500 uppercase">Preço Original (R$)</label>
                        <input type="number" step="0.01" id="book-price" value="${book.price}" class="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 form-input">
                    </div>
                </div>
                
                <div class="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <label class="text-xs font-bold text-primary uppercase flex justify-between">Resumo da Capa (Home)<span class="text-gray-400 font-normal text-[10px]">Máx 65 caracteres</span></label>
                    <input type="text" id="book-cover-synopsis" value="${book.coverSynopsis || ''}" maxlength="65" placeholder="Frase de impacto para a Home..." class="w-full bg-white border border-gray-300 rounded-lg p-2 mt-1 form-input text-sm">
                </div>
                
                <div class="bg-orange-50 p-4 rounded-xl border border-orange-100 transition-all">
                    <div class="flex items-center justify-between mb-2">
                        <div>
                            <h4 class="font-bold text-orange-800 text-sm">Modo Promoção</h4>
                            <p class="text-xs text-orange-600">Ativa oferta especial na página.</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" id="book-promo" class="sr-only peer" onchange="${toggleScript}" ${book.isPromotion ? 'checked' : ''}>
                            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                        </label>
                    </div>
                    <div id="promo-input-container" class="${book.isPromotion ? '' : 'hidden'} animate-fade-in mt-3 border-t border-orange-200 pt-3">
                        <label class="text-xs font-bold text-orange-700 uppercase">Preço Promocional (R$)</label>
                        <input type="number" step="0.01" id="book-promo-price" value="${book.promoPrice || ''}" placeholder="Ex: 19.90" class="w-full bg-white border border-orange-200 rounded-lg p-2 form-input text-orange-900 font-bold">
                    </div>
                </div>
                
                <div><label class="text-xs font-bold text-gray-500 uppercase">Sinopse Completa</label><textarea id="book-synopsis" rows="4" class="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 form-input text-sm leading-relaxed">${book.synopsis || ''}</textarea></div>
                
                <div class="border-t border-gray-100 pt-4">
                    <h4 class="font-bold text-gray-700 mb-3 text-sm flex items-center gap-2">
                        <i class="ph-bold ph-link text-primary"></i> Links de Venda
                    </h4>
                    <div class="grid grid-cols-1 gap-2">
                        <div class="relative">
                            <span class="absolute left-3 top-1/2 -translate-y-1/2 transform text-orange-500 flex items-center"><i class="ph-bold ph-amazon-logo text-lg"></i></span>
                            <input type="text" id="link-amazon" value="${book.linkAmazon || ''}" placeholder="Link da Amazon" class="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 pl-10 text-xs focus:border-accent outline-none">
                        </div>
                        <div class="relative">
                            <span class="absolute left-3 top-1/2 -translate-y-1/2 transform text-yellow-600 flex items-center"><i class="ph-bold ph-handbag text-lg"></i></span>
                            <input type="text" id="link-ml" value="${book.linkML || ''}" placeholder="Link Mercado Livre" class="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 pl-10 text-xs focus:border-accent outline-none">
                        </div>
                        <div class="relative">
                            <span class="absolute left-3 top-1/2 -translate-y-1/2 transform text-red-500 flex items-center"><i class="ph-bold ph-shopping-bag text-lg"></i></span>
                            <input type="text" id="link-shopee" value="${book.linkShopee || ''}" placeholder="Link Shopee" class="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 pl-10 text-xs focus:border-accent outline-none">
                        </div>
                        <div class="relative">
                            <span class="absolute left-3 top-1/2 -translate-y-1/2 transform text-blue-400 flex items-center"><i class="ph-bold ph-link text-lg"></i></span>
                            <input type="text" id="link-generic" value="${book.linkGeneric || ''}" placeholder="Outro Link (Site Próprio/Genérico)" class="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 pl-10 text-xs focus:border-accent outline-none">
                        </div>
                    </div>
                </div>
            </div>`;

        const footerHTML = `<button onclick="window.app.closeModal()" class="px-4 py-2 text-gray-500 font-bold text-sm hover:text-gray-800 transition">Cancelar</button><button id="btn-save-book" class="bg-primary hover:bg-slate-800 text-white px-6 py-2 rounded-lg font-bold shadow-lg transition flex items-center gap-2"><i class="ph-bold ph-floppy-disk"></i> Salvar</button>`;
        
        Modal.open(isEdit ? 'Editar Livro' : 'Cadastrar Novo Livro', bodyHTML, footerHTML);
        BookManager.attachModalEvents(isEdit);
    },

    attachModalEvents: (isEdit) => {
        document.getElementById('file-upload-book').onchange = (e) => {
            if(window.app && window.app.handleImageUpload) {
                window.app.handleImageUpload(e.target, 'preview-book-cover', 'book-cover', 2/3);
            }
        };

        document.getElementById('btn-save-book').onclick = () => {
            const id = document.getElementById('book-id').value;
            const title = document.getElementById('book-title').value;

            if(!title) return Toast.show("O título é obrigatório!", "error");

            const data = {
                id: isEdit ? id : Date.now().toString(),
                title,
                genre: document.getElementById('book-genre').value,
                price: parseFloat(document.getElementById('book-price').value) || 0,
                cover: document.getElementById('book-cover').value,
                active: document.getElementById('book-active').checked,
                isPromotion: document.getElementById('book-promo').checked,
                promoPrice: parseFloat(document.getElementById('book-promo-price').value) || 0,
                synopsis: document.getElementById('book-synopsis').value,
                coverSynopsis: document.getElementById('book-cover-synopsis').value,
                linkAmazon: document.getElementById('link-amazon').value,
                linkML: document.getElementById('link-ml').value,
                linkShopee: document.getElementById('link-shopee').value,
                linkGeneric: document.getElementById('link-generic').value
            };

            if(isEdit) {
                const idx = db.data.books.findIndex(b => b.id == id);
                if(idx !== -1) db.data.books[idx] = { ...db.data.books[idx], ...data };
            } else {
                db.data.books.unshift(data);
            }

            Toast.show(isEdit ? "Livro atualizado!" : "Livro cadastrado!", "success");
            Modal.close();
            document.dispatchEvent(new CustomEvent('dashboard:refresh'));
        };
    }
};