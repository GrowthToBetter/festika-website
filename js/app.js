// Main Application Entry Point
class Application {
    constructor() {
        this.isInitialized = false;
    }

    /**
     * Initialize application
     */
    async init() {
        if (this.isInitialized) return;

        console.log('[App] Initializing application...');
        if (window.uiHandler) {
            window.uiHandler.showLoading();
        }

        try {
            // Initialize UI Handler
            if (window.uiHandler) {
                window.uiHandler.init();
            }

            // Initialize handlers
            if (window.navbarHandler) {
                window.navbarHandler.render();
            }
            
            if (window.eventHandler) {
                window.eventHandler.registerWindowEvents();
            }

            // Navigate to home page
            if (window.appRouter) {
                window.appRouter.navigate('home');
            }

            // Render footer
            this.renderFooter();

            this.isInitialized = true;
            console.log('[App] Application initialized successfully');
        } catch (error) {
            console.error('[App] Initialization error:', error);
            if (window.uiHandler) {
                window.uiHandler.showToast('Gagal menginisialisasi aplikasi', 'error');
            }
        } finally {
            if (window.uiHandler) {
                window.uiHandler.hideLoading();
            }
        }
    }

    /**
     * Render footer
     */
    renderFooter() {
        const footer = document.getElementById('footer-container');
        if (!footer) return;
        
        const currentYear = new Date().getFullYear();
        
        footer.innerHTML = `
            <footer style="background-color: var(--card-bg); border-top: 1px solid var(--border); padding: 2rem 0; margin-top: 4rem;">
                <div class="container-fluid">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin-bottom: 2rem;">
                        <div>
                            <h4 style="color: var(--accent); margin-bottom: 1rem;">
                                <i class="fas fa-utensils"></i> CitaRasa
                            </h4>
                            <p style="color: var(--text-secondary); line-height: 1.6;">
                                Platform pemetaan makanan khas Indonesia dengan teknologi native JavaScript.
                            </p>
                        </div>
                        <div>
                            <h5 style="color: var(--text-primary); margin-bottom: 1rem;">Quick Links</h5>
                            <ul style="list-style: none; padding: 0; color: var(--text-secondary);">
                                <li style="margin-bottom: 0.5rem;">
                                    <a href="#" data-page="home" style="color: var(--text-secondary); text-decoration: none;">Beranda</a>
                                </li>
                                <li style="margin-bottom: 0.5rem;">
                                    <a href="#" data-page="explorer" style="color: var(--text-secondary); text-decoration: none;">Jelajahi</a>
                                </li>
                                <li style="margin-bottom: 0.5rem;">
                                    <a href="#" data-page="directory" style="color: var(--text-secondary); text-decoration: none;">Direktori</a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h5 style="color: var(--text-primary); margin-bottom: 1rem;">Hubungi Kami</h5>
                            <p style="color: var(--text-secondary);">
                                <i class="fas fa-envelope"></i> info@citarasa.id<br>
                                <i class="fas fa-phone"></i> +62 123 4567 8900
                            </p>
                        </div>
                    </div>
                    <div style="border-top: 1px solid var(--border); padding-top: 1rem; text-align: center; color: var(--text-secondary);">
                        <p>&copy; ${currentYear} Cita Rasa. Built with Native JavaScript.</p>
                    </div>
                </div>
            </footer>
        `;

        // Attach footer navigation events
        footer.querySelectorAll('[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                if (window.appRouter) {
                    window.appRouter.navigate(link.dataset.page);
                }
            });
        });
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new Application();
    app.init();
});

// Global app reference
window.app = new Application();
