import { bookService } from '../services/BookService.js';
import { router } from '../core/Router.js'; // <--- IMPORTANTE: Importar o Router

let currentPage = 1;
const itemsPerPage = 6;

function renderBookCard(b) {
    const favorites = JSON.parse(localStorage.getItem('user_favorites')) || [];
    const isFav = favorites.includes(b.id);
    const heartClass = isFav ? 'ph-fill text-red-500' : 'ph-bold text-gray-400';

    return `
    <div class="bg-white p-5 rounded-3xl shadow-lg border border-gray-50 flex flex-col h-full group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in">
        <div class="relative mb-5 overflow-hidden rounded-2xl bg-gray-100 aspect-[2/3] shadow-inner">
            <img src="${b.cover}" class="nav-link-book w-full h-full object-cover transition duration-700 group-hover:scale-110 cursor-pointer" data-id="${b.id}">
            
            <button data-fav-id="${b.id}" class="btn-toggle-fav absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-md hover:scale-110 transition z-20">
                <i class="${heartClass} ph-heart text-xl transition-colors"></i>
            </button>

            ${b.isPromotion ? `<div class="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg animate-pulse">PROMO</div>` : ''}
        </div>
        
        <div class="text-center flex-1 flex flex-col">
            <p class="text-[10px] font-bold text-accent uppercase tracking-wider mb-2">${b.genre}</p>
            
            <h3 class="nav-link-book text-xl font-bold text-gray-900 leading-tight font-serif cursor-pointer hover:text-accent transition mb-4 flex-1" data-id="${b.id}">
                ${b.title}
            </h3>
            
            <div class="mb-4">
                ${b.isPromotion && b.promoPrice 
                    ? `<span class="text-gray-400 line-through text-xs mr-2">R$ ${b.price.toFixed(2)}</span><span class="text-xl font-black text-primary">R$ ${b.promoPrice.toFixed(2)}</span>`
                    : `<span class="text-xl font-black text-primary">R$ ${b.price.toFixed(2)}</span>`
                }
            </div>

            <button class="nav-link-book w-full bg-gray-50 hover:bg-primary hover:text-white text-primary font-bold text-sm py-3 rounded-xl transition border border-gray-200 hover:border-primary" data-id="${b.id}">
                Detalhes & Compra
            </button>
        </div>
    </div>`;
}

export const LivrosView = {
    render: async () => {
        const allBooks = bookService.getCatalog();
        
        const totalPages = Math.ceil(allBooks.length / itemsPerPage);
        if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        const start = (currentPage - 1) * itemsPerPage;
        const booksToShow = allBooks.slice(start, start + itemsPerPage);

        const booksHTML = booksToShow.length > 0 
            ? booksToShow.map(b => renderBookCard(b)).join('') 
            : '<div class="col-span-3 text-center text-gray-400 py-20">Nenhum livro disponível no momento.</div>';

        let paginationHTML = '';
        if (totalPages > 1) {
            paginationHTML = `
                <div class="flex justify-center items-center gap-3 mt-16 pt-8 border-t border-gray-100">
                    <button id="btn-prev-page" class="w-12 h-12 rounded-xl border border-gray-200 hover:bg-gray-50 flex items-center justify-center transition disabled:opacity-50" ${currentPage === 1 ? 'disabled' : ''}>
                        <i class="ph-bold ph-caret-left"></i>
                    </button>
                    <span class="font-bold text-gray-500 text-sm">Página ${currentPage} de ${totalPages}</span>
                    <button id="btn-next-page" class="w-12 h-12 rounded-xl border border-gray-200 hover:bg-gray-50 flex items-center justify-center transition disabled:opacity-50" ${currentPage === totalPages ? 'disabled' : ''}>
                        <i class="ph-bold ph-caret-right"></i>
                    </button>
                </div>
            `;
        }

        return `
            <div class="animate-fade-in pt-10 pb-20">
                <div class="text-center mb-16">
                    <span class="text-accent font-bold tracking-[0.2em] text-xs uppercase mb-3 block">Biblioteca Oficial</span>
                    <h2 class="text-4xl md:text-5xl font-black text-primary mb-6 font-serif">Obras Publicadas</h2>
                    <p class="text-gray-500 max-w-2xl mx-auto text-lg">Coleção exclusiva. Escolha sua próxima aventura.</p>
                </div>

                <div class="max-w-6xl mx-auto px-4">
                    <div id="books-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        ${booksHTML}
                    </div>
                    ${paginationHTML}
                </div>
            </div>
        `;
    },

    afterRender: async () => {
        // 1. EVENTO DE NAVEGAÇÃO LIMPA (SEM HASH)
        // Pega todos os elementos com a classe .nav-link-book e adiciona o evento de clique
        document.querySelectorAll('.nav-link-book').forEach(el => {
            el.onclick = (e) => {
                e.preventDefault();
                const id = el.dataset.id;
                // Usa o router.navigate para mudar a URL sem recarregar e sem #
                router.navigate(`/livro/${id}`);
            };
        });

        // 2. Paginação
        const btnPrev = document.getElementById('btn-prev-page');
        if(btnPrev) {
            btnPrev.onclick = () => {
                currentPage--;
                // Re-renderiza a página chamando o router novamente para a mesma rota
                router.navigate('/livros'); 
            };
        }

        const btnNext = document.getElementById('btn-next-page');
        if(btnNext) {
            btnNext.onclick = () => {
                currentPage++;
                router.navigate('/livros');
            };
        }

        // 3. Favoritos
        document.querySelectorAll('.btn-toggle-fav').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                const id = btn.dataset.favId;
                let favorites = JSON.parse(localStorage.getItem('user_favorites')) || [];
                
                if(favorites.includes(id)) {
                    favorites = favorites.filter(fid => fid !== id);
                    window.Toast.show('Removido dos favoritos', 'success');
                } else {
                    favorites.push(id);
                    window.Toast.show('Adicionado aos favoritos!', 'success');
                }
                
                localStorage.setItem('user_favorites', JSON.stringify(favorites));
                // Recarrega visualmente
                router.navigate('/livros');
            };
        });
        
        window.scrollTo(0, 0);
    }
};