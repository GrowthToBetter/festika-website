/**
 * Admin Handler - Manages admin login and dashboard
 */

class AdminHandler {
  constructor() {
    this.isAuthenticated = false
    this.adminUsername = "admin"
    this.adminPassword = "admin"
    this.init()
  }

  init() {
    // Check if already logged in
    const savedAuth = localStorage.getItem("admin_auth")
    if (savedAuth) {
      const auth = JSON.parse(savedAuth)
      if (auth.isAuthenticated && auth.timestamp > Date.now() - 24 * 60 * 60 * 1000) {
        this.showDashboard(auth.username)
        return
      }
    }

    this.attachLoginEvents()
  }

  attachLoginEvents() {
    const loginForm = document.getElementById("login-form")
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => this.handleLogin(e))
    }
  }

  handleLogin(e) {
    e.preventDefault()

    const username = document.getElementById("username").value
    const password = document.getElementById("password").value
    const errorDiv = document.getElementById("login-error")
    const errorMessage = document.getElementById("error-message")

    // Validate credentials
    if (username === this.adminUsername && password === this.adminPassword) {
      // Save auth to localStorage
      const authData = {
        isAuthenticated: true,
        username: username,
        timestamp: Date.now(),
      }
      localStorage.setItem("admin_auth", JSON.stringify(authData))

      // Show dashboard
      this.showDashboard(username)
    } else {
      // Show error
      errorMessage.textContent = "Username atau password salah!"
      errorDiv.style.display = "flex"

      // Hide error after 3 seconds
      setTimeout(() => {
        errorDiv.style.display = "none"
      }, 3000)
    }
  }

  showDashboard(username) {
    this.isAuthenticated = true

    // Hide login screen
    document.getElementById("login-screen").style.display = "none"

    // Show dashboard
    document.getElementById("admin-dashboard").style.display = "flex"

    // Set username
    document.getElementById("admin-username").textContent = username

    // Attach dashboard events
    this.attachDashboardEvents()

    // Load default section
    this.loadSection("overview")
  }

  attachDashboardEvents() {
    // Navigation items
    const navItems = document.querySelectorAll(".nav-item[data-section]")
    navItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault()
        const section = item.dataset.section
        this.loadSection(section)

        // Update active state
        navItems.forEach((nav) => nav.classList.remove("active"))
        item.classList.add("active")
      })
    })

    // Logout button
    const logoutBtn = document.getElementById("logout-btn")
    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault()
        this.handleLogout()
      })
    }
  }

  loadSection(section) {
    const contentArea = document.getElementById("content-area")
    const sectionTitle = document.getElementById("section-title")

    switch (section) {
      case "overview":
        sectionTitle.textContent = "Dashboard Overview"
        contentArea.innerHTML = this.getOverviewContent()
        this.loadOverviewData()
        break
      case "foods":
        sectionTitle.textContent = "Manage Foods"
        contentArea.innerHTML = this.getFoodsContent()
        this.loadFoodsData()
        break
      case "regions":
        sectionTitle.textContent = "Manage Regions"
        contentArea.innerHTML = this.getRegionsContent()
        this.loadRegionsData()
        break
      case "analytics":
        sectionTitle.textContent = "Analytics Dashboard"
        contentArea.innerHTML = this.getAnalyticsContent()
        break
      default:
        contentArea.innerHTML = "<p>Section not found</p>"
    }
  }

  getOverviewContent() {
    return `
            <div class="stats-grid">
                <div class="stat-card">
                    <h3>Total Makanan</h3>
                    <div class="value">125</div>
                    <div class="change">
                        <i class="fas fa-arrow-up"></i> 12% dari bulan lalu
                    </div>
                </div>
                <div class="stat-card">
                    <h3>Total Daerah</h3>
                    <div class="value">31</div>
                    <div class="change">
                        <i class="fas fa-arrow-up"></i> 3 daerah baru
                    </div>
                </div>
                <div class="stat-card">
                    <h3>Rating Rata-rata</h3>
                    <div class="value">4.7</div>
                    <div class="change">
                        <i class="fas fa-arrow-up"></i> 0.3 poin naik
                    </div>
                </div>
                <div class="stat-card">
                    <h3>Kategori</h3>
                    <div class="value">Jawa</div>
                    <div class="change">
                        <i class="fas fa-tag"></i> Fokus regional
                    </div>
                </div>
            </div>

            <div class="data-table">
                <div class="table-header">
                    <h3>Makanan Terpopuler</h3>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Nama Makanan</th>
                            <th>Daerah</th>
                            <th>Rating</th>
                            <th>Views</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Rawon</td>
                            <td>Surabaya</td>
                            <td>⭐ 4.8</td>
                            <td>2,543</td>
                            <td><span class="badge badge-success">Active</span></td>
                        </tr>
                        <tr>
                            <td>Soto Lamongan</td>
                            <td>Lamongan</td>
                            <td>⭐ 4.7</td>
                            <td>1,987</td>
                            <td><span class="badge badge-success">Active</span></td>
                        </tr>
                        <tr>
                            <td>Bakso Malang</td>
                            <td>Malang</td>
                            <td>⭐ 4.9</td>
                            <td>3,214</td>
                            <td><span class="badge badge-success">Active</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `
  }

  getFoodsContent() {
    return `
            <div class="data-table">
                <div class="table-header">
                    <h3>Daftar Makanan</h3>
                    <button class="btn-add" onclick="adminHandler.showAddFoodForm()">
                        <i class="fas fa-plus"></i> Tambah Makanan
                    </button>
                </div>
                <div id="food-list">
                    <p style="text-align: center; padding: 2rem;"><i class="fas fa-spinner fa-spin"></i> Memuat data...</p>
                </div>
            </div>
        `
  }

  getRegionsContent() {
    return `
            <div class="data-table">
                <div class="table-header">
                    <h3>Daftar Daerah</h3>
                    <button class="btn-add" onclick="adminHandler.showAddRegionForm()">
                        <i class="fas fa-plus"></i> Tambah Daerah
                    </button>
                </div>
                <div id="region-list">
                    <p style="text-align: center; padding: 2rem;"><i class="fas fa-spinner fa-spin"></i> Memuat data...</p>
                </div>
            </div>
        `
  }

  getAnalyticsContent() {
    return `
            <div class="stats-grid">
                <div class="stat-card">
                    <h3>Total Views</h3>
                    <div class="value">45,231</div>
                    <div class="change">
                        <i class="fas fa-arrow-up"></i> 15% dari minggu lalu
                    </div>
                </div>
                <div class="stat-card">
                    <h3>Pencarian</h3>
                    <div class="value">12,543</div>
                    <div class="change">
                        <i class="fas fa-arrow-up"></i> 8% dari minggu lalu
                    </div>
                </div>
                <div class="stat-card">
                    <h3>Rating Diberikan</h3>
                    <div class="value">3,421</div>
                    <div class="change">
                        <i class="fas fa-arrow-up"></i> 12% dari minggu lalu
                    </div>
                </div>
                <div class="stat-card">
                    <h3>Favorit Disimpan</h3>
                    <div class="value">8,765</div>
                    <div class="change">
                        <i class="fas fa-arrow-up"></i> 20% dari minggu lalu
                    </div>
                </div>
            </div>

            <div class="data-table" style="margin-top: 2rem;">
                <div class="table-header">
                    <h3>Makanan Paling Banyak Dicari</h3>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Peringkat</th>
                            <th>Nama Makanan</th>
                            <th>Pencarian</th>
                            <th>Trend</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Bakso Malang</td>
                            <td>3,214</td>
                            <td><span class="change"><i class="fas fa-arrow-up"></i> 25%</span></td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Rawon</td>
                            <td>2,543</td>
                            <td><span class="change"><i class="fas fa-arrow-up"></i> 18%</span></td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td>Soto Lamongan</td>
                            <td>1,987</td>
                            <td><span class="change"><i class="fas fa-arrow-up"></i> 10%</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `
  }

  handleLogout() {
    // Clear localStorage
    localStorage.removeItem("admin_auth")

    // Reset state
    this.isAuthenticated = false

    // Reload page
    location.reload()
  }

  async loadOverviewData() {
    try {
      const regions = await window.ApiService.getRegions()
      const foods = await window.ApiService.searchFoods("")

      const totalRegions = regions.regions?.length || 0
      const totalFoods = foods.results?.length || 0
      const avgRating =
        totalFoods > 0 ? (foods.results.reduce((sum, f) => sum + (f.rating || 0), 0) / totalFoods).toFixed(1) : 0

      document.querySelector(".stats-grid").innerHTML = `
        <div class="stat-card">
          <h3>Total Makanan</h3>
          <div class="value">${totalFoods}</div>
          <div class="change">
            <i class="fas fa-database"></i> Data real-time
          </div>
        </div>
        <div class="stat-card">
          <h3>Total Daerah</h3>
          <div class="value">${totalRegions}</div>
          <div class="change">
            <i class="fas fa-map-marker-alt"></i> Jawa Timur
          </div>
        </div>
        <div class="stat-card">
          <h3>Rating Rata-rata</h3>
          <div class="value">${avgRating}</div>
          <div class="change">
            <i class="fas fa-star"></i> Dari semua makanan
          </div>
        </div>
        <div class="stat-card">
          <h3>Kategori</h3>
          <div class="value">Jawa</div>
          <div class="change">
            <i class="fas fa-tag"></i> Fokus regional
          </div>
        </div>
      `
    } catch (error) {
      console.error("[v0] Error loading overview data:", error)
    }
  }

  async loadFoodsData() {
    const foodList = document.getElementById("food-list")
    foodList.innerHTML =
      '<p style="text-align: center; padding: 2rem;"><i class="fas fa-spinner fa-spin"></i> Memuat data...</p>'

    try {
      const response = await window.ApiService.searchFoods("")
      const foods = response.results || []

      if (foods.length === 0) {
        foodList.innerHTML = '<p style="text-align: center; color: #666;">Tidak ada data makanan</p>'
        return
      }

      let tableHTML = `
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama Makanan</th>
              <th>Daerah</th>
              <th>Rating</th>
              <th>Bahan</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
      `

      foods.forEach((food) => {
        const ingredients = Array.isArray(food.ingredients)
          ? food.ingredients.slice(0, 3).join(", ") + (food.ingredients.length > 3 ? "..." : "")
          : "N/A"

        tableHTML += `
          <tr>
            <td>#${food.id}</td>
            <td>${food.name}</td>
            <td>${food.region || "N/A"}</td>
            <td>⭐ ${food.rating || 0}</td>
            <td>${ingredients}</td>
            <td>
              <button class="action-btn btn-edit" onclick="adminHandler.editFood(${food.id})">
                <i class="fas fa-edit"></i>
              </button>
              <button class="action-btn btn-delete" onclick="adminHandler.deleteFood(${food.id}, '${food.name}')">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        `
      })

      tableHTML += `
          </tbody>
        </table>
      `

      foodList.innerHTML = tableHTML
    } catch (error) {
      console.error("[v0] Error loading foods:", error)
      foodList.innerHTML = '<p style="text-align: center; color: #d92929;">Error loading data</p>'
    }
  }

  async loadRegionsData() {
    const regionList = document.getElementById("region-list")
    regionList.innerHTML =
      '<p style="text-align: center; padding: 2rem;"><i class="fas fa-spinner fa-spin"></i> Memuat data...</p>'

    try {
      const response = await window.ApiService.getRegions()
      const regions = response.regions || []

      if (regions.length === 0) {
        regionList.innerHTML = '<p style="text-align: center; color: #666;">Tidak ada data daerah</p>'
        return
      }

      let tableHTML = `
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama Daerah</th>
              <th>Kategori</th>
              <th>Emoji</th>
              <th>Deskripsi</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
      `

      regions.forEach((region) => {
        const desc = region.description
          ? region.description.length > 50
            ? region.description.substring(0, 50) + "..."
            : region.description
          : "N/A"

        tableHTML += `
          <tr>
            <td>#${region.id}</td>
            <td>${region.name}</td>
            <td>${region.category}</td>
            <td>${region.emoji || "📍"}</td>
            <td>${desc}</td>
            <td>
              <button class="action-btn btn-edit" onclick="adminHandler.editRegion(${region.id})">
                <i class="fas fa-edit"></i>
              </button>
              <button class="action-btn btn-delete" onclick="adminHandler.deleteRegion(${region.id}, '${region.name}')">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        `
      })

      tableHTML += `
          </tbody>
        </table>
      `

      regionList.innerHTML = tableHTML
    } catch (error) {
      console.error("[v0] Error loading regions:", error)
      regionList.innerHTML = '<p style="text-align: center; color: #d92929;">Error loading data</p>'
    }
  }

  async showAddFoodForm() {
    // Load regions first
    const regionsResponse = await window.ApiService.getRegions()
    const regions = regionsResponse.regions || []

    const regionOptions = regions.map((r) => `<option value="${r.id}">${r.name} (${r.category})</option>`).join("")

    const modal = document.createElement("div")
    modal.className = "modal-overlay"
    modal.innerHTML = `
      <div class="modal-content">
        <h3>Tambah Makanan Baru</h3>
        <form id="add-food-form">
          <input type="text" name="name" placeholder="Nama Makanan" required>
          <select name="region_id" required>
            <option value="">Pilih Daerah</option>
            ${regionOptions}
          </select>
          <textarea name="description" placeholder="Deskripsi" required rows="3"></textarea>
          <input type="text" name="ingredients" placeholder="Bahan-bahan (pisahkan dengan koma)" required>
          <input type="text" name="taste_profile" placeholder="Profil Rasa (pisahkan dengan koma)" required>
          <input type="number" name="rating" placeholder="Rating (0-5)" step="0.1" min="0" max="5" value="4.5" required>
          <input type="url" name="image_url" placeholder="URL Gambar (opsional)">
          <input type="number" name="preparation_time" placeholder="Waktu Persiapan (menit)" min="0">
          <select name="difficulty_level">
            <option value="mudah">Mudah</option>
            <option value="sedang" selected>Sedang</option>
            <option value="sulit">Sulit</option>
          </select>
          <div style="display: flex; gap: 1rem; margin-top: 1rem;">
            <button type="submit" class="btn-primary-custom" style="background: #d92929; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 4px; cursor: pointer;">
              <i class="fas fa-save"></i> Simpan
            </button>
            <button type="button" class="btn-secondary-custom" onclick="this.closest('.modal-overlay').remove()" style="background: #333; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 4px; cursor: pointer;">
              <i class="fas fa-times"></i> Batal
            </button>
          </div>
        </form>
      </div>
    `
    document.body.appendChild(modal)

    document.getElementById("add-food-form").addEventListener("submit", async (e) => {
      e.preventDefault()
      const formData = new FormData(e.target)
      const data = {
        name: formData.get("name"),
        region_id: Number.parseInt(formData.get("region_id")),
        description: formData.get("description"),
        ingredients: formData
          .get("ingredients")
          .split(",")
          .map((i) => i.trim()),
        taste_profile: formData
          .get("taste_profile")
          .split(",")
          .map((t) => t.trim()),
        rating: Number.parseFloat(formData.get("rating")),
        image_url: formData.get("image_url") || null,
        preparation_time: Number.parseInt(formData.get("preparation_time")) || null,
        difficulty_level: formData.get("difficulty_level"),
      }

      try {
        await window.ApiService.createFood(data)
        alert("Makanan berhasil ditambahkan!")
        modal.remove()
        this.loadFoodsData()
      } catch (error) {
        alert("Gagal menambahkan makanan: " + error.message)
      }
    })
  }

  showAddRegionForm() {
    const modal = document.createElement("div")
    modal.className = "modal-overlay"
    modal.innerHTML = `
      <div class="modal-content">
        <h3>Tambah Daerah Baru</h3>
        <form id="add-region-form">
          <input type="text" name="name" placeholder="Nama Daerah" required>
          <input type="text" name="category" placeholder="Kategori" value="Jawa" required>
          <input type="number" name="latitude" placeholder="Latitude" step="0.000001">
          <input type="number" name="longitude" placeholder="Longitude" step="0.000001">
          <textarea name="description" placeholder="Deskripsi" rows="3"></textarea>
          <input type="text" name="emoji" placeholder="Emoji" maxlength="10" value="📍">
          <div style="display: flex; gap: 1rem; margin-top: 1rem;">
            <button type="submit" class="btn-primary-custom" style="background: #d92929; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 4px; cursor: pointer;">
              <i class="fas fa-save"></i> Simpan
            </button>
            <button type="button" class="btn-secondary-custom" onclick="this.closest('.modal-overlay').remove()" style="background: #333; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 4px; cursor: pointer;">
              <i class="fas fa-times"></i> Batal
            </button>
          </div>
        </form>
      </div>
    `
    document.body.appendChild(modal)

    document.getElementById("add-region-form").addEventListener("submit", async (e) => {
      e.preventDefault()
      const formData = new FormData(e.target)
      const data = {
        name: formData.get("name"),
        category: formData.get("category"),
        latitude: Number.parseFloat(formData.get("latitude")) || null,
        longitude: Number.parseFloat(formData.get("longitude")) || null,
        description: formData.get("description"),
        emoji: formData.get("emoji") || "📍",
      }

      try {
        await window.ApiService.createRegion(data)
        alert("Daerah berhasil ditambahkan!")
        modal.remove()
        this.loadRegionsData()
      } catch (error) {
        alert("Gagal menambahkan daerah: " + error.message)
      }
    })
  }

  async deleteFood(foodId, foodName) {
    if (!confirm(`Hapus makanan "${foodName}"?`)) return

    try {
      await window.ApiService.deleteFood(foodId)
      alert("Makanan berhasil dihapus!")
      this.loadFoodsData()
    } catch (error) {
      alert("Gagal menghapus makanan: " + error.message)
    }
  }

  editFood(foodId) {
    alert("Fitur edit akan segera hadir. Food ID: " + foodId)
  }

  async deleteRegion(regionId, regionName) {
    if (!confirm(`Hapus daerah "${regionName}"? Ini akan menghapus semua makanan dari daerah ini.`)) return

    try {
      await window.ApiService.deleteRegion(regionId)
      alert("Daerah berhasil dihapus!")
      this.loadRegionsData()
    } catch (error) {
      alert("Gagal menghapus daerah: " + error.message)
    }
  }

  editRegion(regionId) {
    alert("Fitur edit akan segera hadir. Region ID: " + regionId)
  }
}

// Initialize admin handler
const adminHandler = new AdminHandler()
