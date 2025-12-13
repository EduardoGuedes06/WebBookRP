import { bookService } from '../services/BookService.js';

export const BookDetailsView = {
    render: (id) => {
        const book = bookService.getBookById(id);

        if (!book) return `<div class="p-10 text-center">Livro não encontrado</div>`;

        const priceHtml = book.isPromotion 
            ? `
                <div class="text-4xl font-black text-primary">R$ ${book.promoPrice.toFixed(2)}</div>
                <p class="text-sm text-gray-400 pb-2 decoration-slice line-through decoration-red-500 decoration-2">De R$ ${book.price.toFixed(2)}</p>
                <span class="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded mb-2">OFERTA</span>
              `
            : `<div class="text-4xl font-black text-primary">R$ ${book.price.toFixed(2)}</div>`;

        return `
        <div class="animate-fade-in pt-10 pb-20 max-w-7xl mx-auto px-4">
            
            <button onclick="window.location.hash = '/'" class="flex items-center gap-2 text-gray-500 hover:text-primary font-bold mb-8 transition group">
                <i class="ph-bold ph-arrow-left group-hover:-translate-x-1 transition"></i> Voltar para Catálogo
            </button>
            
            <div class="bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden">
                <div class="grid grid-cols-1 md:grid-cols-12 gap-0">
                    
                    <div class="md:col-span-5 bg-gray-100 p-10 flex items-center justify-center relative overflow-hidden group">
                        <div class="absolute inset-0 bg-primary/5 opacity-50"></div>
                        <div class="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                        
                        <img src="${book.cover}" class="rounded-lg shadow-2xl w-3/4 max-w-sm rotate-1 relative z-10 group-hover:rotate-0 transition duration-500 transform group-hover:scale-105">
                        
                        ${book.isPromotion ? `
                        <div class="absolute top-5 right-5 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg transform rotate-3 animate-pulse">
                            OFERTA ESPECIAL
                        </div>` : ''}
                    </div>
                    
                    <div class="md:col-span-7 p-10 md:p-14 flex flex-col justify-center">
                        <span class="text-accent font-bold tracking-widest text-xs uppercase mb-3 block">${book.genre}</span>
                        <h1 class="text-4xl md:text-5xl font-black text-primary mb-6 font-serif leading-tight">${book.title}</h1>
                        
                        <div class="flex items-center gap-6 mb-8 text-sm text-gray-500 border-b border-gray-100 pb-6 w-full">
                            <span class="flex items-center gap-1">
                                <i class="ph-fill ph-star text-yellow-400 text-lg"></i> 
                                <span class="font-bold text-gray-700">${book.rating}</span> 
                                (${book.reviews} avaliações)
                            </span>
                            <span class="w-px h-4 bg-gray-300"></span>
                            <span class="flex items-center gap-1">
                                <i class="ph ph-book-open text-lg"></i>
                                ${book.pages} Páginas
                            </span>
                        </div>

                        <p class="text-gray-600 text-lg leading-relaxed mb-8 font-light italic border-l-4 border-accent pl-4">
                            "${book.synopsis}"
                        </p>

                        <div class="flex items-end gap-6 mb-8">
                            ${priceHtml}
                        </div>

                        <div class="bg-gradient-to-r from-orange-100 to-amber-50 border-l-4 border-accent p-4 mb-8 rounded-r-lg shadow-sm">
                            <div class="flex items-start gap-3">
                                <i class="ph-fill ph-tag text-accent text-2xl mt-1"></i>
                                <div>
                                    <h4 class="font-bold text-gray-800">Disponível em Estoque!</h4>
                                    <p class="text-sm text-gray-600">Envio imediato após a confirmação.</p>
                                </div>
                            </div>
                        </div>

                        <div class="flex flex-col gap-3 max-w-md w-full">
                            
                            <a href="${book.buyLinks.amazon}" target="_blank" class="flex items-center justify-between px-6 py-4 bg-gray-900 text-white rounded-xl hover:bg-slate-800 transition shadow-lg group hover:-translate-y-1">
                                <div class="flex items-center gap-3">
                                    <i class="ph-bold ph-amazon-logo text-2xl text-[#FF9900]"></i>
                                    <span class="font-bold">Comprar na Amazon</span>
                                </div>
                                <i class="ph-bold ph-arrow-right group-hover:translate-x-1 transition"></i>
                            </a>

                            <a href="${book.buyLinks.ml}" target="_blank" class="flex items-center justify-between px-6 py-4 bg-[#FFE600] text-blue-900 rounded-xl hover:bg-yellow-400 transition shadow-md group border border-yellow-400 hover:-translate-y-1">
                                <div class="flex items-center gap-3">
                                    <i class="ph-bold ph-shopping-bag-open text-2xl"></i>
                                    <span class="font-bold">Mercado Livre</span>
                                </div>
                                <i class="ph-bold ph-arrow-right group-hover:translate-x-1 transition"></i>
                            </a>

                            <a href="${book.buyLinks.shopee}" target="_blank" class="flex items-center justify-between px-6 py-4 bg-[#EE4D2D] text-white rounded-xl hover:bg-orange-600 transition shadow-md group hover:-translate-y-1">
                                <div class="flex items-center gap-3">
                                    <i class="ph-bold ph-shopping-bag text-2xl"></i>
                                    <span class="font-bold">Shopee</span>
                                </div>
                                <i class="ph-bold ph-arrow-right group-hover:translate-x-1 transition"></i>
                            </a>
                        </div>

                        <div class="mt-6 flex items-center gap-2">
                             <button class="flex items-center gap-2 text-gray-500 hover:text-red-500 transition font-bold text-sm px-4 py-2 rounded-lg hover:bg-red-50">
                                <i class="ph-fill ph-heart text-xl text-gray-300 hover:text-red-500 transition"></i> Adicionar aos Favoritos
                             </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto px-4">
            
            <div class="col-span-2">
                <h3 class="text-2xl font-bold text-primary mb-6 font-serif border-b pb-4">Sinopse Completa</h3>
                <div class="prose text-gray-600 leading-loose text-justify text-lg">
                    ${book.fullSynopsis} 
                </div>
            </div>

            <div>
                <h3 class="text-2xl font-bold text-primary mb-6 font-serif border-b pb-4">O que dizem os leitores</h3>
                <div class="space-y-4">
                    <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
                        <div class="flex text-yellow-400 text-xs mb-3"><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i></div>
                        <p class="text-sm text-gray-600 italic mb-3">"A ambientação desse livro é perfeita. Me senti dentro da história."</p>
                        <p class="text-xs font-bold text-gray-400">- Maria S.</p>
                    </div>

                    <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
                        <div class="flex text-yellow-400 text-xs mb-3"><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i></div>
                        <p class="text-sm text-gray-600 italic mb-3">"Recomendo a todos que gostam do gênero."</p>
                        <p class="text-xs font-bold text-gray-400">- João P.</p>
                    </div>
                </div>
            </div>
        </div>
        `;
    },

    afterRender: () => {

    }
};