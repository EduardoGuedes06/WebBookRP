import { bookService } from '../services/BookService.js';

export const BookDetailsView = {
    render: async (id) => {
        // Se o ID não vier pelo parametro, tenta pegar da URL (fallback)
        if (!id) id = window.location.pathname.split('/')[2];
        
        const book = bookService.getById(id);

        if(!book) {
            window.history.pushState(null, null, '/livros'); 
            return ''; 
        }

        const favorites = JSON.parse(localStorage.getItem('user_favorites')) || [];
        const isFav = favorites.includes(book.id);
        const favIconClass = isFav ? "ph-fill ph-heart text-xl text-red-500" : "ph-fill ph-heart text-xl text-gray-300";
        const favText = isFav ? "Remover dos Favoritos" : "Adicionar aos Favoritos";

        // Lógica para gerar os botões de compra dinamicamente
        const renderBuyButton = (link, iconClass, colorClass, text) => {
            if (!link) return ''; // Se não tiver link, não retorna nada
            return `
                <a href="${link}" target="_blank" class="flex items-center justify-between px-6 py-4 bg-gray-900 text-white rounded-xl hover:bg-slate-800 transition shadow-lg group border border-gray-800">
                    <div class="flex items-center gap-4">
                        <i class="${iconClass} text-2xl ${colorClass}"></i>
                        <span class="font-bold text-sm uppercase tracking-wide">${text}</span>
                    </div>
                    <i class="ph-bold ph-arrow-up-right group-hover:translate-x-1 group-hover:-translate-y-1 transition text-gray-500"></i>
                </a>
            `;
        };

        return `
            <div class="animate-fade-in pt-10 pb-20">
                <a href="/livros" class="flex items-center gap-2 text-gray-500 hover:text-primary font-bold mb-8 transition inline-block">
                    <i class="ph-bold ph-arrow-left"></i> Voltar para Catálogo
                </a>
                
                <div class="bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden">
                    <div class="grid grid-cols-1 md:grid-cols-12 gap-0">
                        
                        <div class="md:col-span-5 bg-gray-100 p-10 flex items-center justify-center relative overflow-hidden group">
                            <div class="absolute inset-0 bg-primary/5 opacity-50"></div>
                            <div class="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                            
                            <img src="${book.cover}" class="rounded-lg shadow-2xl w-3/4 max-w-sm rotate-1 relative z-10 group-hover:rotate-0 group-hover:scale-105 transition duration-500 ease-out">
                            
                            ${book.isPromotion ? `
                            <div class="absolute top-5 right-5 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg transform rotate-3 animate-pulse z-20">
                                OFERTA ESPECIAL
                            </div>` : ''}
                        </div>
                        
                        <div class="md:col-span-7 p-10 md:p-14 flex flex-col justify-center">
                            <span class="text-accent font-bold tracking-widest text-xs uppercase mb-3 block">${book.genre}</span>
                            <h1 class="text-4xl md:text-5xl font-black text-primary mb-6 font-serif leading-tight">${book.title}</h1>
                            
                            <div class="flex items-center gap-6 mb-8 text-sm text-gray-500 border-b border-gray-100 pb-8">
                                <span class="flex items-center gap-1"><i class="ph-fill ph-star text-yellow-400 text-lg"></i> 4.9 (120 reviews)</span>
                                <span class="w-px h-4 bg-gray-300"></span>
                                <span>320 Páginas</span>
                            </div>

                            <p class="text-gray-600 text-lg leading-relaxed mb-8 font-light">
                                ${book.synopsis || 'Uma narrativa envolvente que desafia a percepção da realidade.'}
                            </p>

                            <div class="flex items-end gap-4 mb-8">
                                ${book.isPromotion && book.promoPrice ? `
                                    <div class="text-5xl font-black text-primary font-serif">R$ ${book.promoPrice.toFixed(2)}</div>
                                    <div class="flex flex-col pb-2">
                                        <span class="text-sm text-gray-400 line-through decoration-red-500 decoration-2">De R$ ${book.price.toFixed(2)}</span>
                                        <span class="text-green-600 text-xs font-bold uppercase tracking-wide">Economize 30%</span>
                                    </div>
                                ` : `
                                    <div class="text-5xl font-black text-primary font-serif">R$ ${book.price.toFixed(2)}</div>
                                `}
                            </div>

                            <div class="flex flex-col gap-3 max-w-md mb-8">
                                <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Disponível em:</h4>
                                
                                ${renderBuyButton(book.linkAmazon, 'ph-bold ph-amazon-logo', 'text-[#FF9900]', 'Comprar na Amazon')}
                                ${renderBuyButton(book.linkML, 'ph-bold ph-handbag', 'text-[#FFE600]', 'Mercado Livre')}
                                ${renderBuyButton(book.linkShopee, 'ph-bold ph-shopping-bag', 'text-[#EE4D2D]', 'Shopee')}
                                ${renderBuyButton(book.linkGeneric, 'ph-bold ph-link', 'text-blue-400', 'Outras Lojas / Site Próprio')}
                                
                                ${!book.linkAmazon && !book.linkML && !book.linkShopee && !book.linkGeneric ? 
                                    '<div class="p-4 bg-gray-50 rounded-lg text-gray-500 text-sm text-center">Nenhum link de venda disponível no momento.</div>' 
                                : ''}
                            </div>

                            <div class="flex items-center gap-2">
                                 <button id="detail-fav-btn" data-id="${book.id}" class="group flex items-center gap-2 text-gray-500 hover:text-red-500 transition font-bold text-sm px-4 py-2 rounded-lg hover:bg-red-50 border border-transparent hover:border-red-100">
                                    <i id="detail-fav-icon" class="${favIconClass} group-hover:scale-110 transition"></i> 
                                    <span id="fav-text">${favText}</span>
                                 </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in" style="animation-delay: 0.2s">
                    <div class="col-span-2">
                        <h3 class="text-2xl font-bold text-primary mb-6 font-serif flex items-center gap-2"><i class="ph-fill ph-book-open-text text-accent"></i> Detalhes da Obra</h3>
                        <div class="prose text-gray-600 leading-loose bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <p>${book.synopsis || 'Sem descrição detalhada.'}</p>
                        </div>
                    </div>
                    <div>
                        <h3 class="text-2xl font-bold text-primary mb-6 font-serif flex items-center gap-2"><i class="ph-fill ph-chat-centered-text text-accent"></i> O que dizem</h3>
                        <div class="space-y-4">
                            <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
                                <div class="flex text-yellow-400 text-xs mb-3"><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i></div>
                                <p class="text-sm text-gray-600 italic mb-3">"Uma leitura obrigatória. O universo criado é fascinante."</p>
                                <p class="text-xs font-bold text-gray-400">- Leitor Verificado</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    afterRender: async () => {
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