export const NotFoundView = {
    render: () => {
        return `
            <div class="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
                <div class="text-9xl font-black text-gray-200">404</div>
                <h2 class="text-3xl font-bold text-primary mb-4">Página não encontrada</h2>
                <a href="/" class="bg-primary text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:bg-accent transition">
                    Voltar para o Início
                </a>
            </div>
        `;
    }
};