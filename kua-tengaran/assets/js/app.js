
// KUA Kecamatan Tengaran - Modern Gov Portal JS
document.addEventListener('DOMContentLoaded', async () => {
  
// ENFORCE LIGHT MODE ONLY - Client requirement
document.documentElement.classList.remove('dark');

  let kuaData = null;
  
  try {
    const res = await fetch('data/kua_data.json');
    kuaData = await res.json();
  } catch (err) {
    console.error('Failed to load kua_data.json:', err);
  }

  if (window.lucide) {
    lucide.createIcons();
  }

  initThemeAndFont();
  initOfficeStatus();
  initPrayerTimes();

  if (kuaData) {
    renderServices(kuaData.services);
    renderEmployees(kuaData.employees);
    renderPosts(kuaData.posts);
    renderFaqs(kuaData.faqs);
    
    setupServiceFilters(kuaData.services);
    setupEmployeeFilters(kuaData.employees);
    setupPostFilters(kuaData.posts);
    setupChecklistSimulator();
    setupFaqSearch(kuaData.faqs);
  }
});

function initThemeAndFont() {
  // Enforce pure Light Mode
  document.documentElement.classList.remove('dark');
  localStorage.setItem('kua_theme', 'light');

  const fontSmall = document.getElementById('font-sm');
  const fontBase = document.getElementById('font-base');
  const fontLarge = document.getElementById('font-lg');

  function setFontSize(size) {
    document.documentElement.classList.remove('text-size-sm', 'text-size-base', 'text-size-lg', 'text-size-xl');
    document.documentElement.classList.add('text-size-' + size);
    localStorage.setItem('kua_fontsize', size);
    
    [fontSmall, fontBase, fontLarge].forEach(btn => {
      if (btn) btn.classList.remove('bg-emerald-700', 'text-white');
    });
    const activeBtn = size === 'sm' ? fontSmall : (size === 'lg' ? fontLarge : fontBase);
    if (activeBtn) activeBtn.classList.add('bg-emerald-700', 'text-white');
  }

  const savedFontSize = localStorage.getItem('kua_fontsize') || 'base';
  setFontSize(savedFontSize);

  if (fontSmall) fontSmall.addEventListener('click', () => setFontSize('sm'));
  if (fontBase) fontBase.addEventListener('click', () => setFontSize('base'));
  if (fontLarge) fontLarge.addEventListener('click', () => setFontSize('lg'));

  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}

