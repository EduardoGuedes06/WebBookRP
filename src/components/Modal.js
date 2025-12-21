export const Modal = {
    getElements: () => ({
        overlay: document.getElementById('modal-overlay'),
        content: document.getElementById('modal-content'),
        title: document.getElementById('modal-title'),
        body: document.getElementById('modal-body'),
        footer: document.getElementById('modal-footer'),
        closeBtn: document.getElementById('btn-close-modal')
    }),

    open: (title, bodyHTML, footerHTML = '') => {
        const els = Modal.getElements();

        if(!els.overlay) {
            console.error("❌ ERRO: #modal-overlay não encontrado!");
            return;
        }

        els.title.innerText = title;
        els.body.innerHTML = bodyHTML;
        els.footer.innerHTML = footerHTML;

        // --- CORREÇÃO DE ALINHAMENTO AQUI ---
        if (!footerHTML) {
            els.footer.style.display = 'none';
        } else {
            els.footer.style.display = 'flex';
            els.footer.style.justifyContent = 'flex-end'; // Manda para a DIREITA
            els.footer.style.gap = '12px'; // Separa os botões
        }

        // Força bruta para mostrar
        els.overlay.style.display = 'flex'; 
        els.overlay.style.zIndex = '9999';
        
        requestAnimationFrame(() => {
            els.overlay.style.opacity = '1';
            els.content.style.transform = 'scale(1)';
            els.content.style.opacity = '1';
        });
    },

    close: () => {
        const els = Modal.getElements();
        if(!els.overlay) return;

        els.overlay.style.opacity = '0';
        els.content.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            els.overlay.style.display = 'none';
        }, 200);
    }
};

document.addEventListener('click', (e) => {
    if(e.target.closest('#btn-close-modal') || e.target.id === 'modal-overlay') {
        Modal.close();
    }
});

window.Modal = Modal;