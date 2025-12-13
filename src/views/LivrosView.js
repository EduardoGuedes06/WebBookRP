import { bookService } from '../services/BookService.js';

let currentPage = 1;
const itemsPerPage = 6;
let activeBooks = [];

function renderBooksGrid() {
    const start = (currentPage - 1) * itemsPerPage;
    const paginatedBooks = activeBooks.slice(start, start + itemsPerPage);
    
    return paginatedBooks.map(b => `
        <div class="bg-white p-5 rounded-3xl shadow-lg border border-gray-50 flex flex-col h-full group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in">
            
            <div class="relative mb-5 overflow-hidden rounded-2xl bg-gray-100 aspect-[2/3] shadow-inner">
                <a href="#/livro/${b.id}">
                    <img src="${b.cover}" class="w-full h-full object-cover transition duration-700 group-hover:scale-110 cursor-pointer">
                </a>

                <button class="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-md hover:scale-110 transition z-20">
                    <i class="ph-bold ph-heart text-gray-400 text-xl transition-colors"></i>
                </button>
            </div>

            <div class="text-center flex flex-col flex-grow">
                <p class="text-[10px] font-bold text-accent uppercase tracking-wider mb-2">${b.genre}</p>
                
                <a href="#/livro/${b.id}">
                    <h3 class="text-xl font-bold text-gray-900 leading-tight font-serif cursor-pointer hover:text-accent transition mb-3">${b.title}</h3>
                </a>

                <p class="text-gray-500 text-xs mb-6 leading-relaxed line-clamp-3 px-2 flex-grow">
                    ${b.synopsis || "Uma narrativa envolvente que desafia a percepção da realidade. Prepare-se para não conseguir largar."}
                </p>

                <div class="mt-auto w-full">
                    <a href="#/livro/${b.id}" class="block w-full bg-gray-50 hover:bg-primary hover:text-white text-primary font-bold text-sm py-3 rounded-xl transition border border-gray-200 hover:border-primary">
                        Comprar - R$ ${b.isPromotion && b.promoPrice ? b.promoPrice.toFixed(2) : b.price.toFixed(2)}
                    </a>
                </div>
            </div>
        </div>
    `).join('');
}

function renderPagination() {
    const totalPages = Math.ceil(activeBooks.length / itemsPerPage);
    if (totalPages <= 1) return '';

    let html = '';
    // Botão Anterior
    html += `<button id="btn-prev" class="pagination-btn" ${currentPage === 1 ? 'disabled' : ''}><i class="ph ph-caret-left"></i></button>`;
    
    // Números
    for(let i = 1; i <= totalPages; i++) { 
        html += `<button data-page="${i}" class="pagination-btn ${i === currentPage ? 'active' : ''}">${i}</button>`; 
    }
    
    // Botão Próximo
    html += `<button id="btn-next" class="pagination-btn" ${currentPage === totalPages ? 'disabled' : ''}><i class="ph ph-caret-right"></i></button>`;
    
    return html;
}

// O Objeto da View
export const LivrosView = {
    render: () => {
        // Carrega dados novos toda vez que renderiza
        activeBooks = bookService.getCatalog();
        
        return `
            <div class="pt-10 pb-20 animate-fade-in">
                <div class="text-center mb-16">
                    <span class="text-accent font-bold tracking-[0.2em] text-xs uppercase mb-3 block">Biblioteca Oficial</span>
                    <h2 class="text-4xl md:text-5xl font-black text-primary mb-6 font-serif">Obras Publicadas</h2>
                    <p class="text-gray-500 max-w-2xl mx-auto text-lg">Coleção exclusiva. Escolha sua próxima aventura.</p>
                </div>

                <div class="max-w-6xl mx-auto px-4">
                    <div id="books-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        ${renderBooksGrid()}
                    </div>
                    
                    <div id="pagination-controls" class="flex justify-center items-center gap-3 mt-16 pt-8 border-t border-gray-100">
                        ${renderPagination()}
                    </div>
                </div>
            </div>
        `;
    },

    afterRender: () => {
        // AQUI LIGAMOS OS BOTÕES (Sem sujar o HTML com onclick global)
        const grid = document.getElementById('books-grid');
        const controls = document.getElementById('pagination-controls');

        // Função interna para atualizar a tela sem recarregar tudo
        const updateUI = () => {
            grid.innerHTML = renderBooksGrid();
            controls.innerHTML = renderPagination();
            attachEvents(); // Re-conecta os eventos nos botões novos
            grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        };

        const attachEvents = () => {
            // Botões de número
            document.querySelectorAll('[data-page]').forEach(btn => {
                btn.onclick = () => {
                    currentPage = parseInt(btn.dataset.page);
                    updateUI();
                };
            });

            // Botão Voltar
            const btnPrev = document.getElementById('btn-prev');
            if(btnPrev) btnPrev.onclick = () => {
                if(currentPage > 1) { currentPage--; updateUI(); }
            };

            // Botão Avançar
            const btnNext = document.getElementById('btn-next');
            if(btnNext) btnNext.onclick = () => {
                const totalPages = Math.ceil(activeBooks.length / itemsPerPage);
                if(currentPage < totalPages) { currentPage++; updateUI(); }
            };
        };

        attachEvents();
    }
};