/* ============================================================
   NATSEPA — script.js
   Shared across all pages
   ============================================================ */

const PHONE = '6281343301302';

/* ── Mobile Navigation ── */
const toggle = document.getElementById('mobile-toggle');
const drawer = document.getElementById('mobile-drawer');

if (toggle && drawer) {
  toggle.addEventListener('click', () => {
    const isOpen = drawer.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  drawer.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      drawer.classList.remove('open');
      toggle.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ── Header Scroll Shadow ── */
const header = document.getElementById('site-header');
if (header) {
  window.addEventListener('scroll', () => {
    header.style.boxShadow = window.scrollY > 60
      ? '0 4px 32px rgba(0,0,0,0.4)'
      : 'none';
  }, { passive: true });
}

/* ── Scroll Reveal ── */
const srEls = document.querySelectorAll('[data-sr]');
if (srEls.length) {
  const srObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Stagger siblings
        const parent = entry.target.parentElement;
        const siblings = parent ? [...parent.querySelectorAll('[data-sr]')] : [];
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 90);
        srObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  srEls.forEach(el => srObs.observe(el));
}

/* ── Nutrition Bars Animation ── */
const bars = document.querySelectorAll('.nutr-bar[data-pct]');
if (bars.length) {
  const barObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        setTimeout(() => {
          bar.style.width = bar.dataset.pct + '%';
        }, 100);
        barObs.unobserve(bar);
      }
    });
  }, { threshold: 0.5 });
  bars.forEach(b => barObs.observe(b));
}

/* ── Smooth Anchor Scroll ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      const hh = (document.getElementById('site-header') || {}).offsetHeight || 70;
      const top = target.getBoundingClientRect().top + window.scrollY - hh - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ============================================================
   CART SYSTEM
   ============================================================ */
let cartItems = {};

function fmt(n) {
  return 'Rp ' + Number(n).toLocaleString('id-ID');
}

function addToCart(btn) {
  const row = btn.closest('[data-id]');
  if (!row) return;
  const { id, title, price, img } = row.dataset;
  if (!id) return;

  if (cartItems[id]) {
    cartItems[id].qty += 1;
  } else {
    cartItems[id] = { id, title, price: parseInt(price), img, qty: 1 };
  }
  renderCart();
  openCart();

  // Button feedback
  const orig = btn.innerHTML;
  btn.innerHTML = '<i class="fa-solid fa-check"></i> Added';
  btn.style.cssText = 'background:#25D366;color:#fff;';
  setTimeout(() => {
    btn.innerHTML = orig;
    btn.style.cssText = '';
  }, 1500);
}

function changeQty(id, delta) {
  if (!cartItems[id]) return;
  cartItems[id].qty += delta;
  if (cartItems[id].qty <= 0) delete cartItems[id];
  renderCart();
}

function renderCart() {
  const itemsEl = document.getElementById('cart-items');
  const footEl  = document.getElementById('cart-foot');
  const totalEl = document.getElementById('cart-total');
  const countEl = document.getElementById('cart-count');
  const waBtn   = document.getElementById('wa-btn');

  const items = Object.values(cartItems);
  const totalQty = items.reduce((s, i) => s + i.qty, 0);
  if (countEl) countEl.textContent = totalQty;

  if (!itemsEl) return;

  if (!items.length) {
    itemsEl.innerHTML = '<p class="cart-empty-msg">Your cart is empty.</p>';
    if (footEl) footEl.style.display = 'none';
    return;
  }

  if (footEl) footEl.style.display = 'block';

  let total = 0;
  let waText = 'Halo NATSEPA 🌿, saya ingin memesan:\n\n';

  itemsEl.innerHTML = items.map(item => {
    const sub = item.price * item.qty;
    total += sub;
    waText += `• ${item.title} ×${item.qty} = ${fmt(sub)}\n`;
    return `
    <div class="citem">
      <img src="${item.img}" alt="${item.title}" class="citem-img">
      <div class="citem-info">
        <div class="citem-name">${item.title}</div>
        <div class="citem-price">${fmt(item.price)} × ${item.qty}</div>
      </div>
      <div class="citem-ctrl">
        <button class="qty-btn" onclick="changeQty('${item.id}',-1)">−</button>
        <span class="qty-num">${item.qty}</span>
        <button class="qty-btn" onclick="changeQty('${item.id}',1)">+</button>
      </div>
    </div>`;
  }).join('');

  waText += `\n💰 Total: ${fmt(total)}\n\nMohon info ketersediaan &amp; pengiriman. Terima kasih 🙏`;
  if (totalEl) totalEl.textContent = fmt(total);
  if (waBtn) waBtn.href = `https://wa.me/${PHONE}?text=${encodeURIComponent(waText.replace(/&amp;/g,'&'))}`;
}

function openCart() {
  const d = document.getElementById('cart-drawer');
  const o = document.getElementById('cart-overlay');
  if (d) d.classList.add('open');
  if (o) o.classList.add('open');
  document.body.style.overflow = 'hidden';
  renderCart();
}

function closeCart() {
  const d = document.getElementById('cart-drawer');
  const o = document.getElementById('cart-overlay');
  if (d) d.classList.remove('open');
  if (o) o.classList.remove('open');
  document.body.style.overflow = '';
}

// Close on overlay click
const overlay = document.getElementById('cart-overlay');
if (overlay) overlay.addEventListener('click', closeCart);

/* ── Journey ring hover pulse ── */
document.querySelectorAll('.step-ring').forEach(ring => {
  ring.addEventListener('mouseenter', () => {
    ring.style.boxShadow = '0 0 0 12px rgba(200,169,74,.18), 0 0 0 22px rgba(200,169,74,.05)';
  });
  ring.addEventListener('mouseleave', () => {
    ring.style.boxShadow = '';
  });
});

/* ── Product card button: link data-id from card parent for index.html ── */
document.querySelectorAll('.product-card .btn-cart').forEach(btn => {
  const card = btn.closest('.product-card');
  if (card) {
    ['id','title','price','img'].forEach(k => {
      if (card.dataset[k]) btn.closest('[data-id]') || (btn.dataset[k] = card.dataset[k]);
    });
  }
});