function initOfficeStatus() {
  const statusBadge = document.getElementById('office-status-badge');
  const statusText = document.getElementById('office-status-text');
  const currentTimeEl = document.getElementById('current-local-time');

  function updateStatus() {
    const now = new Date();
    const options = { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    const dateOptions = { timeZone: 'Asia/Jakarta', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    
    const timeString = now.toLocaleTimeString('id-ID', options);
    const dateString = now.toLocaleDateString('id-ID', dateOptions);

    if (currentTimeEl) {
      currentTimeEl.textContent = `${dateString} • ${timeString} WIB`;
    }

    const day = now.getDay();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const totalMinutes = hour * 60 + minute;

    let isOpen = false;
    let message = 'TUTUP (Buka Senin 07.30 WIB)';

    if (day >= 1 && day <= 4) {
      if (totalMinutes >= 450 && totalMinutes <= 960) {
        isOpen = true;
        message = 'BUKA • Pelayanan s/d 16.00 WIB';
      } else if (totalMinutes < 450) {
        message = 'TUTUP • Buka Pukul 07.30 WIB';
      } else {
        message = 'TUTUP • Buka Besok 07.30 WIB';
      }
    } else if (day === 5) {
      if (totalMinutes >= 450 && totalMinutes <= 990) {
        if (totalMinutes >= 690 && totalMinutes <= 780) {
          message = 'ISTIRAHAT JUMAT • Buka 13.00 WIB';
          isOpen = false;
        } else {
          isOpen = true;
          message = 'BUKA • Pelayanan s/d 16.30 WIB';
        }
      } else if (totalMinutes < 450) {
        message = 'TUTUP • Buka Pukul 07.30 WIB';
      } else {
        message = 'TUTUP • Buka Senin 07.30 WIB';
      }
    } else {
      message = 'TUTUP (Pelayanan Kantor Tutup, Buka Senin)';
      isOpen = false;
    }

    if (statusBadge && statusText) {
      if (isOpen) {
        statusBadge.className = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700';
        statusText.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block mr-1"></span> ${message}`;
      } else {
        statusBadge.className = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-700';
        statusText.innerHTML = `<span class="w-2 h-2 rounded-full bg-amber-500 inline-block mr-1"></span> ${message}`;
      }
    }
  }

  updateStatus();
  setInterval(updateStatus, 1000);
}

function initPrayerTimes() {
  const container = document.getElementById('prayer-times-widget');
  if (!container) return;

  const defaultTimes = {
    Subuh: '04:26',
    Dzuhur: '11:45',
    Ashar: '15:03',
    Maghrib: '17:44',
    Isya: '18:54'
  };

  function renderTimes(times) {
    const list = [
      { name: 'Subuh', time: times.Subuh || '04:26' },
      { name: 'Dzuhur', time: times.Dzuhur || '11:45' },
      { name: 'Ashar', time: times.Ashar || '15:03' },
      { name: 'Maghrib', time: times.Maghrib || '17:44' },
      { name: 'Isya', time: times.Isya || '18:54' }
    ];

    container.innerHTML = list.map(item => `
      <div class="flex flex-col items-center justify-center p-2 rounded-xl bg-white/70 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-800/40 backdrop-blur-sm text-center">
        <span class="text-[10px] font-semibold text-emerald-800 dark:text-emerald-300">${item.name}</span>
        <span class="text-xs md:text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5">${item.time}</span>
      </div>
    `).join('');
  }

  renderTimes(defaultTimes);

  const today = new Date();
  const dateStr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
  fetch(`https://api.aladhan.com/v1/timings/${dateStr}?latitude=-7.4258&longitude=110.5186&method=11`)
    .then(r => r.json())
    .then(data => {
      if (data && data.data && data.data.timings) {
        const t = data.data.timings;
        renderTimes({
          Subuh: t.Fajr,
          Dzuhur: t.Dhuhr,
          Ashar: t.Asr,
          Maghrib: t.Maghrib,
          Isya: t.Isha
        });
      }
    })
    .catch(() => {});
}

function renderServices(services) {
  const container = document.getElementById('services-grid');
  if (!container) return;

  container.innerHTML = services.map(srv => `
    <div class="service-card group bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-emerald-500 dark:hover:border-emerald-500 flex flex-col justify-between" data-category="${srv.category}">
      <div>
        <div class="flex items-start justify-between gap-3 mb-4">
          <div class="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center border border-emerald-200/60 dark:border-emerald-800/60 group-hover:bg-emerald-600 group-hover:text-white transition-all">
            <i data-lucide="${srv.icon || 'file-text'}" class="w-6 h-6"></i>
          </div>
          <span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            ${srv.badge || 'Resmi Kemenag'}
          </span>
        </div>
        
        <h3 class="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors mb-2">
          ${srv.title}
        </h3>
        
        <p class="text-xs md:text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-4 leading-relaxed">
          ${srv.desc}
        </p>
      </div>

      <div class="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        <div class="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
          ${srv.cost}
        </div>
        <button onclick="openServiceModal('${srv.id}')" class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
          <span>Detail & Syarat</span>
          <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
        </button>
      </div>
    </div>
  `).join('');

  if (window.lucide) lucide.createIcons();
}

function setupServiceFilters(services) {
  const buttons = document.querySelectorAll('.service-filter-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => {
        b.classList.remove('bg-emerald-700', 'text-white', 'shadow-md');
        b.classList.add('bg-white', 'text-slate-700', 'dark:bg-slate-800', 'dark:text-slate-300');
      });
      btn.classList.add('bg-emerald-700', 'text-white', 'shadow-md');
      btn.classList.remove('bg-white', 'text-slate-700', 'dark:bg-slate-800', 'dark:text-slate-300');

      const filter = btn.getAttribute('data-filter');
      const filtered = filter === 'all' ? services : services.filter(s => s.category === filter);
      renderServices(filtered);
    });
  });
}

