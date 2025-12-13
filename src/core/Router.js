export class Router {
    constructor() {
        this.routes = [];
        window.addEventListener('hashchange', () => this.handleRoute());
        window.addEventListener('load', () => this.handleRoute());
    }

    add(path, viewConfig) {
        const regexPath = new RegExp('^' + path.replace(/:[^\s/]+/g, '([^/]+)') + '$');
        this.routes.push({ path, regex: regexPath, view: viewConfig });
    }

    handleRoute() {
        const hash = window.location.hash.slice(1) || '/';
        
        let match = this.routes.find(r => hash.match(r.regex));
        let params = null;

        if (match) {
            const values = hash.match(match.regex).slice(1);
            if(values.length > 0) params = values[0];
        } else {
            match = this.routes.find(r => r.path === '/');
        }

        const app = document.getElementById('app');
        if (app && match && match.view) {
            const view = match.view;
            if (typeof view === 'object') {
                app.innerHTML = view.render(params); 
                if (view.afterRender) view.afterRender(params);
            } else if (typeof view === 'function') {
                app.innerHTML = view(params);
            }
            
            window.scrollTo(0, 0);
        }
    }
}

export const router = new Router();