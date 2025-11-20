/**
 * Event Handler - Menangani event global aplikasi
 */

class EventHandler {
    constructor() {
        this.events = new Map();
    }

    /**
     * Register event listener
     */
    on(eventName, callback) {
        if (!this.events.has(eventName)) {
            this.events.set(eventName, []);
        }
        this.events.get(eventName).push(callback);
    }

    /**
     * Emit event
     */
    emit(eventName, data = null) {
        if (this.events.has(eventName)) {
            this.events.get(eventName).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`[EventHandler] Error in ${eventName}:`, error);
                }
            });
        }
    }

    /**
     * Remove event listener
     */
    off(eventName, callback) {
        if (!this.events.has(eventName)) return;
        
        const callbacks = this.events.get(eventName);
        const index = callbacks.indexOf(callback);
        if (index > -1) {
            callbacks.splice(index, 1);
        }
    }

    /**
     * Clear all event listeners
     */
    clear(eventName = null) {
        if (eventName) {
            this.events.delete(eventName);
        } else {
            this.events.clear();
        }
    }

    /**
     * Register window events
     */
    registerWindowEvents() {
        window.addEventListener('online', () => {
            console.log('[EventHandler] Application online');
            if (window.uiHandler) {
                window.uiHandler.showToast('Kembali online', 'success');
            }
        });

        window.addEventListener('offline', () => {
            console.log('[EventHandler] Application offline');
            if (window.uiHandler) {
                window.uiHandler.showToast('Offline mode', 'warning');
            }
        });
    }
}

// Export singleton instance
const eventHandler = new EventHandler();
window.eventHandler = eventHandler; // Global reference
