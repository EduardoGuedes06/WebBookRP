import { db } from '../infra/MockDatabase.js';

class AuthService {
    constructor() {
        this.LOCKOUT_TIMES = {
            4: 60 * 1000,        // 4ª tentativa: 1 min
            5: 5 * 60 * 1000,    // 5ª tentativa: 5 min
            6: 10 * 60 * 1000,   // 6ª tentativa: 10 min
            7: 30 * 60 * 1000,   // 7ª tentativa: 30 min
            8: 24 * 60 * 60 * 1000 // 8ª tentativa: 24 horas
        };
        this.SESSION_DURATION = 4 * 60 * 60 * 1000; // 4 Horas
    }

    async login(email, password) {
        const status = this._checkLockout();
        if (status.locked) return { success: false, error: status.message };

        // 1. Obtém IP Real e Info do Browser
        const clientInfo = await this._getClientInfo();
        
        // 2. Verifica Credenciais
        if (email === 'admin@admin' && password === 'admin') {
            this._createSession();
            this._resetAttempts();
            db.logAttempt(email, true, clientInfo.ip, clientInfo.browser);
            return { success: true };
        } else {
            const attempts = this._incrementAttempts();
            db.logAttempt(email, false, clientInfo.ip, clientInfo.browser);
            
            if (this.LOCKOUT_TIMES[attempts]) {
                const waitTime = this.LOCKOUT_TIMES[attempts];
                const unlockTime = Date.now() + waitTime;
                localStorage.setItem('auth_lockout_until', unlockTime);
                return { success: false, error: this._getLockoutMessage(unlockTime) };
            }

            return { success: false, error: 'Credenciais inválidas!' };
        }
    }

    logout() {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_expiration');
        window.location.hash = '#/login';
        window.location.reload();
    }

    isAuthenticated() {
        const token = localStorage.getItem('auth_token');
        const expiration = localStorage.getItem('auth_expiration');
        
        if (!token || !expiration) return false;
        
        if (Date.now() > parseInt(expiration)) {
            this.logout();
            return false;
        }
        return true;
    }

    _createSession() {
        localStorage.setItem('auth_token', 'mock_token_' + Date.now());
        localStorage.setItem('auth_expiration', Date.now() + this.SESSION_DURATION);
    }

    _incrementAttempts() {
        let count = parseInt(localStorage.getItem('auth_fails') || 0);
        count++;
        localStorage.setItem('auth_fails', count);
        return count;
    }

    _resetAttempts() {
        localStorage.removeItem('auth_fails');
        localStorage.removeItem('auth_lockout_until');
    }

    _checkLockout() {
        const lockoutUntil = localStorage.getItem('auth_lockout_until');
        if (lockoutUntil && Date.now() < parseInt(lockoutUntil)) {
            return { locked: true, message: this._getLockoutMessage(lockoutUntil) };
        }
        if (lockoutUntil && Date.now() > parseInt(lockoutUntil)) {
             localStorage.removeItem('auth_lockout_until');
        }
        return { locked: false };
    }

    _getLockoutMessage(timestamp) {
        const timeLeft = Math.ceil((parseInt(timestamp) - Date.now()) / 1000 / 60);
        if (timeLeft > 600) { 
            return `Acesso BLOQUEADO. Contate o suporte: (11) 95307-8189.`;
        }
        return `Muitas tentativas falhas. Aguarde ${timeLeft} minuto(s).`;
    }

    async _getClientInfo() {
        let ip = 'Oculto/Localhost';
        let browser = 'Desconhecido';

        // Tenta pegar IP Real
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            ip = data.ip;
        } catch (e) {
            console.warn('Não foi possível obter IP público (provavelmente offline ou adblock).');
        }

        // Identifica Browser simplificado
        const ua = navigator.userAgent;
        if (ua.includes("Edg")) browser = "Edge (Microsoft)";
        else if (ua.includes("Chrome")) browser = "Chrome (Google)";
        else if (ua.includes("Firefox")) browser = "Firefox (Mozilla)";
        else if (ua.includes("Safari")) browser = "Safari (Apple)";
        else if (ua.includes("OPR")) browser = "Opera";
        
        // Adiciona SO
        if (ua.includes("Win")) browser += " no Windows";
        else if (ua.includes("Mac")) browser += " no Mac";
        else if (ua.includes("Linux")) browser += " no Linux";
        else if (ua.includes("Android")) browser += " no Android";
        else if (ua.includes("iPhone")) browser += " no iPhone";

        return { ip, browser };
    }
}

export const authService = new AuthService();