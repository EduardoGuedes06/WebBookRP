const INITIAL_DATA = {
    systemConfig: {
        maxActiveProjects: 4,
        enableNotifications: true,
        autoReply: false,
        currency: 'BRL',
        adminName: 'Ronaldo Pereira'
    },
    stats: {
        totalVisits: 15420,
        clicksAmazon: 842,
        clicksML: 320,
        clicksShopee: 510,
        mostViewedBook: "O Código da Eternidade",
        monthlyRevenue: [1200, 1500, 1100, 1800, 2200, 14502]
    },
    homeConfig: {
        heroBookId: '1',
        showLaunchBadge: true,
        highlights: ['1', 'S3'],
        quote: {
            text: "Escrever é a única forma que encontrei de viver mil vidas em uma só. E convido você a viver elas comigo.",
            author: "Ronaldo Pereira"
        }
    },
    author: { 
        name: "Ronaldo Pereira", 
        role: "Escritor de Ficção Especulativa", 
        avatar: "https://placehold.co/600x800/1e293b/FFF?text=Autor+Pro",
        bio: "Olá! Sou o Ronaldo. Minha jornada começou devorando livros na biblioteca. Hoje, dedico minha vida a criar histórias que misturam tecnologia, magia e a complexidade humana.",
        secondaryImage: "https://placehold.co/300x300/d97706/FFF?text=Família",
        secondaryCaption: "Meu porto seguro ❤️",
        timeline: [
            { year: "2015", title: "O Início", desc: "Publiquei meu primeiro conto em um blog gratuito." },
            { year: "2018", title: "Primeiro Prêmio", desc: "Vencedor do concurso nacional de Novos Talentos." },
            { year: "2025", title: "Carreira Sólida", desc: "Mais de 10 mil cópias vendidas digitalmente." }
        ]
    },
    posts: [
        { 
            id: 1, 
            title: "Como venci o bloqueio criativo", 
            date: "10/12/2025", 
            category: "Escrita", 
            coverType: 'color', coverColor: '1e293b', coverText: "Bloqueio Criativo", coverTextColor: 'white',
            image: "https://placehold.co/600x300/1e293b/FFF?text=Bloqueio+Criativo", 
            content: "O bloqueio criativo é o pesadelo de todo escritor. Neste post, compartilho a técnica Pomodoro que mudou minha rotina. O segredo é não parar de escrever, mesmo que seja ruim.",
            link: "https://pomofocus.io",
            allowLikes: true, allowComments: true, status: 'published',
            likes: 142, likedBy: [],
            comments: [
                { id: 101, user: "Carlos M.", avatar: "https://placehold.co/40x40/333/FFF?text=C", text: "Ótima dica!", date: "12/12/2025", likes: 5, likedBy: [], authorLike: true },
                { id: 102, user: "Ana Clara", avatar: "https://placehold.co/40x40/555/FFF?text=A", text: "Vou testar hoje.", date: "12/12/2025", likes: 2, likedBy: [], authorLike: false },
                { id: 103, user: "Marcos D.", avatar: "https://placehold.co/40x40/444/FFF?text=M", text: "Funciona mesmo?", date: "11/12/2025", likes: 0, likedBy: [], authorLike: false },
                { id: 104, user: "Julia S.", avatar: "https://placehold.co/40x40/666/FFF?text=J", text: "Texto incrível!", date: "10/12/2025", likes: 1, likedBy: [], authorLike: false },
                { id: 105, user: "Pedro H.", avatar: "https://placehold.co/40x40/777/FFF?text=P", text: "Salvou meu dia.", date: "09/12/2025", likes: 3, likedBy: [], authorLike: false },
                { id: 106, user: "Lucas F.", avatar: "https://placehold.co/40x40/888/FFF?text=L", text: "Muito bom.", date: "08/12/2025", likes: 0, likedBy: [], authorLike: false },
                { id: 107, user: "Fernanda", avatar: "https://placehold.co/40x40/999/FFF?text=F", text: "Compartilhando...", date: "08/12/2025", likes: 10, likedBy: [], authorLike: true }
            ]
        },
        { 
            id: 2, 
            title: "O futuro da Ficção", 
            date: "12/12/2025", 
            category: "Opinião", 
            coverType: 'upload', coverColor: '', coverText: '', coverTextColor: 'black',
            image: "https://placehold.co/600x300/d97706/FFF?text=Sci-Fi+BR", 
            content: "A ficção especulativa nacional tem crescido. O que vocês acham do cenário atual?",
            link: "",
            allowLikes: true, allowComments: true, status: 'published',
            likes: 89, likedBy: [],
            comments: []
        }
    ]
};

