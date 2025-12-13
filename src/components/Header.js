export const Header = {
    render: () => {
        return `
            <header class="w-full py-4 transition-all duration-300">
                <div class="container mx-auto px-4 flex justify-between items-center">
                    <a href="#/" class="text-2xl font-bold text-primary tracking-tighter font-serif group flex items-center gap-2">
                        <span class="w-8 h-8 bg-primary text-white flex items-center justify-center rounded-lg font-serif italic text-xl group-hover:bg-accent transition shadow-lg">R</span>
                        <span>RONALDO <span class="text-accent">PEREIRA</span>.</span>
                    </a>

                    <nav class="hidden md:flex gap-6 items-center font-medium text-sm tracking-wide text-gray-600">
                        <a href="#/" class="hover:text-accent transition py-2 font-bold uppercase text-xs">Início</a>
                        <a href="#/livros" class="hover:text-accent transition py-2 font-bold uppercase text-xs">Livros</a>
                        <a href="#/servicos" class="hover:text-accent transition py-2 font-bold uppercase text-xs">Serviços</a>
                        <a href="#/comunidade" class="hover:text-accent transition py-2 font-bold uppercase text-xs text-accent">Comunidade</a>
                        <a href="#/autor" class="hover:text-accent transition py-2 font-bold uppercase text-xs">Sobre</a>
                        
                        <div class="h-6 w-px bg-gray-300 mx-2"></div>

                        <a href="#/painel" class="hover:text-primary transition py-2 font-bold uppercase text-xs flex items-center gap-1 text-gray-400 hover:text-gray-900" title="Acesso Restrito">
                            <i class="ph-fill ph-lock-key text-lg"></i> Painel
                        </a>
                    </nav>

                    <button id="menu-button" class="md:hidden text-2xl text-primary p-2">
                        <i class="ph ph-list"></i>
                    </button>
                </div>

                <div id="mobile-menu" class="hidden md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 flex flex-col p-4 z-50 animate-fade-in">
                    <a href="#/" class="py-3 px-4 hover:bg-gray-50 rounded font-medium">Início</a>
                    <a href="#/livros" class="py-3 px-4 hover:bg-gray-50 rounded font-medium">Livros</a>
                    <a href="#/servicos" class="py-3 px-4 hover:bg-gray-50 rounded font-medium">Serviços</a>
                    <a href="#/comunidade" class="py-3 px-4 hover:bg-gray-50 rounded font-medium text-accent">Comunidade</a>
                    <a href="#/autor" class="py-3 px-4 hover:bg-gray-50 rounded font-medium">Sobre</a>
                    <a href="#/painel" class="py-3 px-4 hover:bg-gray-50 rounded font-medium">Painel Admin</a>
                </div>
            </header>
        `;
    },

    afterRender: () => {
        const btn = document.getElementById('menu-button');
        const menu = document.getElementById('mobile-menu');
        const header = document.getElementById('header-container');

        if(btn && menu) {
            btn.onclick = (e) => {
                e.stopPropagation();
                menu.classList.toggle('hidden');
            };
            document.addEventListener('click', (e) => {
                if (!menu.contains(e.target) && !btn.contains(e.target)) {
                    menu.classList.add('hidden');
                }
            });
            
            menu.querySelectorAll('a').forEach(link => {
                link.onclick = () => menu.classList.add('hidden');
            });
        }

        window.addEventListener('scroll', () => {
            if(window.scrollY > 10) {
                header.classList.add('glass-header');
                header.classList.remove('py-4');
                header.classList.add('py-2');
            } else {
                header.classList.remove('glass-header');
                header.classList.remove('py-2');
                header.classList.add('py-4');
            }
        });
    }
};