window.openServiceModal = function(id) {
  fetch('data/kua_data.json')
    .then(r => r.json())
    .then(data => {
      const srv = data.services.find(s => s.id === id);
      if (!srv) return;

      const modal = document.getElementById('service-modal');
      const content = document.getElementById('service-modal-content');

      content.innerHTML = `
        <div class="p-6 md:p-8 space-y-6 max-h-[85vh] overflow-y-auto">
          <div class="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div class="flex items-center gap-3.5">
              <div class="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center">
                <i data-lucide="${srv.icon || 'file-text'}" class="w-6 h-6"></i>
              </div>
              <div>
                <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  ${srv.badge || 'Layanan Resmi'}
                </span>
                <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-1">${srv.title}</h2>
              </div>
            </div>
            <button onclick="closeServiceModal()" class="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
            <div>
              <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">Biaya / Tarif PNBP:</span>
              <p class="text-sm font-bold text-emerald-700 dark:text-emerald-400">${srv.cost}</p>
            </div>
            <div>
              <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">Estimasi Waktu:</span>
              <p class="text-sm font-semibold text-slate-800 dark:text-slate-200">${srv.time}</p>
            </div>
          </div>

          <div>
            <h4 class="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <i data-lucide="check-square" class="w-4 h-4 text-emerald-600"></i> Persyaratan Berkas
            </h4>
            <ul class="space-y-2.5 text-xs md:text-sm text-slate-700 dark:text-slate-300">
              ${srv.requirements.map(req => `
                <li class="flex items-start gap-2.5">
                  <i data-lucide="check" class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5"></i>
                  <span>${req}</span>
                </li>
              `).join('')}
            </ul>
          </div>

          <div>
            <h4 class="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <i data-lucide="git-commit" class="w-4 h-4 text-emerald-600"></i> Alur & Prosedur Pelayanan
            </h4>
            <div class="space-y-3 relative pl-4 border-l-2 border-emerald-500/40 text-xs md:text-sm text-slate-700 dark:text-slate-300">
              ${srv.flow.map((step, idx) => `
                <div class="relative">
                  <span class="absolute -left-[23px] top-0 w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center ring-4 ring-white dark:ring-slate-900">
                    ${idx + 1}
                  </span>
                  <p class="pl-2">${step}</p>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-3 items-center justify-between">
            <a href="https://wa.me/6281234567890?text=Halo%20KUA%20Tengaran,%20saya%20ingin%20berkonsultasi%20mengenai%20${encodeURIComponent(srv.title)}" target="_blank" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 text-white text-xs md:text-sm font-bold hover:bg-emerald-800 shadow-md shadow-emerald-700/20 transition-all">
              <i data-lucide="message-circle" class="w-4 h-4"></i>
              <span>Konsultasi Layanan Ini via WhatsApp</span>
            </a>
            <button onclick="window.print()" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-700">
              <i data-lucide="printer" class="w-4 h-4"></i>
              <span>Cetak Panduan</span>
            </button>
          </div>
        </div>
      `;

      modal.classList.remove('hidden');
      modal.classList.add('flex');
      if (window.lucide) lucide.createIcons();
    });
};

window.closeServiceModal = function() {
  const modal = document.getElementById('service-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

function renderEmployees(employees) {
  const container = document.getElementById('employees-grid');
  if (!container) return;

  container.innerHTML = employees.map(emp => `
    <div class="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-emerald-500 flex flex-col justify-between transition-all" data-category="${emp.category}">
      <div>
        <div class="flex items-center gap-4 mb-4">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-emerald-800/20">
            ${emp.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <span class="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              ${emp.badge}
            </span>
            <h4 class="text-sm md:text-base font-bold text-slate-900 dark:text-white mt-1">${emp.name}</h4>
            <p class="text-xs text-emerald-700 dark:text-emerald-400 font-medium">${emp.role}</p>
          </div>
        </div>
        <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          ${emp.desc}
        </p>
      </div>
      <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <span>KUA Kec. Tengaran</span>
        <span class="font-mono">Kemenag RI</span>
      </div>
    </div>
  `).join('');
}

function setupEmployeeFilters(employees) {
  const buttons = document.querySelectorAll('.employee-filter-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => {
        b.classList.remove('bg-emerald-700', 'text-white');
        b.classList.add('bg-white', 'text-slate-700', 'dark:bg-slate-800', 'dark:text-slate-300');
      });
      btn.classList.add('bg-emerald-700', 'text-white');
      btn.classList.remove('bg-white', 'text-slate-700', 'dark:bg-slate-800', 'dark:text-slate-300');

      const filter = btn.getAttribute('data-filter');
      const filtered = filter === 'all' ? employees : employees.filter(e => e.category === filter);
      renderEmployees(filtered);
    });
  });
}

function renderPosts(posts) {
  const container = document.getElementById('posts-grid');
  if (!container) return;

  container.innerHTML = posts.map(post => `
    <article class="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-emerald-500 flex flex-col justify-between transition-all">
      <div>
        <div class="aspect-video w-full overflow-hidden relative bg-slate-100 dark:bg-slate-800">
          <img src="${post.image}" alt="${post.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onerror="this.src='https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=600&auto=format&fit=crop&q=80'">
          <span class="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-700/90 text-white backdrop-blur-md">
            ${post.category}
          </span>
        </div>
        <div class="p-5">
          <div class="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span>${post.published}</span>
            <span>•</span>
            <span>${post.readTime || '3 Menit Baca'}</span>
          </div>
          <h3 class="text-sm md:text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 mb-2">
            ${post.title}
          </h3>
          <p class="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
            ${post.excerpt}
          </p>
        </div>
      </div>
      <div class="p-5 pt-0">
        <button onclick="openPostModal('${post.id}')" class="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-700 hover:text-white dark:hover:bg-emerald-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-all flex items-center justify-center gap-1.5">
          <span>Baca Selengkapnya</span>
          <i data-lucide="chevron-right" class="w-4 h-4"></i>
        </button>
      </div>
    </article>
  `).join('');

  if (window.lucide) lucide.createIcons();
}

function setupPostFilters(posts) {
  const searchInput = document.getElementById('post-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      const filtered = posts.filter(p => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
      renderPosts(filtered);
    });
  }
}

window.openPostModal = function(id) {
  fetch('data/kua_data.json')
    .then(r => r.json())
    .then(data => {
      const post = data.posts.find(p => p.id === id);
      if (!post) return;

      const modal = document.getElementById('post-modal');
      const content = document.getElementById('post-modal-content');

      content.innerHTML = `
        <div class="max-h-[85vh] overflow-y-auto">
          <div class="relative h-56 md:h-72 w-full overflow-hidden bg-slate-900">
            <img src="${post.image}" alt="${post.title}" class="w-full h-full object-cover opacity-80">
            <button onclick="closePostModal()" class="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
            <div class="absolute bottom-4 left-4 right-4 text-white">
              <span class="px-2.5 py-1 rounded-md bg-emerald-600 text-xs font-bold uppercase tracking-wider mb-2 inline-block">
                ${post.category}
              </span>
              <h2 class="text-lg md:text-xl font-bold leading-tight">${post.title}</h2>
              <div class="flex items-center gap-3 text-xs text-slate-300 mt-2">
                <span>Oleh: ${post.author || 'KUA Tengaran'}</span>
                <span>•</span>
                <span>${post.published}</span>
              </div>
            </div>
          </div>

          <div class="p-6 md:p-8 space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-xs md:text-sm">
            <div class="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border-l-4 border-emerald-600 text-emerald-900 dark:text-emerald-200 text-xs md:text-sm italic font-medium">
              ${post.excerpt}
            </div>
            
            <p>${post.content}</p>
            <p>Untuk informasi lebih detail mengenai layanan terkait atau konsultasi lanjutan, silakan kunjungi Kantor Urusan Agama (KUA) Kecamatan Tengaran di Jl. Masjid Besar No.13 Tengaran pada jam pelayanan kantor, atau hubungi saluran informasi resmi kami.</p>

            <div class="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-4">
              <span class="text-xs text-slate-400">Bagikan artikel ini:</span>
              <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + ' ' + window.location.href)}" target="_blank" class="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 flex items-center gap-1.5">
                <i data-lucide="share-2" class="w-3.5 h-3.5"></i> Bagikan ke WhatsApp
              </a>
            </div>
          </div>
        </div>
      `;

      modal.classList.remove('hidden');
      modal.classList.add('flex');
      if (window.lucide) lucide.createIcons();
    });
};

window.closePostModal = function() {
  const modal = document.getElementById('post-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

function setupChecklistSimulator() {
  const form = document.getElementById('checklist-form');
  const resultArea = document.getElementById('checklist-result');
  if (!form || !resultArea) return;

  function updateChecklist() {
    const isWna = form.elements['catin_type'].value === 'wna';
    const location = form.elements['location'].value;
    const domicile = form.elements['domicile'].value;
    const age = form.elements['age_status'].value;
    const maritalStatus = form.elements['marital_status'].value;
    const job = form.elements['job_status'].value;

    let docs = [];
    let pnbpCost = location === 'kua' ? 'Rp 0,- (GRATIS di Balai KUA)' : 'Rp 600.000,- (Disetor ke Kas Negara via SIMPONI)';
    let notes = [];

    if (!isWna) {
      docs.push('Surat Pengantar Nikah dari Kantor Desa / Kelurahan asal calon pengantin (Form Model N1 & N2).');
      docs.push('Surat Persetujuan Calon Pengantin (Form Model N4).');
      docs.push('Fotokopi KTP dan Kartu Keluarga (KK) calon suami, calon istri, dan kedua orang tua.');
      docs.push('Fotokopi Akta Kelahiran dan Ijazah Terakhir kedua calon mempelai.');
      docs.push('Surat Keterangan Sehat dari Puskesmas / Faskes & Sertifikat ELSIMIL (BKKBN).');
      docs.push('Pasfoto berlatar belakang biru ukuran 2x3 (4 lembar) dan 4x6 (2 lembar).');
    } else {
      docs.push('Certificate of No Impediment (CNI) dari Kedutaan Besar / Kantor Perwakilan negara asal WNA di Indonesia.');
      docs.push('Sertifikat Apostille bagi dokumen dari negara yang memberlakukan apostille.');
      docs.push('Fotokopi Paspor, Visa tinggal / KITAS / KITAP yang masih berlaku.');
      docs.push('Akta Kelahiran resmi yang telah diterjemahkan oleh Penerjemah Tersumpah ke Bhs. Indonesia.');
      docs.push('Surat Keterangan Masuk Islam (Mualaf) jika sebelumnya non-muslim.');
      docs.push('Pasfoto background biru 2x3 (4 lembar) dan 4x6 (2 lembar).');
    }

    if (age === 'under21') {
      docs.push('Surat Izin Orang Tua / Wali (Form Model N5) karena calon mempelai berusia di bawah 21 tahun.');
    } else if (age === 'under19') {
      docs.push('Surat Penetapan Dispensasi Kawin dari Pengadilan Agama (Wajib bagi yang belum berusia 19 tahun).');
      docs.push('Surat Izin Orang Tua / Wali (Form Model N5).');
      notes.push('⚠️ Sesuai UU No. 16/2019, batas usia nikah minimal 19 tahun. Calon mempelai di bawah 19 th wajib mengantongi izin dari Pengadilan Agama.');
    }

    if (domicile === 'luar') {
      docs.push('Surat Rekomendasi Nikah (Form Model N10) dari KUA kecamatan tempat tinggal asal calon pengantin.');
    }

    if (maritalStatus === 'cerai_hidup') {
      docs.push('Akta Cerai Asli yang diterbitkan oleh Pengadilan Agama.');
    } else if (maritalStatus === 'cerai_mati') {
      docs.push('Surat Keterangan Kematian (Akta Kematian) dari Kantor Desa/Kelurahan atau Disdukcapil (Model N6).');
    }

    if (job === 'tni_polri') {
      docs.push('Surat Izin Menikah Resmi dari Atasan / Komandan Kesatuan dinas aktif.');
    }

    resultArea.innerHTML = `
      <div id="print-checklist-area" class="p-5 md:p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-emerald-500/30 space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h4 class="text-sm md:text-base font-bold text-slate-900 dark:text-white">Hasil Simulasi Persyaratan Berkas Nikah</h4>
            <p class="text-xs text-emerald-700 dark:text-emerald-400 font-medium">KUA Kecamatan Tengaran, Kab. Semarang</p>
          </div>
          <span class="text-[11px] md:text-xs font-bold px-3 py-1 rounded-full ${location === 'kua' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'}">
            PNBP: ${pnbpCost}
          </span>
        </div>

        <div class="space-y-2">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Daftar Berkas yang Wajib Disiapkan:</span>
          <ul class="space-y-2 text-xs md:text-sm text-slate-700 dark:text-slate-200">
            ${docs.map(d => `
              <li class="flex items-start gap-2.5 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5"></i>
                <span>${d}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        ${notes.length > 0 ? `
          <div class="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 text-xs border border-amber-200 dark:border-amber-800">
            ${notes.join('<br>')}
          </div>
        ` : ''}

        <div class="pt-3 flex flex-wrap gap-2 items-center justify-between no-print">
          <span class="text-[11px] text-slate-400">Pendaftaran min. 10 hari kerja sebelum akad via SIMKAH Kemenag.</span>
          <button onclick="window.print()" class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 transition-all">
            <i data-lucide="printer" class="w-3.5 h-3.5"></i> Cetak Dokumen Checklist
          </button>
        </div>
      </div>
    `;

    if (window.lucide) lucide.createIcons();
  }

  form.addEventListener('change', updateChecklist);
  updateChecklist();
}

function renderFaqs(faqs) {
  const container = document.getElementById('faq-accordion');
  if (!container) return;

  container.innerHTML = faqs.map((faq, idx) => `
    <div class="border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 transition-all">
      <button onclick="toggleFaq(${idx})" class="w-full p-4 md:p-5 text-left flex items-center justify-between gap-4 text-slate-900 dark:text-white font-bold text-xs md:text-sm hover:text-emerald-700 dark:hover:text-emerald-400">
        <span>${faq.q}</span>
        <i id="faq-icon-${idx}" data-lucide="chevron-down" class="w-4 h-4 shrink-0 transition-transform duration-300"></i>
      </button>
      <div id="faq-ans-${idx}" class="hidden p-4 md:p-5 pt-0 text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/30">
        ${faq.a}
      </div>
    </div>
  `).join('');

  if (window.lucide) lucide.createIcons();
}

window.toggleFaq = function(idx) {
  const ans = document.getElementById(`faq-ans-${idx}`);
  const icon = document.getElementById(`faq-icon-${idx}`);
  if (!ans) return;

  const isHidden = ans.classList.contains('hidden');
  ans.classList.toggle('hidden');
  if (icon) {
    icon.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
  }
};

function setupFaqSearch(faqs) {
  const input = document.getElementById('faq-search-input');
  if (!input) return;

  input.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    const filtered = faqs.filter(f => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q));
    renderFaqs(filtered);
  });
}