class MockDatabase {
    constructor() {
        this.data = {
            ...INITIAL_DATA,
            books: [],
            services: [],
            leads: []
        };
        
        this._generateBooks();
        this._generateServices();
        this._generateMockLeads();
        
        console.log("📦 MockDatabase: Dados carregados em memória.");
    }

    _generateBooks() {
        const covers = ['1e293b', 'd97706', '475569', '0f766e', 'be123c', '4338ca'];
        const genres = ['Ficção', 'Fantasia', 'Thriller'];
        
        // Textos padrão para preencher
        const defaultShortSynopsis = "Uma narrativa envolvente que desafia a percepção da realidade. Prepare-se para não conseguir largar.";
        const defaultFullSynopsis = `
            <p>Em um mundo onde as fronteiras entre o real e o imaginário se dissolvem, este livro convida o leitor a uma jornada sem volta. Com personagens profundos e reviravoltas chocantes, a trama explora os limites da mente humana.</p>
            <p class="mt-4">Prepare-se para questionar tudo o que você sabe. A cada página, um novo mistério é revelado, culminando em um final que deixará você sem fôlego. Ideal para fãs de mistério e suspense psicológico.</p>
        `;

        for(let i=1; i<=6; i++) {
           this.data.books.push({
               id: i.toString(), 
               title: `Livro Vol.${i}`, 
               genre: genres[i%3], 
               price: 29.90+(i*2), 
               active: true, 
               isPromotion: i%2===0, 
               promoPrice: 20.00, 
               cover: `https://placehold.co/300x450/${covers[i%6]}/FFF`, 
               
               // NOVOS DADOS PARA A VIEW DETALHADA
               synopsis: defaultShortSynopsis,
               fullSynopsis: defaultFullSynopsis,
               pages: 250 + (i * 20),
               rating: (4.5 + (Math.random() * 0.5)).toFixed(1), // Entre 4.5 e 5.0
               reviews: 50 + (i * 15),

               // Link estruturado como a View espera
               buyLinks: {
                   amazon: '#amazon', 
                   ml: '#mercadolivre', 
                   shopee: '#shopee'
               }
           });
        }
    }

    _generateServices() {
        this.data.services = [
            { id: 'S1', name: 'Design de Capa', price: 800, active: true, isPromotion: false, icon: 'ph-paint-brush-broad', theme: 'purple', description: 'Capa impactante focada em vendas.' },
            { id: 'S2', name: 'Revisão Textual', price: 0.05, unit: 'p/ palavra', active: true, isPromotion: true, promoPrice: 0.03, icon: 'ph-text-aa', theme: 'blue', description: 'Correção ortográfica e gramatical.' },
            { id: 'S3', name: 'Mentoria Literária', price: 500, active: false, icon: 'ph-student', theme: 'orange', description: 'Sessões de desbloqueio criativo.' }
        ];
    }

    _generateMockLeads() {
        const names = ["Fernanda Costa", "Roberto Silva", "Ana Souza", "Carlos Lima", "Beatriz Melo"];
        const emails = ["fer.costa@email.com", "beto@email.com", "ana.souza@email.com", "carlos@l.com", "bia@m.com"];
        const services = ["Mentoria Literária", "Design de Capa", "Revisão Textual"];
        const prices = { "Mentoria Literária": 500, "Design de Capa": 800, "Revisão Textual": 350 }; 
        const statuses = ['pending', 'analyzing', 'working', 'finished', 'cancelled'];
        
        for(let i=0; i<45; i++) {
            const randIndex = Math.floor(Math.random() * names.length);
            const sName = services[Math.floor(Math.random() * services.length)];
            const daysAgo = Math.floor(Math.random() * 90);
            const date = new Date();
            date.setDate(date.getDate() - daysAgo);
            
            this.data.leads.push({
                id: 1765571805000 + i,
                name: names[randIndex],
                email: emails[randIndex],
                phone: `(11) 9${Math.floor(Math.random() * 9000 + 1000)}-${Math.floor(Math.random() * 9000 + 1000)}`,
                service: sName,
                value: prices[sName],
                desc: `Solicitação nº ${i}. Gostaria de um orçamento detalhado.`,
                date: date.toLocaleDateString('pt-BR'),
                timestamp: date.getTime(),
                status: statuses[Math.floor(Math.random() * statuses.length)],
                notes: "" 
            });
        }
        this.data.leads.sort((a, b) => b.timestamp - a.timestamp);
    }
}

export const db = new MockDatabase();