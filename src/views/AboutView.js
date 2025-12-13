import { authorService } from '../services/AuthorService.js';

export const AboutView = {
    render: () => {
        const author = authorService.getData();

        return `
            <div class="animate-fade-in pb-20">
                <div class="text-center mb-16 pt-10">
                    <h2 class="text-5xl md:text-6xl font-black text-primary mb-4 font-serif">Quem escreve?</h2>
                    <p class="text-gray-500 text-lg">${author.role}</p>
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    
                    <div class="relative group cursor-pointer">
                        <img src="${author.avatar}" class="rounded-2xl shadow-2xl w-full object-cover h-[600px] grayscale group-hover:grayscale-0 transition duration-700">
                        
                        <div class="absolute -bottom-10 -right-5 md:-right-10 w-64 polaroid bg-white p-3 pb-12 shadow-2xl rounded transform rotate-3 group-hover:rotate-6 transition duration-500 z-20">
                            <div class="tape -top-3 left-1/2 -translate-x-1/2"></div>
                            <img src="${author.secondaryImage}" class="w-full h-48 object-cover rounded-sm mb-2 shadow-inner">
                            <p class="text-center font-hand text-2xl text-gray-700 -rotate-1 text-shadow-sm">${author.secondaryCaption}</p>
                        </div>
                    </div>

                    <div class="space-y-10 pt-10">
                        <div>
                            <h3 class="text-3xl font-bold text-primary font-serif mb-6">Olá! Sou o <strong class="text-primary">${author.name}</strong>.</h3>
                            <div class="prose text-gray-600 leading-loose text-lg text-justify">${author.bio}</div>
                        </div>

                        <div>
                            <h4 class="font-bold text-accent uppercase tracking-widest text-xs mb-6">Minha Jornada</h4>
                            <div class="border-l-2 border-gray-200 pl-8 space-y-10 mt-4 relative">
                                ${author.timeline.map(item => `
                                    <div class="relative group">
                                        <div class="absolute -left-[41px] top-1 w-5 h-5 bg-gray-300 rounded-full border-4 border-white transition group-hover:bg-accent group-hover:scale-125 shadow-sm"></div>
                                        <h4 class="font-bold text-primary text-xl">${item.year}</h4>
                                        <p class="font-bold text-gray-700 text-sm mb-1">${item.title}</p>
                                        <p class="text-sm text-gray-500 leading-relaxed">${item.desc}</p>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
};