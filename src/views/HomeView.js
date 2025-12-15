export const HomeView = {
    render: async () => {
        return `
        <section class="flex flex-col-reverse md:flex-row items-center gap-16 py-12 md:py-24 mb-20 animate-fade-in">
            <div class="flex-1 space-y-8 text-center md:text-left z-10">
                <div class="inline-flex items-center gap-2 bg-white border border-gray-200 px-4 py-1.5 rounded-full shadow-sm mb-2">
                    <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span class="text-xs font-bold uppercase tracking-widest text-gray-600">Último Lançamento</span>
                </div>
                <h1 class="text-5xl md:text-7xl font-black text-primary leading-[1] tracking-tight">
                    Mundos que <br><span class="text-transparent bg-clip-text bg-gradient-to-r from-accent to-orange-400 font-serif italic pr-2">colidem.</span>
                </h1>
                <p class="text-lg md:text-xl text-gray-600 max-w-lg mx-auto md:mx-0 leading-relaxed font-medium">
                    Ficção especulativa de alto nível. Junte-se a milhares de leitores e explore o impossível.
                </p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-6">
                    <a href="/livros" class="bg-primary text-white px-10 py-4 rounded-full font-bold shadow-xl hover:bg-slate-800 hover:shadow-2xl hover:scale-105 transition transform text-sm uppercase tracking-wide">
                        Ler Agora
                    </a>
                </div>
            </div>
            
            <div class="flex-1 flex justify-center relative w-full">
                <div class="absolute inset-0 bg-gradient-to-tr from-accent/20 to-transparent blur-[100px] rounded-full"></div>
                <img src="https://placehold.co/400x550/1e293b/FFF?text=Capa+Nova" class="rounded shadow-2xl rotate-3 hover:rotate-0 transition duration-700 w-full max-w-sm border-8 border-white relative z-10 animate-float" alt="Autor">
            </div>
        </section>

        <section class="py-20">
            <div class="flex items-end justify-between mb-12">
                <div>
                        <h2 class="text-4xl font-bold text-primary font-serif mb-2">Em Destaque</h2>
                        <p class="text-gray-500">O que os leitores estão devorando agora.</p>
                </div>
                <a href="/livros" class="text-sm font-bold text-accent hover:underline uppercase tracking-widest mb-2">Ver Catálogo -></a>
            </div>
            
            <div id="home-highlights" class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="p-8 bg-gray-50 rounded-2xl border border-gray-200 text-center text-gray-400 italic">
                    Carregando destaques... (Próxima etapa)
                </div>
            </div>
        </section>

        <section class="my-20 bg-primary rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden text-white shadow-2xl">
            <div class="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
            <div class="relative z-10 max-w-4xl mx-auto">
                <i class="ph-fill ph-quotes text-6xl text-accent mb-6 opacity-50 block mx-auto"></i>
                <h3 class="text-3xl md:text-5xl font-serif font-bold leading-tight mb-8">"Escrever é a única forma que encontrei de viver mil vidas em uma só. E convido você a viver elas comigo."</h3>
                <p class="text-slate-400 font-medium tracking-widest uppercase text-sm">— Ronaldo Pereira</p>
            </div>
        </section>
        `;
    },
    afterRender: async () => {

    }
};