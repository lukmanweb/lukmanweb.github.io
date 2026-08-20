/* =========================================================
   LukmanWeb — script.js
   Interactive Futuristic Features, Cost Estimator,
   Micro-animations, Sliders, WhatsApp Integration
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCounters();
  initScrollReveal();
  initEstimator();
  initBackToTop();
  initContactForm();
});

/* ── 1. NAVBAR & MOBILE DRAWER ── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('mobile-open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('mobile-open');
      });
    });
  }
}

/* ── 2. STATS NUMBER COUNTER ── */
function initCounters() {
  const statNums = document.querySelectorAll('.stat-num[data-count]');
  if (!statNums.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '+';
        let count = 0;
        const duration = 1800;
        const stepTime = Math.abs(Math.floor(duration / (target || 1)));

        const timer = setInterval(() => {
          count++;
          el.innerText = `${prefix}${count}${suffix}`;
          if (count >= target) {
            el.innerText = `${prefix}${target}${suffix}`;
            clearInterval(timer);
          }
        }, Math.max(stepTime, 20));

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => observer.observe(el));
}

/* ── 3. SCROLL REVEAL ANIMATIONS ── */
function initScrollReveal() {
  const elementsToReveal = document.querySelectorAll(
    '.section-header, .layanan-card, .porto-item, .harga-card, .proses-item, .testi-card, .calc-box, .kontak-grid, .prov-card'
  );

  elementsToReveal.forEach(el => {
    el.classList.add('reveal-init');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  elementsToReveal.forEach(el => observer.observe(el));
}

/* ── 4. HORIZONTAL SLIDER CONTROLS ── */
window.slideContainer = function(containerId, direction) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const scrollAmount = 380;
  if (direction === 'left') {
    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  } else {
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }
};

/* ── 5. INTERACTIVE PROJECT ESTIMATOR (CALCULATOR) ── */
function initEstimator() {
  const typeChips = document.querySelectorAll('[data-calc-type]');
  const featureChips = document.querySelectorAll('[data-calc-feature]');
  const priceDisplay = document.getElementById('calcEstPrice');
  const timeDisplay = document.getElementById('calcEstTime');
  const orderBtn = document.getElementById('calcOrderBtn');

  if (!priceDisplay || !orderBtn) return;

  function calculate() {
    let basePrice = 500000;
    let baseDays = 1;
    let selectedType = 'Landing Page';
    const selectedFeatures = [];

    // Check selected type
    typeChips.forEach(chip => {
      if (chip.classList.contains('active')) {
        basePrice = parseInt(chip.dataset.price, 10);
        baseDays = parseInt(chip.dataset.days, 10);
        selectedType = chip.innerText;
      }
    });

    // Check extra features
    featureChips.forEach(chip => {
      if (chip.classList.contains('active')) {
        basePrice += parseInt(chip.dataset.price, 10);
        baseDays += parseInt(chip.dataset.days || 0, 10);
        selectedFeatures.push(chip.innerText);
      }
    });

    // Format IDR
    const formattedPrice = 'Rp ' + basePrice.toLocaleString('id-ID');
    priceDisplay.innerText = formattedPrice;
    timeDisplay.innerText = `⚡ Estimasi Pengerjaan: ${baseDays} - ${baseDays + 2} Hari Kerja`;

    // WhatsApp Message URL
    let waText = `Halo LukmanWeb, saya ingin estimasi pembuatan website:\n\n`;
    waText += `📌 *Tipe:* ${selectedType}\n`;
    if (selectedFeatures.length > 0) {
      waText += `✨ *Fitur Tambahan:* ${selectedFeatures.join(', ')}\n`;
    }
    waText += `💰 *Estimasi:* ${formattedPrice}\n\nMohon info detail dan konsultasinya ya Mas Lukman. Terima kasih!`;

    orderBtn.href = `https://wa.me/6285712225565?text=${encodeURIComponent(waText)}`;
  }

  // Type selection (single choice)
  typeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      typeChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      calculate();
    });
  });

  // Feature selection (multiple choice)
  featureChips.forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('active');
      calculate();
    });
  });

  calculate();
}

/* ── 6. BACK TO TOP BUTTON ── */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  }, { passive: true });
}

window.scrollToTop = function() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

/* ── 7. CONTACT FORM SUBMISSION TO WHATSAPP ── */
function initContactForm() {
  const form = document.getElementById('kontakForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nama = document.getElementById('nama').value.trim();
    const hp = document.getElementById('hp').value.trim();
    const jenis = document.getElementById('jenis').value;
    const pesan = document.getElementById('pesan').value.trim();

    let waText = `Halo LukmanWeb, saya ingin konsultasi pembuatan website:\n\n`;
    waText += `👤 *Nama:* ${nama}\n`;
    waText += `📱 *No. HP/WA:* ${hp}\n`;
    waText += `🌐 *Jenis Website:* ${jenis}\n`;
    if (pesan) {
      waText += `📝 *Catatan / Kebutuhan:* ${pesan}\n`;
    }
    waText += `\nMohon info dan penawarannya. Terima kasih!`;

    window.open(`https://wa.me/6285712225565?text=${encodeURIComponent(waText)}`, '_blank');
  });
}
