/**
 * Map Service - Menangani Leaflet map
 */

class MapService {
    constructor() {
        this.map = null;
        this.markers = [];
    }

    /**
     * Initialize map
     */
    initMap(containerId, center = [-2.5489, 118.0149], zoom = 5) {
        if (this.map) {
            this.map.remove();
        }

        this.map = L.map(containerId).setView(center, zoom);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
            maxZoom: 18
        }).addTo(this.map);

        console.log('[MapService] Map initialized');
        return this.map;
    }

    /**
     * Add single marker
     */
    addMarker(lat, lng, title, popupContent = '') {
        if (!this.map) {
            console.error('[MapService] Map not initialized');
            return null;
        }

        const marker = L.marker([lat, lng])
            .addTo(this.map)
            .bindPopup(popupContent || title);

        this.markers.push(marker);
        return marker;
    }

    /**
     * Add multiple markers
     */
    addMultipleMarkers(locations) {
        locations.forEach(location => {
            const lat = location.latitude || location.lat;
            const lng = location.longitude || location.lng;
            
            if (!lat || !lng) return;
            
            const popupContent = `
                <div style="text-align: center;">
                    <h3 style="margin: 0 0 0.5rem; color: var(--accent);">${location.name}</h3>
                    <button onclick="window.appRouter.showRegionFoods('${location.id}')" 
                            style="background: var(--accent); color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.25rem; cursor: pointer;">
                        Lihat Makanan
                    </button>
                </div>
            `;
            this.addMarker(lat, lng, location.name, popupContent);
        });
    }

    /**
     * Clear all markers
     */
    clearMarkers() {
        this.markers.forEach(marker => marker.remove());
        this.markers = [];
    }

    /**
     * Set center
     */
    setCenter(lat, lng, zoom = 8) {
        if (this.map) {
            this.map.setView([lat, lng], zoom);
        }
    }

    /**
     * Fit bounds to all markers
     */
    fitBounds() {
        if (this.markers.length > 0) {
            const group = L.featureGroup(this.markers);
            this.map.fitBounds(group.getBounds().pad(0.1));
        }
    }
}

// Export singleton instance
const mapService = new MapService();
window.mapService = mapService; // Global reference
