import { router } from './core/Router.js';
import { HomeView } from './views/HomeView.js';
import { LivrosView } from './views/LivrosView.js';
import { ServicesView } from './views/ServicesView.js';
import { BookDetailsView } from './views/BookDetailsView.js';
import { AboutView } from './views/AboutView.js';
import { CommunityView } from './views/CommunityView.js';
import { LoginView } from './views/LoginView.js';
import { DashboardView } from './views/DashboardView.js';
import { Header } from './components/Header.js';
import { Footer } from './components/Footer.js';
import { Toast } from './components/assets/js/Toast.js';

window.Toast = Toast;

router.add('/', HomeView);
router.add('/livros', LivrosView);
router.add('/servicos', ServicesView);
router.add('/autor', AboutView);
router.add('/comunidade', CommunityView);
router.add('/livro/:id', BookDetailsView);
router.add('/login', LoginView);
router.add('/painel', DashboardView);



const headerContainer = document.getElementById('header-container');
if (headerContainer) {
    headerContainer.innerHTML = Header.render();
    Header.afterRender();
}

const footerContainer = document.getElementById('footer-container');
if (footerContainer) {
    footerContainer.innerHTML = Footer.render();
}