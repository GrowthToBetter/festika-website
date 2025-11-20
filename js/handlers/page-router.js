/**
 * Page Router - Menangani navigasi antar halaman
 */

class PageRouter {
  constructor() {
    this.currentPage = "home"
    this.pages = {
      home: this.renderHomePage.bind(this),
      explorer: this.renderExplorerPage.bind(this),
      directory: this.renderDirectoryPage.bind(this),
      "ai-chat": this.renderAIChatPage.bind(this),
      about: this.renderAboutPage.bind(this),
    }
  }

  /**
   * Navigate ke halaman
   */
  navigate(pageId) {
    if (!this.pages[pageId]) {
      console.warn("[Router] Page not found:", pageId)
      return
    }

    this.currentPage = pageId
    if (window.navbarHandler) {
      window.navbarHandler.setActive(pageId)
    }
    this.pages[pageId]()
    window.scrollTo(0, 0)
  }

  /**
   * Render Home Page
   */
  renderHomePage() {
    const container = document.getElementById("page-container")
    container.innerHTML = `
            <section class="hero">
                <div class="hero-content">
                    <h1>Jelajahi <span class="accent">Cita Rasa</span> Nusantara</h1>
                    <p>Temukan makanan khas setiap daerah di Indonesia dengan pemetaan interaktif dan rekomendasi AI</p>
                    
                    <div class="hero-buttons">
                        <button class="btn-primary-custom" id="btn-explore">
                            <i class="fas fa-map"></i> Mulai Jelajahi
                        </button>
                        <button class="btn-secondary-custom" id="btn-learn-more">
                            <i class="fas fa-book"></i> Pelajari Lebih
                        </button>
                    </div>

                    <div class="hero-features">
                        <div class="feature-card">
                            <div class="feature-icon">
                                <i class="fas fa-map-marked-alt"></i>
                            </div>
                            <h3>Peta Interaktif</h3>
                            <p>Jelajahi lokasi makanan khas di seluruh Indonesia</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon">
                                <i class="fas fa-brain"></i>
                            </div>
                            <h3>Rekomendasi AI</h3>
                            <p>Dapatkan saran makanan berdasarkan preferensi Anda</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon">
                                <i class="fas fa-star"></i>
                            </div>
                            <h3>Rating & Review</h3>
                            <p>Lihat rating dan ulasan dari pengunjung lainnya</p>
                        </div>
                    </div>
                </div>
            </section>
        `

    document.getElementById("btn-explore").addEventListener("click", () => {
      this.navigate("explorer")
    })

    document.getElementById("btn-learn-more").addEventListener("click", () => {
      this.navigate("directory")
    })
  }

  /**
   * Render Explorer Page
   */
  async renderExplorerPage() {
    const container = document.getElementById("page-container")
    container.innerHTML = `
            <section class="section" style="padding: 2rem 0;">
                <div class="container-fluid">
                    <h2 class="section-title">Peta Makanan Daerah Indonesia</h2>
                    
                    <div style="margin-bottom: 2rem;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <input 
                                type="text" 
                                id="search-region" 
                                class="form-control" 
                                placeholder="Cari daerah..." 
                                style="background-color: white; color: var(--text-primary); border-color: var(--border); padding: 0.625rem 1rem; border-radius: 0.375rem; border: 1px solid;"
                            >
                            <select 
                                id="filter-region" 
                                class="form-select" 
                                style="background-color: white; color: var(--text-primary); border-color: var(--border); padding: 0.625rem 1rem; border-radius: 0.375rem; border: 1px solid;"
                            >
                                <option value="">Semua Daerah</option>
                            </select>
                        </div>
                    </div>

                    <div id="map" style="width: 100%; height: 600px; border-radius: 0.5rem; border: 1px solid var(--border); box-shadow: var(--shadow-md);"></div>
                </div>
            </section>

            <section class="section" style="background-color: var(--card-bg);">
                <div class="container-fluid">
                    <h3 style="margin-bottom: 2rem; color: var(--text-primary);">Makanan di Daerah yang Dipilih</h3>
                    <div id="region-foods" class="grid-2"></div>
                </div>
            </section>
        `

    await this.initExplorerMap()
  }

