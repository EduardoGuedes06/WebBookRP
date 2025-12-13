import { postService } from '../services/PostService.js';

const expandedComments = {};
let currentUser = JSON.parse(localStorage.getItem('user')) || null;

function getCommentTimeValue(c) {
    if (c.timestamp) return c.timestamp;
    if (c.date === "Agora mesmo") return Date.now();
    if (typeof c.date === 'string' && c.date.includes('/')) {
        const parts = c.date.split('/');
        return new Date(parts[2], parts[1]-1, parts[0]).getTime();
    }
    return 0;
}

function getCommentDisplayDate(c) {
    if (c.timestamp) {
        const diff = Date.now() - c.timestamp;
        if (diff < 7200000) return "Agora mesmo";
        const d = new Date(c.timestamp);
        return d.toLocaleDateString('pt-BR') + ' às ' + d.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
    }
    return c.date;
}

function renderFeed() {
    const posts = postService.getPublishedPosts();
    
    return posts.map(post => {
        const userLiked = currentUser && post.likedBy.includes(currentUser.name);
        const isTextBlack = post.coverTextColor === 'black';
        const titleColor = isTextBlack ? 'text-gray-900' : 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,1)]';
        const metaColor = isTextBlack ? 'text-gray-700' : 'text-white';
        const gradientClass = isTextBlack ? 'from-white via-white/50 to-transparent' : 'from-black via-black/50 to-transparent';
        const likeBtnBorder = isTextBlack ? 'border-gray-300 bg-white/50 hover:bg-white' : 'border-white/20 bg-white/10 hover:bg-white/20';

        const sortedComments = [...post.comments].sort((a, b) => getCommentTimeValue(b) - getCommentTimeValue(a));
        const limit = expandedComments[post.id] || 3;
        const visibleComments = sortedComments.slice(0, limit);
        const hasMore = sortedComments.length > limit;

        return `
        <div class="group bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 relative mb-10">
            <div class="relative h-[350px] overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-t ${gradientClass} z-10 opacity-90"></div>
                <img src="${post.image}" class="w-full h-full object-cover group-hover:scale-105 transition duration-700">
                <div class="absolute bottom-0 left-0 w-full p-8 z-20">
                    <div class="flex justify-between items-end">
                        <div>
                            <span class="bg-accent text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 inline-block shadow-lg shadow-black/20">${post.category}</span>
                            <h3 class="text-3xl font-serif font-bold ${titleColor} mb-2 leading-tight">${post.title}</h3>
                            <div class="flex items-center gap-4 ${metaColor} text-sm font-medium drop-shadow-md">
                                <span><i class="ph-fill ph-calendar"></i> ${post.date}</span>
                            </div>
                        </div>
                        ${post.allowLikes ? `
                        <button data-action="like-post" data-id="${post.id}" class="w-12 h-12 rounded-full flex items-center justify-center border ${likeBtnBorder} backdrop-blur-md transition transform hover:scale-110 shadow-lg">
                            <i class="ph-fill ph-heart text-2xl ${userLiked ? 'text-red-500' : (isTextBlack ? 'text-gray-900' : 'text-white')} drop-shadow-md"></i>
                        </button>` : ''}
                    </div>
                </div>
            </div>

            <div class="p-8 pt-6">
                <p class="text-gray-600 leading-relaxed text-lg mb-4">${post.content}</p>
                ${post.link ? `<a href="${post.link}" target="_blank" class="text-xs font-bold text-accent hover:underline mt-2 inline-flex items-center gap-1"><i class="ph-bold ph-link"></i> Acessar Link</a>` : ''}
                <div class="border-t border-gray-100 mt-6 pt-6">
                    <div class="flex items-center gap-6 text-sm text-gray-400 mb-6">
                        <span class="flex items-center gap-2 ${userLiked ? 'text-red-500 font-bold' : ''}"><i class="ph-fill ph-heart"></i> ${post.likes} curtidas</span>
                        <span class="flex items-center gap-2"><i class="ph-fill ph-chat-circle"></i> ${post.comments.length} comentários</span>
                    </div>
                    
                    <div class="space-y-4 mb-4">
                        ${visibleComments.map(c => `
                            <div class="flex gap-3 animate-fade-in">
                                <img src="${c.avatar}" class="w-8 h-8 rounded-full">
                                <div class="flex-1">
                                    <div class="bg-gray-50 p-3 rounded-2xl rounded-tl-none relative">
                                        ${c.authorLike ? '<i class="ph-fill ph-star absolute -top-1 -right-1 text-accent bg-white rounded-full p-1 shadow-sm text-xs"></i>' : ''}
                                        <div class="flex justify-between items-baseline">
                                            <span class="font-bold text-xs text-gray-900">${c.user}</span>
                                            <span class="text-[10px] ${getCommentDisplayDate(c) === 'Agora mesmo' ? 'text-green-600 font-bold' : 'text-gray-400'}">${getCommentDisplayDate(c)}</span>
                                        </div>
                                        <p class="text-sm text-gray-600">${c.text}</p>
                                    </div>
                                </div>
                            </div>`).join('')}
                    </div>
                    
                    ${hasMore ? `
                        <div class="text-center mb-6">
                            <button data-action="load-more" data-id="${post.id}" class="text-xs font-bold text-accent hover:underline py-2">
                                Ver mais comentários...
                            </button>
                        </div>
                    ` : ''}

                    ${post.allowComments ? (currentUser ? `
                        <div class="flex gap-3 items-start">
                            <img src="${currentUser.avatar}" class="w-8 h-8 rounded-full">
                            <div class="flex-1 relative">
                                <textarea id="comment-input-${post.id}" rows="1" placeholder="Comente..." class="w-full bg-gray-50 border-0 rounded-xl p-3 pr-12 text-sm focus:ring-2 focus:ring-accent resize-none"></textarea>
                                <button data-action="submit-comment" data-id="${post.id}" class="absolute right-2 top-2 text-primary hover:text-accent p-1"><i class="ph-bold ph-paper-plane-right text-xl"></i></button>
                            </div>
                        </div>` 
                        : `<button data-action="login-mock" class="w-full py-3 border border-gray-200 border-dashed rounded-xl text-xs font-bold text-gray-400 hover:bg-gray-50 flex items-center justify-center gap-2"><i class="ph-bold ph-sign-in"></i> Faça login (Simulação)</button>`) 
                        : '<p class="text-center text-xs text-gray-400 italic">Comentários desativados.</p>'}
                </div>
            </div>
        </div>
    `;
    }).join('');
}

