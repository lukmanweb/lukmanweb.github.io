/* ─────────────────────────────────────────────
   NATSEPA — script.js
   Cart Logic + Scroll Animations + Navigation
───────────────────────────────────────────── */

/* ══ Mobile Navigation ══ */
const navToggle = document.getElementById('nav-toggle');
const mobileDrawer = document.getElementById('mobile-drawer');

navToggle.addEventListener('click', () => {
    mobileDrawer.classList.toggle('open');
    const isOpen = mobileDrawer.classList.contains('open');
    navToggle.setAttribute('aria-expanded', isOpen);
});

mobileDrawer.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileDrawer.classList.remove('open'));
});

/* ══ Header Scroll Effect ══ */
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
    header.style.boxShadow = window.scrollY > 60
        ? '0 4px 30px rgba(0,0,0,0.35)'
        : 'none';
});

/* ══ Cart State ══ */
const cart = {};
const PHONE = '6281343301302';

function formatRp(num) {
    return 'Rp ' + num.toLocaleString('id-ID');
}

function addToCart(btn) {
    const row = btn.closest('.product-row');
    const id    = row.dataset.id;
    const title = row.dataset.title;
    const price = parseInt(row.dataset.price);
    const img   = row.dataset.img;

    if (cart[id]) {
        cart[id].qty += 1;
    } else {
        cart[id] = { id, title, price, img, qty: 1 };
    }

    renderCart();
    openCart();

    // Quick feedback
    btn.textContent = '✓ Added';
    btn.style.background = '#25D366';
    btn.style.color = '#fff';
    setTimeout(() => {
        btn.innerHTML = '<i class="fa-solid fa-plus"></i> Add';
        btn.style.background = '';
        btn.style.color = '';
    }, 1400);
}

function changeQty(id, delta) {
    if (!cart[id]) return;
    cart[id].qty += delta;
    if (cart[id].qty <= 0) delete cart[id];
    renderCart();
}

function renderCart() {
    const container  = document.getElementById('cart-items');
    const footer     = document.getElementById('cart-footer');
    const countBadge = document.getElementById('float-cart-count');
    const totalEl    = document.getElementById('cart-total-price');
    const waBtn      = document.getElementById('wa-order-btn');
    const items      = Object.values(cart);

    countBadge.textContent = items.reduce((s, i) => s + i.qty, 0);

    if (items.length === 0) {
        container.innerHTML = '<p class="cart-empty">Your cart is empty</p>';
        footer.style.display = 'none';
        return;
    }

    footer.style.display = 'block';

    let total = 0;
    let waText = 'Halo NATSEPA, saya ingin memesan:\n\n';

    container.innerHTML = items.map(item => {
        const sub = item.price * item.qty;
        total += sub;
        waText += `- ${item.title} x${item.qty} = ${formatRp(sub)}\n`;
        return `
        <div class="cart-item">
            <img src="${item.img}" alt="${item.title}" class="cart-item-img">
            <div class="cart-item-info">
                <h6>${item.title}</h6>
                <span class="cart-item-price">${formatRp(item.price)} × ${item.qty}</span>
            </div>
            <div class="cart-item-controls">
                <button onclick="changeQty('${item.id}', -1)" aria-label="Kurangi">−</button>
                <span class="cart-item-qty">${item.qty}</span>
                <button onclick="changeQty('${item.id}', 1)" aria-label="Tambah">+</button>
            </div>
        </div>`;
    }).join('');

    waText += `\nTotal: ${formatRp(total)}\n\nMohon info ketersediaan dan cara pengiriman. Terima kasih! 🙏`;
    totalEl.textContent = formatRp(total);
    waBtn.href = `https://wa.me/${PHONE}?text=${encodeURIComponent(waText)}`;
}

function openCart() {
    document.getElementById('cart-drawer').classList.add('open');
    document.getElementById('cart-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    document.getElementById('cart-drawer').classList.remove('open');
    document.getElementById('cart-overlay').classList.remove('open');
    document.body.style.overflow = '';
}

document.getElementById('cart-overlay').addEventListener('click', closeCart);

/* ══ Nutrition Bar Animation ══ */
const nutrBars = document.querySelectorAll('.nutr-bar');

const nutrObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bar = entry.target;
            const pct = bar.dataset.pct;
            bar.style.width = pct + '%';
            nutrObserver.unobserve(bar);
        }
    });
}, { threshold: 0.4 });

nutrBars.forEach(bar => nutrObserver.observe(bar));

/* ══ Scroll Reveal ══ */
const revealEls = document.querySelectorAll('[data-reveal]');

const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            // Stagger delay based on index within parent
            const siblings = entry.target.parentElement.querySelectorAll('[data-reveal]');
            let idx = 0;
            siblings.forEach((s, si) => { if (s === entry.target) idx = si; });
            setTimeout(() => {
                entry.target.classList.add('revealed');
            }, idx * 80);
            revealObs.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObs.observe(el));

/* ══ Smooth Scroll for Anchor links ══ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            e.preventDefault();
            const headerH = document.getElementById('site-header').offsetHeight;
            const top = target.getBoundingClientRect().top + window.scrollY - headerH - 12;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

/* ══ Journey Card hover pulse ══ */
document.querySelectorAll('.journey-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        const ring = card.querySelector('.jcard-img-ring');
        ring.style.boxShadow = '0 0 0 10px rgba(200,169,74,0.15), 0 0 0 18px rgba(200,169,74,0.05)';
    });
    card.addEventListener('mouseleave', () => {
        const ring = card.querySelector('.jcard-img-ring');
        ring.style.boxShadow = '';
    });
});
