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

        // Ajusta Footer
        if (!footerHTML) {
            els.footer.style.display = 'none';
        } else {
            els.footer.style.display = 'flex';
            els.footer.style.justifyContent = 'flex-end';
            els.footer.style.gap = '12px';
        }

        // Mostra o Modal
        els.overlay.style.display = 'flex'; 
        els.overlay.style.opacity = '0'; // Começa invisível para transição
        els.overlay.style.zIndex = '9999';

        // --- TRAVA O SCROLL DA PÁGINA DE TRÁS ---
        document.body.style.overflow = 'hidden'; 
        // ----------------------------------------

        // Animação de entrada
        requestAnimationFrame(() => {
            els.overlay.style.opacity = '1';
            els.content.style.transform = 'scale(1)';
            els.content.style.opacity = '1';
        });

        // Evento para fechar no botão X (caso exista)
        if(els.closeBtn) els.closeBtn.onclick = Modal.close;
    },

    close: () => {
        const els = Modal.getElements();
        if(!els.overlay) return;

        els.overlay.style.opacity = '0';
        els.content.style.transform = 'scale(0.95)';
        
        // --- DESTRAVA O SCROLL DA PÁGINA ---
        document.body.style.overflow = ''; 
        // -----------------------------------

        setTimeout(() => {
            els.overlay.style.display = 'none';
        }, 300);
    }
};