function renderSidebar() {
    const posts = postService.getPublishedPosts();
    const allComments = [];
    posts.forEach(p => p.comments.forEach(c => allComments.push({...c, postTitle: p.title})));
    allComments.sort((a,b) => getCommentTimeValue(b) - getCommentTimeValue(a));

    return allComments.slice(0, 5).map(c => `
        <div class="flex gap-3 pb-4 border-b border-gray-50 last:border-0">
            <img src="${c.avatar}" class="w-8 h-8 rounded-full">
            <div>
                <p class="text-xs text-gray-600"><span class="font-bold text-primary">${c.user}</span> comentou:</p>
                <p class="text-xs italic text-gray-500 my-1 line-clamp-2">"${c.text}"</p>
                <p class="text-[10px] text-accent font-bold truncate max-w-[200px]">${c.postTitle}</p>
            </div>
        </div>`).join('');
}

export const CommunityView = {
    render: () => {
        currentUser = JSON.parse(localStorage.getItem('user'));
        
        return `
            <div class="animate-fade-in pb-20">
                <div class="relative bg-primary rounded-[3rem] p-10 md:p-24 text-center text-white mb-20 overflow-hidden shadow-2xl">
                    <div class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                    <div class="absolute -top-24 -right-24 w-64 h-64 bg-accent/20 rounded-full blur-3xl"></div>
                    <div class="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
                    
                    <div class="relative z-10 max-w-3xl mx-auto">
                        <span class="inline-block py-1 px-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-widest mb-6 text-accent">Hub de Conteúdo</span>
                        <h2 class="text-5xl md:text-7xl font-serif font-bold mb-8 leading-tight">Bastidores & <br> <span class="italic text-transparent bg-clip-text bg-gradient-to-r from-accent to-orange-400">Café Quente.</span></h2>
                        <p class="text-slate-300 text-lg md:text-xl leading-relaxed">
                            Mergulhe no processo criativo, debata teorias e acesse conteúdos exclusivos.
                        </p>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl mx-auto">
                    <div class="lg:col-span-8 space-y-12" id="feed-container">
                        ${renderFeed()}
                    </div>

                    <div class="lg:col-span-4 space-y-10">
                        <div class="bg-white border border-gray-100 rounded-3xl p-8 shadow-xl relative overflow-hidden">
                            <div class="absolute top-0 right-0 w-20 h-20 bg-accent/10 rounded-bl-full"></div>
                            <h3 class="text-xl font-bold text-primary font-serif mb-2 flex items-center gap-2"><i class="ph-fill ph-fire text-accent"></i> Em Alta</h3>
                            <div class="bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-6 mt-6">
                                <h4 class="font-bold text-gray-800 text-sm mb-2">"O final de 'Código da Eternidade' foi real?"</h4>
                                <div class="flex items-center gap-2 text-xs text-gray-400">
                                    <span><i class="ph-fill ph-chat-circle"></i> 45 coments</span>
                                </div>
                            </div>
                        </div>

                        <div class="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                            <h4 class="font-bold text-gray-800 mb-6 flex items-center gap-2 text-sm uppercase tracking-wide"><i class="ph-bold ph-chats text-blue-500"></i> Últimas Interações</h4>
                            <div id="sidebar-container" class="space-y-6">
                                ${renderSidebar()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    afterRender: () => {
        const feed = document.getElementById('feed-container');
        const sidebar = document.getElementById('sidebar-container');

        const refreshUI = () => {
            feed.innerHTML = renderFeed();
            sidebar.innerHTML = renderSidebar();
        };

        feed.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;

            const action = btn.dataset.action;
            const id = parseInt(btn.dataset.id);

            if (action === 'like-post') {
                if(currentUser) {
                    postService.toggleLike(id, currentUser.name);
                    refreshUI();
                } else {
                    alert("Faça login simulado primeiro!");
                }
            }

            if (action === 'load-more') {
                const current = expandedComments[id] || 3;
                expandedComments[id] = current + 5;
                refreshUI();
            }

            if (action === 'submit-comment') {
                const input = document.getElementById(`comment-input-${id}`);
                const text = input.value;
                if(text.trim()) {
                    postService.addComment(id, currentUser, text);
                    refreshUI();
                }
            }

            if (action === 'login-mock') {
                currentUser = { name: "Visitante", avatar: "https://placehold.co/40x40/d97706/FFF?text=Eu" };
                localStorage.setItem('user', JSON.stringify(currentUser));
                refreshUI();
            }
        });
    }
};