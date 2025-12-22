import { bookService } from '../services/BookService.js';

export const BookDetailsView = {
    // Agora o ID vem direto do Router (param), não precisa dar split na URL
    render: async (id) => {
        // Se o ID não vier pelo parametro, tenta pegar da URL (fallback)
        if (!id) id = window.location.pathname.split('/')[2];
        
        const book = bookService.getById(id);

        if(!book) {
            // Usa window.history para voltar sem #
            window.history.pushState(null, null, '/livros'); 
            return ''; 
        }

        const favorites = JSON.parse(localStorage.getItem('user_favorites')) || [];
        const isFav = favorites.includes(book.id);
        const favIconClass = isFav ? "ph-fill ph-heart text-xl text-red-500" : "ph-fill ph-heart text-xl text-gray-300";
        const favText = isFav ? "Remover dos Favoritos" : "Adicionar aos Favoritos";

        return `
            <div class="animate-fade-in pt-10 pb-20">
                <a href="/livros" class="flex items-center gap-2 text-gray-500 hover:text-primary font-bold mb-8 transition inline-block">
                    <i class="ph-bold ph-arrow-left"></i> Voltar para Catálogo
                </a>
                
                <div class="bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden">
                    <div class="grid grid-cols-1 md:grid-cols-12 gap-0">
                        
                        <div class="md:col-span-5 bg-gray-100 p-10 flex items-center justify-center relative overflow-hidden">
                            <div class="absolute inset-0 bg-primary/5 opacity-50"></div>
                            <div class="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                            <img src="${book.cover}" class="rounded-lg shadow-2xl w-3/4 max-w-sm rotate-1 relative z-10 hover:rotate-0 transition duration-500">
                            
                            ${book.isPromotion ? `
                            <div class="absolute top-5 right-5 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg transform rotate-3 animate-pulse">
                                OFERTA ESPECIAL
                            </div>` : ''}
                        </div>
                        
                        <div class="md:col-span-7 p-10 md:p-14 flex flex-col justify-center">
                            <span class="text-accent font-bold tracking-widest text-xs uppercase mb-3 block">${book.genre}</span>
                            <h1 class="text-4xl md:text-5xl font-black text-primary mb-6 font-serif leading-tight">${book.title}</h1>
                            
                            <div class="flex items-center gap-6 mb-8 text-sm text-gray-500">
                                <span class="flex items-center gap-1"><i class="ph-fill ph-star text-yellow-400 text-lg"></i> 4.9 (120 reviews)</span>
                                <span class="w-px h-4 bg-gray-300"></span>
                                <span>320 Páginas</span>
                            </div>

                            <p class="text-gray-600 text-lg leading-relaxed mb-8 font-light">
                                ${book.synopsis || 'Uma narrativa envolvente que desafia a percepção da realidade.'}
                            </p>

                            <div class="flex items-end gap-6 mb-6">
                                ${book.isPromotion && book.promoPrice ? `
                                    <div class="text-4xl font-black text-primary">R$ ${book.promoPrice.toFixed(2)}</div>
                                    <p class="text-sm text-gray-400 pb-2 decoration-slice line-through decoration-red-500 decoration-2">De R$ ${book.price.toFixed(2)}</p>
                                    <span class="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded mb-2">30% OFF</span>
                                ` : `
                                    <div class="text-4xl font-black text-primary">R$ ${book.price.toFixed(2)}</div>
                                `}
                            </div>

                            ${book.isPromotion ? `
                            <div class="bg-gradient-to-r from-orange-100 to-amber-50 border-l-4 border-accent p-4 mb-8 rounded-r-lg shadow-sm">
                                <div class="flex items-start gap-3">
                                    <i class="ph-fill ph-tag text-accent text-2xl mt-1"></i>
                                    <div>
                                        <h4 class="font-bold text-gray-800">Promoção de Lançamento!</h4>
                                        <p class="text-sm text-gray-600">Compre agora e ganhe um marcador exclusivo.</p>
                                    </div>
                                </div>
                            </div>` : ''}

                            <div class="flex flex-col gap-3 max-w-md">
                                <a href="${book.linkAmazon || '#'}" target="_blank" class="flex items-center justify-between px-6 py-4 bg-gray-900 text-white rounded-xl hover:bg-slate-800 transition shadow-lg group">
                                    <div class="flex items-center gap-3">
                                        <i class="ph-bold ph-amazon-logo text-2xl text-[#FF9900]"></i>
                                        <span class="font-bold">Comprar na Amazon</span>
                                    </div>
                                    <i class="ph-bold ph-arrow-right group-hover:translate-x-1 transition"></i>
                                </a>
                                </div>

                            <div class="mt-6 flex items-center gap-2">
                                 <button id="detail-fav-btn" data-id="${book.id}" class="flex items-center gap-2 text-gray-500 hover:text-red-500 transition font-bold text-sm px-4 py-2 rounded-lg hover:bg-red-50">
                                    <i id="detail-fav-icon" class="${favIconClass}"></i> <span id="fav-text">${favText}</span>
                                 </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div class="col-span-2">
                        <h3 class="text-2xl font-bold text-primary mb-6 font-serif">Sinopse Completa</h3>
                        <div class="prose text-gray-600 leading-loose">
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                            <p class="mt-4">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. A história mergulha profundamente na psique dos personagens, revelando segredos que estavam enterrados há décadas.</p>
                            <p class="mt-4">Prepare-se para uma jornada onde nada é o que parece e cada capítulo traz uma nova revelação surpreendente.</p>
                        </div>
                    </div>
                    <div>
                        <h3 class="text-2xl font-bold text-primary mb-6 font-serif">Outros Leitores</h3>
                        <div class="space-y-4">
                            <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                <div class="flex text-yellow-400 text-xs mb-2"><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i></div>
                                <p class="text-sm text-gray-600 italic">"Simplesmente fantástico. O final me pegou de surpresa!"</p>
                                <p class="text-xs font-bold text-gray-400 mt-2">- @leitora_voraz</p>
                            </div>
                            <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                <div class="flex text-yellow-400 text-xs mb-2"><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i></div>
                                <p class="text-sm text-gray-600 italic">"A construção de mundo é impecável."</p>
                                <p class="text-xs font-bold text-gray-400 mt-2">- Marcos D.</p>
                            </div>
                             <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                <div class="flex text-yellow-400 text-xs mb-2"><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-bold ph-star"></i></div>
                                <p class="text-sm text-gray-600 italic">"Não consegui parar de ler."</p>
                                <p class="text-xs font-bold text-gray-400 mt-2">- Julia S.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    afterRender: async () => {
        // Lógica de Favoritos
        const btnFav = document.getElementById('detail-fav-btn');
        if(btnFav) {
            btnFav.onclick = () => {
                const id = btnFav.dataset.id;
                let favorites = JSON.parse(localStorage.getItem('user_favorites')) || [];
                
                if(favorites.includes(id)) {
                    favorites = favorites.filter(fid => fid !== id);
                    window.Toast.show('Removido dos favoritos', 'success');
                } else {
                    favorites.push(id);
                    window.Toast.show('Adicionado aos favoritos!', 'success');
                }
                localStorage.setItem('user_favorites', JSON.stringify(favorites));
                
                // Atualiza visualmente
                const isFav = favorites.includes(id);
                const icon = document.getElementById('detail-fav-icon');
                const text = document.getElementById('fav-text');
                
                if(isFav) {
                    icon.className = "ph-fill ph-heart text-xl text-red-500";
                    text.innerText = "Remover dos Favoritos";
                } else {
                    icon.className = "ph-fill ph-heart text-xl text-gray-300";
                    text.innerText = "Adicionar aos Favoritos";
                }
            };
        }
        window.scrollTo(0,0);
    }
};