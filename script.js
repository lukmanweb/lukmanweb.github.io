/* ===========================
   LukmanWeb â€“ script.js
   =========================== */

'use strict';

// ---- Navbar Scroll ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNav();
});

// ---- Hamburger Menu ----
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// ---- Active Nav on Scroll ----
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY + 100;
  sections.forEach(sec => {
    const top = sec.offsetTop;
    const height = sec.offsetHeight;
    const id = sec.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      if (scrollY >= top && scrollY < top + height) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    }
  });
}

// ---- Scroll Reveal ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

function setupReveal() {
  const targets = document.querySelectorAll(
    '.layanan-card, .porto-item, .harga-card, .testi-card, .proses-item, .kontak-item, .kontak-form-card'
  );
  targets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
    revealObserver.observe(el);
  });
}
setupReveal();

// ---- Animated Counter ----
function animateCount(el, target, duration = 1800) {
  const isDecimal = String(target).includes('.');
  let start = 0;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = isDecimal
      ? current.toFixed(1)
      : Math.floor(current);
  }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counters = entry.target.querySelectorAll('[data-count]');
      counters.forEach(counter => {
        const val = parseFloat(counter.getAttribute('data-count'));
        animateCount(counter, val);
        // Add suffix
        counter.dataset.suffix = counter.closest('.stat-item')
          .querySelector('.stat-label').textContent;
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// Append + suffix after count
document.querySelectorAll('.stat-num').forEach(el => {
  const label = el.closest('.stat-item')?.querySelector('.stat-label')?.textContent || '';
  const hasCount = el.hasAttribute('data-count');
  if (hasCount && (label.includes('Website') || label.includes('Klien'))) {
    const origCount = parseFloat(el.dataset.count);
    setTimeout(() => {
      el.textContent = origCount + '+';
    }, 1850);
  }
  if (label.includes('Jam') && hasCount) {
    setTimeout(() => {
      el.textContent = '24/7';
    }, 1850);
  }
});

// ---- Portfolio Filter ----
const filterBtns = document.querySelectorAll('.filter-btn');
const portoItems = document.querySelectorAll('.porto-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    portoItems.forEach(item => {
      if (filter === 'all' || item.dataset.cat === filter) {
        item.classList.remove('hidden');
        item.style.animation = 'fadeInUp 0.4s ease';
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

// ---- Contact Form -> WhatsApp ----
const kontakForm = document.getElementById('kontakForm');
if (kontakForm) {
  kontakForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const nama = document.getElementById('nama').value.trim();
    const hp = document.getElementById('hp').value.trim();
    const jenis = document.getElementById('jenis').value;
    const pesan = document.getElementById('pesan').value.trim();

    if (!nama || !hp || !jenis) {
      alert('Mohon lengkapi nama, nomor HP, dan jenis website!');
      return;
    }

    const text = encodeURIComponent(
      `Halo LukmanWeb! ðŸ‘‹\n\n` +
      `Nama: ${nama}\n` +
      `No. HP: ${hp}\n` +
      `Jenis Website: ${jenis}\n` +
      `${pesan ? `Kebutuhan: ${pesan}\n` : ''}` +
      `\nSaya ingin konsultasi pembuatan website. Terima kasih!`
    );
    window.open(`https://wa.me/6285712225565?text=${text}`, '_blank');
  });
}

// ---- Smooth Scroll for Nav Links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  });
});

// ---- Floating WA Bounce ----
const floatingWa = document.getElementById('floating-wa');
let waVisible = false;
window.addEventListener('scroll', () => {
  if (window.scrollY > 300 && !waVisible) {
    floatingWa.style.transform = 'scale(1)';
    floatingWa.style.opacity = '1';
    waVisible = true;
  } else if (window.scrollY <= 300 && waVisible) {
    floatingWa.style.transform = 'scale(0.8)';
    waVisible = false;
  }
});

// ---- Tilt effect on cards (subtle) ----
document.querySelectorAll('.layanan-card, .harga-card, .porto-item').forEach(card => {
  card.addEventListener('mousemove', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const dx = (x - cx) / cx;
    const dy = (y - cy) / cy;
    this.style.transform = `translateY(-6px) rotateX(${-dy * 4}deg) rotateY(${dx * 4}deg)`;
    this.style.transition = 'transform 0.1s ease';
  });
  card.addEventListener('mouseleave', function() {
    this.style.transform = '';
    this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
  });
});

// ---- Typing effect on hero title ----
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});

// ---- Scroll to top when navbar logo clicked ----
document.querySelector('.nav-logo')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

console.log('%c🚀 LukmanWeb', 'color: #c41220; font-size: 18px; font-weight: bold;');
console.log('%cJasa Pembuatan Website Profesional | WA: 085712225565', 'color: #6b3a3d; font-size: 12px;');

// ---- Meta Pixel Event Tracking for Meta Ads ----
document.querySelectorAll('a[href*="wa.me"]').forEach(btn => {
  btn.addEventListener('click', () => {
    if (typeof fbq === 'function') {
      fbq('track', 'Lead', { content_name: 'WhatsApp Contact' });
    }
  });
});

// ---- Auto Slider System ----
class AutoSlider {
  constructor(containerId, itemWidth = 344, interval = 3000) {
    this.container = document.getElementById(containerId);
    this.itemWidth = itemWidth;
    this.interval = interval;
    this.timer = null;
    this.isPaused = false;

    if (!this.container) return;
    this._bindEvents();
    this._start();
  }

  _start() {
    this.timer = setInterval(() => {
      if (this.isPaused) return;
      this._scrollNext();
    }, this.interval);
  }

  _scrollNext() {
    const el = this.container;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (el.scrollLeft >= maxScroll - 10) {
      // Loop back to start smoothly
      el.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      el.scrollBy({ left: this.itemWidth, behavior: 'smooth' });
    }
  }

  _scrollPrev() {
    const el = this.container;
    if (el.scrollLeft <= 10) {
      // Jump to end
      el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' });
    } else {
      el.scrollBy({ left: -this.itemWidth, behavior: 'smooth' });
    }
  }

  _bindEvents() {
    // Pause on hover
    this.container.addEventListener('mouseenter', () => { this.isPaused = true; });
    this.container.addEventListener('mouseleave', () => { this.isPaused = false; });
    // Pause on touch
    this.container.addEventListener('touchstart', () => { this.isPaused = true; }, { passive: true });
    this.container.addEventListener('touchend', () => {
      setTimeout(() => { this.isPaused = false; }, 2000);
    });
  }

  slide(direction) {
    this.isPaused = true;
    if (direction === 'right') this._scrollNext();
    else this._scrollPrev();
    // Resume after 4 seconds of manual interaction
    clearTimeout(this._resumeTimer);
    this._resumeTimer = setTimeout(() => { this.isPaused = false; }, 4000);
  }
}

// Auto slider dinonaktifkan — Layanan & Portofolio ditampilkan sebagai grid penuh di halaman
// const layananSlider = new AutoSlider('layananGrid', 344, 1800);
// const portoSlider   = new AutoSlider('portoGrid',   364, 2000);

// Manual button helper (tidak digunakan lagi)
function slideContainer(containerId, direction) {
  // Slider dinonaktifkan
}