  /**
   * Initialize Explorer Map
   */
  async initExplorerMap() {
    const regionsData = await window.ApiService.getRegions()
    const regions = regionsData.regions || []

    window.mapService.initMap("map")

    if (regions.length > 0) {
      window.mapService.addMultipleMarkers(regions)
      window.mapService.fitBounds()
    }

    const filterSelect = document.getElementById("filter-region")
    const searchInput = document.getElementById("search-region")

    regions.forEach((region) => {
      const option = document.createElement("option")
      option.value = region.id
      option.textContent = region.name
      filterSelect.appendChild(option)
    })

    filterSelect.addEventListener("change", async (e) => {
      if (e.target.value) {
        const regionId = e.target.value
        const region = regions.find((r) => r.id == regionId)
        if (region && region.latitude && region.longitude) {
          window.mapService.setCenter(region.latitude, region.longitude, 8)
        }
        await this.showRegionFoods(regionId)
      }
    })

    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase().trim()

      if (!searchTerm) {
        window.mapService.fitBounds()
        document.getElementById("region-foods").innerHTML = ""
        filterSelect.value = ""
        return
      }

      const filteredRegions = regions.filter((region) => region.name.toLowerCase().includes(searchTerm))

      if (filteredRegions.length === 0) {
        document.getElementById("region-foods").innerHTML =
          '<p style="color: var(--text-secondary);">Daerah tidak ditemukan</p>'
        return
      }

      if (filteredRegions.length === 1) {
        const region = filteredRegions[0]
        if (region.latitude && region.longitude) {
          window.mapService.setCenter(region.latitude, region.longitude, 8)
        }
        filterSelect.value = region.id
        this.showRegionFoods(region.id)
      }
    })
  }

  /**
   * Show foods of selected region
   */
  async showRegionFoods(regionId) {
    const foodsData = await window.ApiService.getFoodsByRegion(regionId)
    const foods = foodsData.foods || []

    const container = document.getElementById("region-foods")

    if (foods.length === 0) {
      container.innerHTML = '<p style="color: var(--text-secondary);">Belum ada data makanan untuk daerah ini</p>'
      return
    }

    container.innerHTML = foods
      .map(
        (food) => `
            <div class="food-card">
                <div class="food-card-image" style="background:url('${food.image_url}'); background-size: cover;"></div>
                <div class="food-card-body">
                    <h3 class="food-card-title">${food.name}</h3>
                    <p class="food-card-region">${food.region || ""}</p>
                    <p class="food-card-description">${food.description || ""}</p>
                    <div class="food-card-footer">
                        <div class="food-rating">
                            ⭐ ${food.rating || "N/A"}
                        </div>
                        <button class="btn-primary-custom" style="padding: 0.5rem 1rem; font-size: 0.875rem;">
                            Detail
                        </button>
                    </div>
                </div>
            </div>
        `,
      )
      .join("")
  }

  /**
   * Render Directory Page
   */
  async renderDirectoryPage() {
    const container = document.getElementById("page-container")

    container.innerHTML = `
            <section class="section">
                <div class="container-fluid">
                    <h2 class="section-title">Direktori Makanan Nusantara</h2>
                    
                    <!-- Enhanced search and filter section -->
                    <div style="margin-bottom: 2rem; background: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <!-- Search Bar with Icon -->
                        <div style="position: relative; margin-bottom: 1rem;">
                            <i class="fas fa-search" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #6c757d;"></i>
                            <input 
                                type="text" 
                                id="search-food" 
                                class="form-control" 
                                placeholder="Cari makanan favorit Anda..." 
                                style="background-color: #f8f9fa; color: var(--text-primary); border: 2px solid transparent; padding: 0.75rem 1rem 0.75rem 3rem; border-radius: 2rem; transition: all 0.3s; font-size: 1rem;"
                            >
                            <button 
                                id="clear-search" 
                                class="btn" 
                                style="position: absolute; right: 0.5rem; top: 50%; transform: translateY(-50%); background: none; border: none; color: #6c757d; display: none;"
                            >
                                <i class="fas fa-times-circle"></i>
                            </button>
                        </div>

                        <!-- Filter Controls -->
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1rem;">

                            <select 
                                id="filter-region" 
                                class="form-select" 
                                style="background-color: #f8f9fa; color: var(--text-primary); border: 1px solid #dee2e6; padding: 0.625rem 1rem; border-radius: 0.5rem; transition: all 0.3s;"
                            >
                                <option value="">📍 Semua Daerah</option>
                            </select>

                            <select 
                                id="sort-by" 
                                class="form-select" 
                                style="background-color: #f8f9fa; color: var(--text-primary); border: 1px solid #dee2e6; padding: 0.625rem 1rem; border-radius: 0.5rem; transition: all 0.3s;"
                            >
                                <option value="name-asc">📋 Nama (A-Z)</option>
                                <option value="name-desc">📋 Nama (Z-A)</option>
                                <option value="rating-desc">⭐ Rating Tertinggi</option>
                                <option value="rating-asc">⭐ Rating Terendah</option>
                            </select>
                        </div>

                        <!-- View Toggle and Results Count -->
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div id="results-count" style="color: #6c757d; font-size: 0.875rem;">
                                Memuat data...
                            </div>
                            <div style="display: flex; gap: 0.5rem;">
                                <button 
                                    id="view-grid" 
                                    class="btn btn-sm active-view" 
                                    style="background: var(--accent); color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.375rem; transition: all 0.3s;"
                                >
                                    <i class="fas fa-th"></i> Grid
                                </button>
                                <button 
                                    id="view-list" 
                                    class="btn btn-sm" 
                                    style="background: #e9ecef; color: #6c757d; border: none; padding: 0.5rem 1rem; border-radius: 0.375rem; transition: all 0.3s;"
                                >
                                    <i class="fas fa-list"></i> List
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Loading skeleton -->
                    <div id="loading-skeleton" style="display: none;">
                        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem;">
                            ${Array(6)
                              .fill(0)
                              .map(
                                () => `
                                <div class="skeleton-card" style="background: white; border-radius: 0.5rem; overflow: hidden; animation: pulse 1.5s ease-in-out infinite;">
                                    <div style="height: 200px; background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite;"></div>
                                    <div style="padding: 1rem;">
                                        <div style="height: 20px; background: #e0e0e0; border-radius: 4px; margin-bottom: 0.5rem;"></div>
                                        <div style="height: 16px; background: #e0e0e0; border-radius: 4px; width: 60%;"></div>
                                    </div>
                                </div>
                            `,
                              )
                              .join("")}
                        </div>
                    </div>

                    <div id="foods-container" class="grid-2" style="transition: all 0.3s;"></div>
                </div>
            </section>

            <style>
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                
                #search-food:focus {
                    border-color: var(--accent) !important;
                    background-color: white !important;
                    box-shadow: 0 0 0 3px rgba(255, 152, 0, 0.1) !important;
                    outline: none !important;
                }

                .food-card {
                    transition: transform 0.3s, box-shadow 0.3s;
                    cursor: pointer;
                }

                .food-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 12px 24px rgba(0,0,0,0.15) !important;
                }

                .active-view {
                    background: var(--accent) !important;
                    color: white !important;
                }

                .list-view {
                    display: flex !important;
                    flex-direction: row !important;
                    align-items: center !important;
                }

                .list-view .food-card-image {
                    width: 150px !important;
                    height: 150px !important;
                    flex-shrink: 0;
                }

                .list-view .food-card-body {
                    flex: 1;
                }
            </style>
        `

    await this.initDirectoryPage()
  }

  /**
   * Initialize directory page with enhanced features
   */
  async initDirectoryPage() {
    const searchInput = document.getElementById("search-food")
    const clearBtn = document.getElementById("clear-search")
    const filterRegion = document.getElementById("filter-region")
    const sortBy = document.getElementById("sort-by")
    const viewGrid = document.getElementById("view-grid")
    const viewList = document.getElementById("view-list")

    let currentView = "grid"
    let allFoods = []
    let filteredFoods = []

    // Load regions for filter
    const regionsData = await window.ApiService.getRegions()
    const regions = regionsData.regions || []
    regions.forEach((region) => {
      const option = document.createElement("option")
      option.value = region.name
      option.textContent = `📍 ${region.name}`
      filterRegion.appendChild(option)
    })

    // Initial load
    await this.renderFoodsGrid("")

    // Search with debounce
    const debouncedSearch = window.uiHandler.debounce(async (query) => {
      document.getElementById("loading-skeleton").style.display = "block"
      document.getElementById("foods-container").style.opacity = "0.5"

      await this.renderFoodsGrid(query)

      document.getElementById("loading-skeleton").style.display = "none"
      document.getElementById("foods-container").style.opacity = "1"
    }, 500)

    searchInput.addEventListener("input", (e) => {
      const value = e.target.value
      clearBtn.style.display = value ? "block" : "none"
      debouncedSearch(value)
    })

    clearBtn.addEventListener("click", () => {
      searchInput.value = ""
      clearBtn.style.display = "none"
      this.renderFoodsGrid("")
    })

    // Filter and sort handlers
    const applyFilters = async () => {
      document.getElementById("loading-skeleton").style.display = "block"
      document.getElementById("foods-container").style.opacity = "0.5"

      const searchQuery = searchInput.value
      const region = filterRegion.value
      const sort = sortBy.value

      const foodsData = await window.ApiService.searchFoods(searchQuery)
      allFoods = foodsData.results || []

      // Apply filters
      filteredFoods = allFoods.filter((food) => {
        const matchCategory = !category || food.category === category
        const matchRegion = !region || food.region === region
        return matchCategory && matchRegion
      })

      // Apply sorting
      if (sort === "name-asc") {
        filteredFoods.sort((a, b) => a.name.localeCompare(b.name))
      } else if (sort === "name-desc") {
        filteredFoods.sort((a, b) => b.name.localeCompare(a.name))
      } else if (sort === "rating-desc") {
        filteredFoods.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      } else if (sort === "rating-asc") {
        filteredFoods.sort((a, b) => (a.rating || 0) - (b.rating || 0))
      }

      this.renderFoodsFromArray(filteredFoods, currentView)

      document.getElementById("loading-skeleton").style.display = "none"
      document.getElementById("foods-container").style.opacity = "1"
    }

    filterRegion.addEventListener("change", applyFilters)
    sortBy.addEventListener("change", applyFilters)

    // View toggle
    viewGrid.addEventListener("click", () => {
      currentView = "grid"
      viewGrid.classList.add("active-view")
      viewList.classList.remove("active-view")
      viewGrid.style.background = "var(--accent)"
      viewGrid.style.color = "white"
      viewList.style.background = "#e9ecef"
      viewList.style.color = "#6c757d"

      const container = document.getElementById("foods-container")
      container.className = "grid-2"
      container.querySelectorAll(".food-card").forEach((card) => {
        card.classList.remove("list-view")
      })
    })

    viewList.addEventListener("click", () => {
      currentView = "list"
      viewList.classList.add("active-view")
      viewGrid.classList.remove("active-view")
      viewList.style.background = "var(--accent)"
      viewList.style.color = "white"
      viewGrid.style.background = "#e9ecef"
      viewGrid.style.color = "#6c757d"

      const container = document.getElementById("foods-container")
      container.style.display = "flex"
      container.style.flexDirection = "column"
      container.style.gap = "1rem"
      container.querySelectorAll(".food-card").forEach((card) => {
        card.classList.add("list-view")
      })
    })
  }

  /**
   * Render foods grid
   */
  async renderFoodsGrid(query) {
    const container = document.getElementById("foods-container")
    const resultsCount = document.getElementById("results-count")

    try {
      const foodsData = await window.ApiService.searchFoods(query)
      const foods = foodsData.results || []

      if (resultsCount) {
        if (foodsData.success === false) {
          resultsCount.innerHTML = `<span style="color: #dc3545;"><i class="fas fa-exclamation-triangle"></i> ${foodsData.error || "Gagal memuat data"}</span>`
        } else {
          resultsCount.textContent = `Menampilkan ${foods.length} makanan`
        }
      }

      if (foods.length === 0) {
        container.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--text-secondary);">
                        <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                        <p style="font-size: 1.125rem; margin: 0;">${foodsData.success === false ? "Tidak dapat terhubung ke server" : "Makanan tidak ditemukan"}</p>
                        <p style="font-size: 0.875rem; margin-top: 0.5rem;">${foodsData.success === false ? "Server mungkin sedang cold start. Silakan tunggu sebentar dan refresh halaman." : "Coba kata kunci lain atau ubah filter"}</p>
                        ${foodsData.success === false ? '<button class="btn-primary-custom" onclick="location.reload()" style="margin-top: 1rem;"><i class="fas fa-redo"></i> Refresh</button>' : ""}
                    </div>
                `
        return
      }

      this.renderFoodsFromArray(foods, "grid")
    } catch (error) {
      console.error("[v0] Error rendering foods grid:", error)

      container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--text-secondary);">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem; color: #dc3545;"></i>
                    <p style="font-size: 1.125rem; margin: 0;">Tidak dapat memuat data</p>
                    <p style="font-size: 0.875rem; margin-top: 0.5rem;">Server mungkin sedang cold start. Silakan tunggu sebentar dan coba lagi.</p>
                    <button class="btn-primary-custom" onclick="location.reload()" style="margin-top: 1rem;"><i class="fas fa-redo"></i> Refresh Halaman</button>
                </div>
            `

      if (resultsCount) {
        resultsCount.innerHTML = `<span style="color: #dc3545;"><i class="fas fa-exclamation-triangle"></i> Error loading data</span>`
      }
    }
  }

  /**
   * Render foods from array with view mode
   */
  renderFoodsFromArray(foods, viewMode = "grid") {
    const container = document.getElementById("foods-container")
    const resultsCount = document.getElementById("results-count")

    if (resultsCount) {
      resultsCount.textContent = `Menampilkan ${foods.length} makanan`
    }

    container.innerHTML = foods
      .map(
        (food, index) => `
            <div class="food-card ${viewMode === "list" ? "list-view" : ""}" style="animation: fadeIn 0.5s ease-in-out ${index * 0.1}s both;">
                <div class="food-card-image" style="background:url('${food.image_url}'); background-size: cover;; display: flex; align-items: center; justify-content: center; font-size: 4rem;">
                </div>
                <div class="food-card-body">
                    <h3 class="food-card-title" style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem;">${food.name}</h3>
                    <p class="food-card-region" style="color: var(--accent); font-size: 0.875rem; margin-bottom: 0.75rem;">
                        <i class="fas fa-map-marker-alt"></i> ${food.region || "Indonesia"}
                    </p>
                    <p class="food-card-description" style="color: var(--text-secondary); font-size: 0.875rem; line-height: 1.5; margin-bottom: 1rem;">
                        ${food.description || "Makanan khas Indonesia"}
                    </p>
                    ${
                      food.ingredients
                        ? `
                        <div style="margin-bottom: 0.75rem;">
                            <span style="font-size: 0.75rem; color: #6c757d; text-transform: uppercase; font-weight: 600;">Bahan Utama:</span>
                            <p style="font-size: 0.875rem; color: var(--text-secondary); margin: 0.25rem 0;">
                                ${Array.isArray(food.ingredients) ? food.ingredients.slice(0, 3).join(", ") : food.ingredients}
                            </p>
                        </div>
                    `
                        : ""
                    }
                    <div class="food-card-footer" style="display: flex; justify-content: space-between; align-items: center;">
                        <div class="food-rating" style="display: flex; align-items: center; gap: 0.5rem;">
                            <span style="color: #ffc107; font-size: 1.125rem;">⭐</span>
                            <span style="font-weight: 600; color: var(--text-primary);">${food.rating || "N/A"}</span>
                            ${
                              food.difficulty_level
                                ? `
                                <span style="margin-left: 0.5rem; padding: 0.25rem 0.5rem; background: #e9ecef; border-radius: 0.25rem; font-size: 0.75rem; color: #6c757d;">
                                    ${food.difficulty_level}
                                </span>
                            `
                                : ""
                            }
                        </div>
                        <button class="btn-primary-custom" style="padding: 0.5rem 1rem; font-size: 0.875rem; transition: all 0.3s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                            <i class="fas fa-heart"></i> Simpan
                        </button>
                    </div>
                </div>
            </div>
        `,
      )
      .join("")
  }

  /**
   * Render About Page
   */
  renderAboutPage() {
    const container = document.getElementById("page-container")
    container.innerHTML = `
            <section class="section">
                <div class="container-fluid">
                    <h2 class="section-title">Tentang Cita Rasa</h2>
                    
                    <div style="max-width: 800px; margin: 0 auto;">
                        <div style="background-color: white; border: 1px solid var(--border); padding: 2rem; border-radius: 0.5rem;">
                            <h3 style="color: var(--accent); margin-bottom: 1rem; font-weight: 600;">Misi Kami</h3>
                            <p style="color: var(--text-secondary); margin-bottom: 2rem; line-height: 1.6;">
                                Cita Rasa adalah platform yang dirancang untuk memperkenalkan kekayaan kuliner Indonesia kepada masyarakat lokal dan pendatang. Kami percaya bahwa makanan adalah jembatan budaya yang menghubungkan orang-orang dari berbagai latar belakang.
                            </p>

                            <h3 style="color: var(--accent); margin-bottom: 1rem; font-weight: 600;">Fitur Utama</h3>
                            <ul style="color: var(--text-secondary); margin-bottom: 2rem; padding-left: 1.5rem; line-height: 1.8;">
                                <li>Peta interaktif makanan daerah Indonesia</li>
                                <li>Rekomendasi berbasis AI untuk menemukan makanan favorit</li>
                                <li>Rating dan review dari pengguna lain</li>
                                <li>Informasi detail tentang asal dan ciri khas makanan</li>
                                <li>Integrasi dengan berbagai API terbuka untuk data yang akurat</li>
                            </ul>

                            <h3 style="color: var(--accent); margin-bottom: 1rem; font-weight: 600;">Teknologi</h3>
                            <p style="color: var(--text-secondary); line-height: 1.6;">
                                Dibangun dengan teknologi native HTML, CSS, dan JavaScript tanpa framework berat. Kami menggunakan Leaflet.js untuk peta interaktif dan berbagai API terbuka untuk data makanan.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        `
  }

  renderAIChatPage() {
    const container = document.getElementById("page-container")
    container.innerHTML = `
            <section class="section">
                <div class="container-fluid">
                    <h2 class="section-title">Chat AI Kuliner</h2>
                    
                    <div style="max-width: 800px; margin: 0 auto;">
                        <div style="background-color: white; border: 1px solid var(--border); padding: 2rem; border-radius: 0.5rem; box-shadow: var(--shadow-md);">
                            
                            <!-- Chat Messages -->
                            <div id="chat-messages" style="height: 400px; overflow-y: auto; margin-bottom: 1.5rem; padding: 1rem; border: 1px solid var(--border); border-radius: 0.375rem; background-color: #f8f9fa;">
                                <div class="text-center" style="color: var(--text-secondary); padding: 3rem 1rem;">
                                    <i class="fas fa-robot" style="font-size: 3rem; margin-bottom: 1rem; color: var(--accent);"></i>
                                    <p>Mulai percakapan tentang kuliner Nusantara!</p>
                                </div>
                            </div>

                            <!-- Quick Actions -->
                            <div style="margin-bottom: 1.5rem;">
                                <label style="font-weight: 600; margin-bottom: 0.5rem; display: block; color: var(--text-primary);">Quick Actions:</label>
                                <div style="display: grid; gap: 0.5rem;">
                                    <button class="btn-secondary-custom" style="text-align: left; padding: 0.75rem 1rem; font-size: 0.875rem;" onclick="window.appRouter.sendQuickMessage('Rekomendasikan makanan khas Jawa Barat')">
                                        <i class="fas fa-utensils" style="margin-right: 0.5rem;"></i>Rekomendasikan makanan daerah
                                    </button>
                                    <button class="btn-secondary-custom" style="text-align: left; padding: 0.75rem 1rem; font-size: 0.875rem;" onclick="window.appRouter.sendQuickMessage('Apa itu Rendang?')">
                                        <i class="fas fa-info-circle" style="margin-right: 0.5rem;"></i>Tanya tentang makanan tertentu
                                    </button>
                                    <button class="btn-secondary-custom" style="text-align: left; padding: 0.75rem 1rem; font-size: 0.875rem;" onclick="window.appRouter.sendQuickMessage('Bagaimana cara membuat Gudeg?')">
                                        <i class="fas fa-book" style="margin-right: 0.5rem;"></i>Minta resep masakan
                                    </button>
                                    <button class="btn-secondary-custom" style="text-align: left; padding: 0.75rem 1rem; font-size: 0.875rem;" onclick="window.appRouter.sendQuickMessage('Ceritakan sejarah Sate Padang')">
                                        <i class="fas fa-history" style="margin-right: 0.5rem;"></i>Pelajari sejarah kuliner
                                    </button>
                                </div>
                            </div>

                            <!-- Input Form -->
                            <div style="display: flex; gap: 0.5rem;">
                                <input 
                                    type="text" 
                                    id="chat-input" 
                                    class="form-control" 
                                    placeholder="Tanya tentang kuliner Nusantara..."
                                    style="flex: 1; background-color: white; color: var(--text-primary); border-color: var(--border); padding: 0.625rem 1rem; border-radius: 0.375rem; border: 1px solid;"
                                    onkeypress="if(event.key === 'Enter') window.appRouter.sendChatMessage()"
                                >
                                <button class="btn-primary-custom" onclick="window.appRouter.sendChatMessage()" style="padding: 0.625rem 1.5rem;">
                                    <i class="fas fa-paper-plane"></i> Kirim
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `
  }

  async sendChatMessage() {
    const input = document.getElementById("chat-input")
    const chatMessages = document.getElementById("chat-messages")

    if (!input || !chatMessages) {
      console.error("[PageRouter] Chat elements not found")
      return
    }

    const message = input.value.trim()

    if (!message) return

    // Clear input
    input.value = ""

    // Add user message to chat
    this.addChatMessage("user", message)

    // Show loading
    this.addChatMessage("bot", "Sedang berpikir...", true)

    try {
      // Get AI response
      const response = await window.aiService.chatAboutFood(message)

      // Remove loading message
      const loadingMsg = chatMessages.querySelector(".loading-message")
      if (loadingMsg) loadingMsg.remove()

      // Add bot response
      this.addChatMessage("bot", response.response || "Maaf, saya tidak dapat menjawab saat ini.")
    } catch (error) {
      console.error("[PageRouter] Error sending message:", error)

      // Remove loading message
      const loadingMsg = chatMessages.querySelector(".loading-message")
      if (loadingMsg) loadingMsg.remove()

      // Add error message
      this.addChatMessage("bot", "Maaf, terjadi kesalahan. Silakan coba lagi.")
    }
  }

  sendQuickMessage(message) {
    const input = document.getElementById("chat-input")

    if (!input) {
      console.error("[PageRouter] Chat input not found")
      return
    }

    input.value = message
    this.sendChatMessage()
  }

  addChatMessage(sender, message, isLoading = false) {
    const chatMessages = document.getElementById("chat-messages")

    if (!chatMessages) {
      console.error("[PageRouter] Chat messages container not found")
      return
    }

    // Remove welcome message if exists
    const welcomeMsg = chatMessages.querySelector(".text-center")
    if (welcomeMsg) welcomeMsg.remove()

    const messageDiv = document.createElement("div")
    messageDiv.className = `mb-3 ${isLoading ? "loading-message" : ""}`
    messageDiv.style.marginBottom = "1rem"

    if (sender === "user") {
      messageDiv.innerHTML = `
                <div style="display: flex; justify-content: flex-end;">
                    <div style="background-color: var(--accent); color: white; border-radius: 1rem; padding: 0.75rem 1rem; max-width: 70%;">
                        ${message}
                    </div>
                </div>
            `
    } else {
      messageDiv.innerHTML = `
                <div style="display: flex; justify-content: flex-start;">
                    <div style="background-color: #e9ecef; color: var(--text-primary); border-radius: 1rem; padding: 0.75rem 1rem; max-width: 70%;">
                        ${isLoading ? '<i class="fas fa-spinner fa-spin" style="margin-right: 0.5rem;"></i>' : '<i class="fas fa-robot" style="margin-right: 0.5rem;"></i>'}
                        ${message}
                    </div>
                </div>
            `
    }

    chatMessages.appendChild(messageDiv)
    chatMessages.scrollTop = chatMessages.scrollHeight
  }
}

// Export singleton instance
const appRouter = new PageRouter()
window.appRouter = appRouter // Global reference
