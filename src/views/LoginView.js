export const LoginView = {
    render: () => {
        return `
            <div class="flex items-center justify-center min-h-[60vh] animate-fade-in">
                <div class="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 relative overflow-hidden">
                    <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-accent"></div>
                    <div class="text-center mb-8">
                        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-primary text-3xl"><i class="ph-fill ph-lock-key"></i></div>
                        <h2 class="text-2xl font-bold text-primary font-serif">Acesso Restrito</h2>
                    </div>
                    <form id="login-form">
                        <div class="space-y-4">
                            <input type="email" id="email" placeholder="E-mail" class="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 form-input" value="admin@ronaldo.com">
                            <input type="password" id="password" placeholder="Senha" class="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 form-input" value="admin">
                            <button type="submit" class="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-accent transition shadow-lg">Entrar no Painel</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    },

    afterRender: () => {
        const form = document.getElementById('login-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const pass = document.getElementById('password').value;

            if(email === 'admin@ronaldo.com' && pass === 'admin') {
                localStorage.setItem('isAdmin', 'true');
                window.location.hash = '#/painel';
            } else {
                alert('Credenciais inválidas!');
            }
        });
    }
};