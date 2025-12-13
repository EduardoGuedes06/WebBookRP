export const Footer = {
    render: () => {
        return `
            <footer class="bg-primary text-white py-16 border-t-4 border-accent text-center">
                <h4 class="font-serif text-3xl font-bold mb-6">RONALDO <span class="text-accent">PEREIRA</span>.</h4>
                <div class="flex justify-center gap-6 mb-8 text-2xl text-slate-400">
                    <i class="ph-fill ph-instagram hover:text-white cursor-pointer transition"></i>
                    <i class="ph-fill ph-twitter-logo hover:text-white cursor-pointer transition"></i>
                    <i class="ph-fill ph-envelope-simple hover:text-white cursor-pointer transition"></i>
                </div>
                <p class="text-slate-500 text-sm">&copy; 2025 Todos os direitos reservados.</p>
            </footer>
        `;
    }
};