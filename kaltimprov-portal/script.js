/**
 * PORTAL KALTIM - OFFICIAL WEBSITE SCRIPT
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroTextAnimation();
  initNavbarScroll();
  initTabFilters();
  initSearchEngine();
  initModals();
});

/* --------------------------------------------------------------------------
   HERO TEXT WAVE ANIMATION
   -------------------------------------------------------------------------- */
function initHeroTextAnimation() {
  const animatedWord = document.querySelector('.animated-word');
  if (!animatedWord) return;

  const words = ['Publik', 'Masyarakat', 'Informasi', 'Transparan'];
  let wordIndex = 0;

  setInterval(() => {
    animatedWord.style.opacity = '0';
    animatedWord.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
      wordIndex = (wordIndex + 1) % words.length;
      animatedWord.textContent = words[wordIndex];
      animatedWord.style.opacity = '1';
      animatedWord.style.transform = 'translateY(0)';
    }, 300);
  }, 3000);
}

/* --------------------------------------------------------------------------
   NAVBAR STICKY EFFECT & MOBILE TOGGLE
   -------------------------------------------------------------------------- */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }
}

/* --------------------------------------------------------------------------
   NEWS TAB FILTERS
   -------------------------------------------------------------------------- */
function initTabFilters() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const newsCards = document.querySelectorAll('.news-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      newsCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   LIVE SEARCH ENGINE
   -------------------------------------------------------------------------- */
function initSearchEngine() {
  const searchInput = document.getElementById('heroSearchInput');
  const searchBtn = document.getElementById('heroSearchBtn');

  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', () => {
      performSearch(searchInput.value.trim());
    });

    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        performSearch(searchInput.value.trim());
      }
    });
  }
}

function performSearch(query) {
  if (!query || query.length < 2) {
    showToast('Ketik minimal 2 karakter untuk melakukan pencarian layanan/berita.');
    return;
  }

  const newsCards = document.querySelectorAll('.news-card');
  let matchCount = 0;

  newsCards.forEach(card => {
    const title = card.querySelector('.news-title').textContent.toLowerCase();
    const excerpt = card.querySelector('.news-excerpt').textContent.toLowerCase();

    if (title.includes(query.toLowerCase()) || excerpt.includes(query.toLowerCase())) {
      card.style.display = 'block';
      matchCount++;
    } else {
      card.style.display = 'none';
    }
  });

  // Scroll to news section
  const mediaSection = document.getElementById('berita');
  if (mediaSection) {
    mediaSection.scrollIntoView({ behavior: 'smooth' });
  }

  showToast(`Ditemukan ${matchCount} hasil pencarian untuk "${query}"`);
}

/* --------------------------------------------------------------------------
   MODAL POPUP DIALOGS
   -------------------------------------------------------------------------- */
function initModals() {
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');

  if (modalClose && modalOverlay) {
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }
}

function openModal(title, bodyHtml) {
  const modalOverlay = document.getElementById('modalOverlay');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');

  if (modalOverlay && modalTitle && modalBody) {
    modalTitle.textContent = title;
    modalBody.innerHTML = bodyHtml;
    modalOverlay.classList.add('active');
  }
}

function closeModal() {
  const modalOverlay = document.getElementById('modalOverlay');
  if (modalOverlay) {
    modalOverlay.classList.remove('active');
  }
}

/* --------------------------------------------------------------------------
   SERVICE CARD CLICK HANDLER
   -------------------------------------------------------------------------- */
function openServiceDetail(serviceName, desc, url) {
  const content = `
    <div style="text-align: center; padding: 10px;">
      <i class="bi bi-box-arrow-up-right" style="font-size: 3rem; color: var(--primary-color);"></i>
      <h4 style="margin-top: 15px; font-size: 1.2rem;">${serviceName}</h4>
      <p style="color: var(--text-muted); margin: 15px 0 25px;">${desc}</p>
      <div style="display: flex; justify-content: center; gap: 12px;">
        <a href="${url}" target="_blank" class="search-btn" style="text-decoration: none;">
          Buka Layanan Resmi <i class="bi bi-arrow-right"></i>
        </a>
        <button onclick="closeModal()" style="padding: 10px 20px; border: 1px solid #ccc; background: #fff; border-radius: 30px; cursor: pointer;">Tutup</button>
      </div>
    </div>
  `;
  openModal(`Layanan Layanan Publik: ${serviceName}`, content);
}

/* --------------------------------------------------------------------------
   NEWS DETAIL POPUP HANDLER
   -------------------------------------------------------------------------- */
function openNewsDetail(title, category, date, contentText, imgUrl) {
  const body = `
    <div>
      <img src="${imgUrl}" alt="${title}" style="width: 100%; height: 240px; object-fit: cover; border-radius: 12px; margin-bottom: 16px;" />
      <div style="display: flex; gap: 15px; font-size: 0.82rem; color: var(--text-muted); margin-bottom: 12px;">
        <span><i class="bi bi-folder-fill" style="color: var(--primary-color)"></i> ${category}</span>
        <span><i class="bi bi-calendar-event"></i> ${date}</span>
        <span><i class="bi bi-eye"></i> Dibaca: 1.420 kali</span>
      </div>
      <h3 style="font-size: 1.3rem; margin-bottom: 16px; color: var(--text-dark);">${title}</h3>
      <p style="line-height: 1.7; color: #334155; font-size: 0.95rem;">${contentText}</p>
      <p style="line-height: 1.7; color: #334155; font-size: 0.95rem; margin-top: 12px;">
        Pemerintah Provinsi Kalimantan Timur terus berkomitmen untuk memberikan informasi yang transparan dan akuntabel demi kemajuan seluruh masyarakat Kaltim menuju era Indonesia Emas dan suksesnya pembangunan IKN Nusantara.
      </p>
    </div>
  `;
  openModal('Detail Berita - Media Center Kaltim', body);
}

/* --------------------------------------------------------------------------
   TOAST NOTIFICATION HELPER
   -------------------------------------------------------------------------- */
function showToast(message) {
  let toast = document.getElementById('toastMsg');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastMsg';
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="bi bi-info-circle-fill" style="color: var(--accent-gold); font-size: 1.2rem;"></i> <span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

/* Accessibility speech simulator */
function textSpeech(element) {
  // Silent hover helper for accessibility feature simulation
}
