// UI Handler - Manages UI components and interactions
class UIHandler {
    constructor() {
        this.toastContainer = null;
    }

    /**
     * Initialize UI Handler
     */
    init() {
        this.toastContainer = document.getElementById('toast-container');
    }

    /**
     * Show loading spinner
     */
    showLoading(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="loading-spinner">
                    <div class="spinner"></div>
                    <p>Loading...</p>
                </div>
            `;
        }
    }

    /**
     * Hide loading spinner
     */
    hideLoading(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            const spinner = container.querySelector('.loading-spinner');
            if (spinner) {
                spinner.remove();
            }
        }
    }

    /**
     * Show error message
     */
    showError(containerId, message) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <p>${message}</p>
                </div>
            `;
        }
    }

    /**
     * Show toast notification
     */
    showToast(message, type = 'info', duration = 3000) {
        if (!this.toastContainer) {
            this.init();
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span>${message}</span>
                <button style="background: none; border: none; color: var(--text-light); cursor: pointer; font-size: 1.2rem;">
                    &times;
                </button>
            </div>
        `;

        this.toastContainer.appendChild(toast);

        const closeBtn = toast.querySelector('button');
        closeBtn.addEventListener('click', () => {
            toast.remove();
        });

        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, duration);
    }

    /**
     * Scroll to element
     */
    scrollToElement(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }

    /**
     * Get current page
     */
    getCurrentPage() {
        return window.appRouter ? window.appRouter.currentPage : null;
    }

    /**
     * Render list of items
     */
    renderList(containerId, items, renderItem) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        if (items.length === 0) {
            container.innerHTML = '<p class="empty-state">No items found</p>';
            return;
        }
        
        container.innerHTML = items.map(renderItem).join('');
    }

    /**
     * Debounce function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Export singleton instance
const uiHandler = new UIHandler();
window.uiHandler = uiHandler; // Global reference
