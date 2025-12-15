export class Router {
    constructor() {
        this.routes = [];
    }

    add(path, view) {
        const regexPath = "^" + path.replace(/:\w+/g, "(.+)") + "$";
        this.routes.push({ 
            path, 
            view, 
            regex: new RegExp(regexPath) 
        });
    }

    navigate(url) {
        window.history.pushState(null, null, url);
        this.handleLocation();
    }

    async handleLocation() {
        const path = window.location.pathname;
        let match = this.routes.find(route => path.match(route.regex));

        if (!match) {
            match = this.routes.find(route => route.path === '/404');
        }

        const app = document.getElementById('app');
        if (app && match) {
            const params = path.match(match.regex);
            app.innerHTML = await match.view.render(params ? params[1] : null);
            
            if (match.view.afterRender) {
                await match.view.afterRender();
            }
        }
    }
}

export const router = new Router();