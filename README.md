# Cita Rasa - Pemetaan Makanan Nusantara

Platform web native untuk mengeksplorasi makanan khas setiap daerah di Indonesia dengan pemetaan interaktif dan rekomendasi berbasis AI.

## Fitur

- **Peta Interaktif**: Visualisasi makanan daerah menggunakan Leaflet.js
- **Direktori Makanan**: Database lengkap makanan khas Indonesia
- **Rekomendasi AI**: Saran makanan berdasarkan preferensi user
- **Search & Filter**: Pencarian dan filter makanan real-time
- **Responsive Design**: Mobile-friendly design
- **Open Source**: Menggunakan API dan library open-source

## Tech Stack

- **Frontend**: Native HTML5, CSS3, JavaScript ES6+
- **Map**: Leaflet.js (open-source)
- **API**: RestCountries, JSONPlaceholder
- **Styling**: CSS Variables, Bootstrap 5

## Struktur Project

\`\`\`
food-mapping/
├── index.html
├── css/
│   ├── variables.css      # CSS variables & theme
│   ├── main.css           # Main styles
│   ├── navbar.css         # Navbar styles
│   ├── hero.css           # Hero section
│   ├── cards.css          # Card components
│   ├── food-section.css   # Legacy styles
│   └── responsive.css     # Responsive design
├── js/
│   ├── services/
│   │   ├── api-service.js       # API calls
│   │   ├── food-service.js      # Food logic
│   │   ├── map-service.js       # Map integration
│   │   ├── ai-service.js        # AI recommendations
│   │   └── storage-service.js   # LocalStorage
│   ├── handlers/
│   │   ├── navbar-handler.js    # Navbar UI
│   │   ├── page-router.js       # Page routing
│   │   ├── ui-handler.js        # UI utilities
│   │   └── event-handler.js     # Event management
│   └── app.js                   # Main app
├── pages/
│   └── 404.html
└── README.md
\`\`\`

## Micro-services Architecture

Aplikasi menggunakan arsitektur micro-services dengan pemisahan tanggung jawab:

### Services
- **api-service.js**: Menangani semua HTTP requests dengan caching
- **food-service.js**: Business logic makanan dan region
- **map-service.js**: Integrasi Leaflet.js
- **ai-service.js**: Mock AI recommendations
- **storage-service.js**: LocalStorage management

### Handlers
- **navbar-handler.js**: Render dan manage navbar
- **page-router.js**: SPA routing
- **ui-handler.js**: Toast, loading, utilities
- **event-handler.js**: Event bus system

## Cara Kerja

1. **API Integration**: 
   - RestCountries API untuk data geografis
   - JSONPlaceholder untuk dummy data
   - Leaflet tiles dari OpenStreetMap

2. **Data Flow**:
   \`\`\`
   API Service → Food Service → UI Handler → Page Router
   \`\`\`

3. **State Management**:
   - LocalStorage untuk favorites
   - Session-based untuk current page
   - Memory cache untuk API responses

## Instalasi & Setup

### Requirements
- Browser modern (Chrome, Firefox, Safari, Edge)
- Connection internet (untuk API dan CDN)

### Steps
1. Clone atau download project
2. Buka `index.html` di browser
3. Atau gunakan live server (VS Code Live Server extension)

\`\`\`bash
# Dengan Python
python -m http.server 8000

# Atau gunakan Node.js http-server
npx http-server
\`\`\`

## API Resources

- **RestCountries**: https://restcountries.com/v3.1
- **JSONPlaceholder**: https://jsonplaceholder.typicode.com
- **Leaflet**: https://leafletjs.com
- **OpenStreetMap**: https://www.openstreetmap.org

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Notes

- AI recommendations saat ini menggunakan mock data. Untuk production, integrasikan dengan:
  - OpenAI API via backend proxy
  - Anthropic Claude
  - Atau service API lainnya

- Map menggunakan OpenStreetMap tiles. Untuk production dengan brand khusus, pertimbangkan:
  - Mapbox (paid)
  - Google Maps (paid)
  - Custom tile server

## License

MIT License - Feel free to use untuk personal atau commercial projects

## Author

Cita Rasa Team - 2024
