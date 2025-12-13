export class Toast {
    static init() {
        if (document.getElementById('toast-container')) return;

        const container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    static show(message, type = 'success') {
        this.init(); 

        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        
        let icon = 'ph-check-circle';
        if (type === 'error') icon = 'ph-warning-circle';
        if (type === 'warning') icon = 'ph-warning';

        toast.className = `toast-item toast-${type}`;
        toast.innerHTML = `
            <i class="ph-bold ${icon} text-xl"></i>
            <span>${message}</span>
        `;

        container.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 400); 
        }, 4000);
    }
}