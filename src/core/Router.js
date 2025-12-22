export class Router {
    constructor() {
        this.routes = {};
    }

    add(path, view) {
        // Cria uma Regex para identificar IDs (ex: /livro/:id)
        const regexPath = "^" + path.replace(/:\w+/g, "(.+)") + "$";
        this.routes[path] = { view, regex: new RegExp(regexPath) };
    }

    navigate(url) {
        // MUDA A URL SEM RECARREGAR (URL LIMPA)
        window.history.pushState(null, null, url);
        this.handleLocation();
    }

    async handleLocation() {
        // LÊ A URL LIMPA (pathname), IGNORANDO O HASH
        const path = window.location.pathname;
        
        let match = null;
        let routeMatch = null;

        // Procura qual rota bate com o endereço atual
        for (const route in this.routes) {
            const r = this.routes[route];
            const m = path.match(r.regex);
            if (m) {
                match = m;
                routeMatch = r;
                break;
            }
        }

        // Se não achar rota, define a Home como padrão
        if (!routeMatch) {
            routeMatch = this.routes['/'] || this.routes['/404'];
        }

        const app = document.getElementById('app');
        
        if (app && routeMatch) {
            // Pega o ID se existir (o grupo de captura da regex)
            const param = match && match.length > 1 ? match[1] : null;
            
            // Renderiza a tela
            app.innerHTML = await routeMatch.view.render(param);
            
            // Roda os scripts da tela (botões, eventos)
            if (routeMatch.view.afterRender) {
                await routeMatch.view.afterRender();
            }
        }
    }
}

export const router = new Router();