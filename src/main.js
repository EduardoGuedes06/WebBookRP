function initApp() {
    const app = document.getElementById('app');
    
    if (!app) {
        console.error("Elemento #app não encontrado!");
        return;
    }

    app.innerHTML = `
        <div class="min-h-screen flex flex-col items-center justify-center animate-fade-in">
            
            <div class="w-24 h-24 bg-primary rounded-full flex items-center justify-center mb-6 shadow-2xl relative">
                <div class="absolute inset-0 border-4 border-white/20 rounded-full animate-ping"></div>
                <i class="ph-fill ph-gear text-4xl text-white animate-spin-slow"></i>
            </div>

            <h1 class="text-5xl md:text-6xl font-black text-primary font-serif mb-4 text-center">
                Motor Ligado.
            </h1>
            
            <p class="text-xl text-gray-500 max-w-lg text-center leading-relaxed">
                A infraestrutura do projeto Node.js com ES Modules está pronta para receber a lógica.
            </p>

            <div class="mt-10 flex gap-4">
                <div class="px-6 py-3 bg-white border border-gray-200 rounded-xl shadow-sm flex items-center gap-3">
                    <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span class="font-bold text-gray-700 text-sm">Tailwind Ativo</span>
                </div>
                <div class="px-6 py-3 bg-white border border-gray-200 rounded-xl shadow-sm flex items-center gap-3">
                    <div class="w-3 h-3 bg-accent rounded-full"></div>
                    <span class="font-bold text-gray-700 text-sm">Modules Ativo</span>
                </div>
            </div>
        </div>
    `;
}

initApp();