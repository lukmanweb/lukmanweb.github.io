/* ============================================================
   SHARED JS – navbar toggle, dropdowns, mobile menu
   Used by index.html and all sub-pages
   ============================================================ */

(function () {
    'use strict';

    /* ── Sticky navbar ─────────────────────────────── */
    const navbar = document.querySelector('.navbar-wrapper');
    if (navbar) {
        const onScroll = () => navbar.classList.toggle('sticky-active', window.scrollY > 30);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* ── Mobile hamburger ──────────────────────────── */
    const toggle = document.getElementById('mobile-toggle');
    const menu   = document.getElementById('nav-menu');
    if (toggle && menu) {
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.toggle('active');
            const icon = toggle.querySelector('i');
            if (icon) icon.className = menu.classList.contains('active') ? 'fa fa-times' : 'fa fa-bars';
        });
        
        document.addEventListener('click', (e) => {
            if (menu.classList.contains('active') && !menu.contains(e.target) && !toggle.contains(e.target)) {
                menu.classList.remove('active');
                const icon = toggle.querySelector('i');
                if (icon) icon.className = 'fa fa-bars';
            }
        });
    }

    /* ── Mobile: tap dropdown toggle ─────────────── */
    document.querySelectorAll('.nav-dropdown').forEach(dd => {
        const toggleBtn = dd.querySelector('.dropdown-toggle');
        if (!toggleBtn) return;
        toggleBtn.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                e.stopPropagation();
                dd.classList.toggle('active');
                document.querySelectorAll('.nav-dropdown').forEach(other => {
                    if (other !== dd) other.classList.remove('active');
                });
            }
        });
    });

    /* ── Highlight active nav link based on current page ── */
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link, .dropdown-toggle').forEach(link => {
        const href = link.getAttribute('href') || '';
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
    document.querySelectorAll('.dropdown-item').forEach(item => {
        const href = item.getAttribute('href') || '';
        if (href === currentPage) {
            item.style.color = 'var(--color-emerald-medium)';
            item.style.background = 'var(--color-emerald-soft)';
            // also mark parent toggle
            const parent = item.closest('.nav-dropdown');
            if (parent) {
                const pt = parent.querySelector('.dropdown-toggle');
                if (pt) pt.classList.add('active');
            }
        }
    });

    /* ── Hero Slider ───────────────────────────────── */
    const slider = document.querySelector('.hero-slider');
    if (slider) {
        const slides = slider.querySelectorAll('.slide');
        const dots   = document.querySelectorAll('.slider-dot');
        const prev   = document.getElementById('slider-prev');
        const next   = document.getElementById('slider-next');
        let current  = 0;
        let timer;

        function goTo(idx) {
            slides[current].classList.remove('active');
            if (dots[current]) dots[current].classList.remove('active');
            current = (idx + slides.length) % slides.length;
            slides[current].classList.add('active');
            if (dots[current]) dots[current].classList.add('active');
        }

        function startAuto() {
            timer = setInterval(() => goTo(current + 1), 5500);
        }
        function resetAuto() { clearInterval(timer); startAuto(); }

        if (next) next.addEventListener('click', () => { goTo(current + 1); resetAuto(); });
        if (prev) prev.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
        dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); resetAuto(); }));

        // swipe support
        let touchStartX = 0;
        slider.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
        slider.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) { goTo(current + (diff > 0 ? 1 : -1)); resetAuto(); }
        });

        goTo(0);
        startAuto();
    }

    /* ── FAQ Accordion ─────────────────────────────── */
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const isOpen = item.classList.contains('open');
            document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
            if (!isOpen) item.classList.add('open');
        });
    });

    /* ── WhatsApp order button ─────────────────────── */
    document.querySelectorAll('.order-whatsapp').forEach(btn => {
        btn.addEventListener('click', () => {
            const prod = btn.dataset.prod || 'Produk Zefa';
            const msg  = encodeURIComponent(`Halo Admin Zefa! 👋\nSaya tertarik memesan: *${prod}*.\nMohon informasi lebih lanjut. Terima kasih!`);
            window.open(`https://wa.me/6285727289279?text=${msg}`, '_blank');
        });
    });

    /* ── Product Detail Modal ───────────────────────── */
    const prodModal = document.getElementById('product-modal');
    const closeProdBtn = document.getElementById('close-prod-btn');
    if (prodModal && closeProdBtn) {
        document.querySelectorAll('.btn-detail-prod').forEach(btn => {
            btn.addEventListener('click', () => {
                document.getElementById('modal-img').src = btn.dataset.img || 'images/logo.png';
                document.getElementById('modal-title').textContent = btn.dataset.title || 'Produk Zefa';
                document.getElementById('modal-desc').textContent = btn.dataset.desc || '';
                document.getElementById('modal-price').textContent = btn.dataset.price || '';
                document.getElementById('modal-member-price').textContent = btn.dataset.member || '';
                document.getElementById('modal-badge').textContent = btn.dataset.badge || 'Produk Unggulan';
                const waBtn = document.getElementById('modal-wa-btn');
                if (waBtn) waBtn.dataset.prod = btn.dataset.title;
                prodModal.classList.add('active');
            });
        });
        closeProdBtn.addEventListener('click', () => prodModal.classList.remove('active'));
        prodModal.addEventListener('click', e => {
            if (e.target === prodModal) prodModal.classList.remove('active');
        });
    }

    /* ── Auth check form ───────────────────────────── */
    const authForm = document.getElementById('auth-check-form');
    if (authForm) {
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const code = document.getElementById('auth-code').value.trim().toUpperCase();
            const result = document.getElementById('auth-result');
            if (!result) return;
            // Simulate check – real integration needs backend
            const validPrefixes = ['ZMS', 'ZEF', 'ZAG', 'MYK', 'VRS'];
            const isValid = validPrefixes.some(p => code.startsWith(p)) && code.length >= 8;
            result.style.display = 'block';
            result.className = 'auth-result ' + (isValid ? 'valid' : 'invalid');
            result.innerHTML = isValid
                ? `<i class="fa fa-circle-check"></i><strong>PRODUK ASLI TERVERIFIKASI ✅</strong><br>Kode <em>${code}</em> terdaftar dalam sistem Zefa. Produk ini asli dan aman dikonsumsi.`
                : `<i class="fa fa-circle-xmark"></i><strong>KODE TIDAK DITEMUKAN ❌</strong><br>Kode <em>${code}</em> tidak terdaftar. Pastikan kode benar atau hubungi admin Zefa.`;
        });
    }

})();
