import { authService } from '../services/AuthService.js';
// Não precisa importar o Toast aqui se ele já está no window.Toast na main.js
// Mas se preferir garantir: import { Toast } from '../components/assets/js/Toast.js';

export const LoginView = {
    render: () => {
        return `
            <style>
                /* Apenas a animação de erro no input continua útil */
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
                .shake-anim { animation: shake 0.4s ease-in-out; border-color: #ef4444 !important; }
            </style>

            <div class="flex items-center justify-center min-h-[60vh] animate-fade-in">
                <div class="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 relative overflow-hidden">
                    <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-accent"></div>
                    
                    <div class="text-center mb-8">
                        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-primary text-3xl"><i class="ph-fill ph-lock-key"></i></div>
                        <h2 class="text-2xl font-bold text-primary font-serif">Acesso Restrito</h2>
                        <p class="text-gray-400 text-sm mt-2">Área administrativa do autor</p>
                    </div>

                    <form id="login-form">
                        <div class="space-y-4">
                            <div>
                                <input type="email" id="email" placeholder="E-mail" class="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 form-input outline-none focus:border-primary transition" value="admin@ronaldo.com">
                            </div>
                            <div>
                                <input type="password" id="password" placeholder="Senha" class="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 form-input outline-none focus:border-primary transition">
                            </div>
                            
                            <button type="submit" id="btn-login" class="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-accent transition shadow-lg flex justify-center items-center gap-2">
                                Entrar no Painel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    },

    afterRender: () => {
        const form = document.getElementById('login-form');
        const emailInput = document.getElementById('email');
        const passInput = document.getElementById('password');
        const btn = document.getElementById('btn-login');

        if(form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const originalBtnText = btn.innerHTML;
                btn.disabled = true;
                btn.innerHTML = `<i class="ph-bold ph-spinner animate-spin text-xl"></i> Verificando...`;
                
                passInput.classList.remove('shake-anim');
                emailInput.classList.remove('shake-anim');

                try {
                    console.log("Tentando logar...");
                    const result = await authService.login(emailInput.value, passInput.value);
                    
                    if (result.success) {
                        // USANDO O TOAST GLOBAL GENÉRICO
                        window.Toast.show('Login realizado com sucesso!', 'success');
                        
                        setTimeout(() => {
                            window.location.hash = '/painel'; 
                        }, 1000);
                    } else {
                        passInput.value = '';
                        passInput.focus();
                        passInput.classList.add('shake-anim');
                        emailInput.classList.add('shake-anim');
                        
                        // USANDO O TOAST GLOBAL GENÉRICO COM ERRO
                        window.Toast.show(result.error, 'error');
                    }
                } catch (error) {
                    console.error("Erro no login:", error);
                    window.Toast.show("Erro interno no servidor", 'error');
                } finally {
                    if(btn) {
                        btn.disabled = false;
                        btn.innerHTML = originalBtnText;
                    }
                }
            });
        }
    }
};