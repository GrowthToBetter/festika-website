/**
 * Navbar Handler - Menangani UI dan interaksi navbar
 */

class NavbarHandler {
  constructor() {
    this.navItems = [
      { id: "home", label: "Beranda", icon: "fa-home" },
      { id: "explorer", label: "Jelajahi", icon: "fa-map" },
      { id: "directory", label: "Direktori", icon: "fa-book" },
      { id: "ai-chat", label: "Chat AI", icon: "fa-robot" },
      { id: "about", label: "Tentang", icon: "fa-info-circle" },
    ]
  }

  /**
   * Render navbar
   */
  render() {
    const navbar = document.getElementById("navbar-container")

    const navHTML = `
            <div class="navbar-container">
                <a href="#" class="logo" data-page="home">
                    <i class="fas fa-utensils"></i>
                    <span>Cita Rasa</span>
                </a>
                
                <ul class="nav-menu">
                    ${this.navItems
                      .map(
                        (item) => `
                        <li class="nav-item">
                            <a href="#" data-page="${item.id}" class="nav-link">
                                <i class="fas ${item.icon}"></i>
                                ${item.label}
                            </a>
                        </li>
                    `,
                      )
                      .join("")}
                    <!-- Added Admin CTA button with distinct styling -->
                    <li class="nav-item">
                        <a href="pages/admin.html" class="nav-link admin-cta" style="background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%); color: white; padding: 0.5rem 1.25rem; border-radius: 2rem; font-weight: 600; box-shadow: 0 2px 8px rgba(217, 41, 41, 0.3); transition: all 0.3s;">
                            <i class="fas fa-user-shield"></i>
                            Admin
                        </a>
                    </li>
                </ul>

                <button class="hamburger" id="hamburger-btn">
                    <i class="fas fa-bars"></i>
                </button>
            </div>
        `

    navbar.innerHTML = navHTML
    this.attachEvents()
  }

  /**
   * Attach event listeners
   */
  attachEvents() {
    const hamburger = document.getElementById("hamburger-btn")
    const navMenu = document.querySelector(".nav-menu")
    const navLinks = document.querySelectorAll(".nav-link")

    // Toggle mobile menu
    hamburger.addEventListener("click", () => {
      navMenu.classList.toggle("active")
    })

    // Close menu on link click
    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        if (link.classList.contains("admin-cta")) {
          navMenu.classList.remove("active")
          // Allow default behavior - redirect to admin.html
          return
        }

        // For regular nav links, prevent default and use router
        e.preventDefault()
        navMenu.classList.remove("active")
        const page = link.dataset.page
        if (page) {
          window.appRouter.navigate(page)
        }
      })
    })

    // Logo click
    document.querySelector(".logo").addEventListener("click", (e) => {
      e.preventDefault()
      window.appRouter.navigate("home")
    })
  }

  /**
   * Set active nav item
   */
  setActive(pageId) {
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.classList.remove("active")
      if (link.dataset.page === pageId) {
        link.classList.add("active")
      }
    })
  }
}

// Export singleton instance
const navbarHandler = new NavbarHandler()
window.navbarHandler = navbarHandler // Global reference