window.openWaModal = function(serviceTopic = 'Layanan Umum') {
  const modal = document.getElementById('wa-modal');
  const topicSelect = document.getElementById('wa-topic');
  if (topicSelect) topicSelect.value = serviceTopic;
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
};

window.closeWaModal = function() {
  const modal = document.getElementById('wa-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

window.sendWaMessage = function() {
  const name = document.getElementById('wa-name').value.trim() || 'Warga Tengaran';
  const desa = document.getElementById('wa-desa').value.trim() || 'Tengaran';
  const topic = document.getElementById('wa-topic').value;
  const msg = document.getElementById('wa-msg').value.trim() || 'Mohon informasi mengenai persyaratan layanan.';

  const fullText = `*KONSULTASI ONLINE KUA TENGARAN*\n` +
    `Nama: ${name}\n` +
    `Asal Desa: ${desa}\n` +
    `Topik Layanan: ${topic}\n\n` +
    `Pesan/Pertanyaan:\n${msg}\n\n` +
    `_Dikirim melalui Portal Resmi KUA Kecamatan Tengaran_`;

  window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(fullText)}`, '_blank');
  closeWaModal();
};

window.openSkmModal = function() {
  const modal = document.getElementById('skm-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
};

window.closeSkmModal = function() {
  const modal = document.getElementById('skm-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

window.submitSkm = function(e) {
  e.preventDefault();
  alert('Terima kasih atas penilaian Anda! Kritik & saran Anda sangat berharga untuk terus meningkatkan kualitas pelayanan publik KUA Kecamatan Tengaran.');
  closeSkmModal();
};
