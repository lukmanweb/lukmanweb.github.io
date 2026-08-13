document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // 1. NAVBAR & MOBILE MENU LOGIC
    // -------------------------------------------------------------
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.padding = '10px 0';
            navbar.style.background = 'rgba(10, 33, 24, 0.95)';
            navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
        } else {
            navbar.style.padding = '16px 0';
            navbar.style.background = 'rgba(10, 33, 24, 0.85)';
            navbar.style.boxShadow = 'none';
        }
    });

    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('mobile-open');
            // Toggle hamburger icon
            const icon = mobileToggle.querySelector('i');
            if (navLinks.classList.contains('mobile-open')) {
                icon.classList.replace('fa-bars', 'fa-xmark');
            } else {
                icon.classList.replace('fa-xmark', 'fa-bars');
            }
        });

        // Tutup menu saat klik link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('mobile-open');
                const icon = mobileToggle.querySelector('i');
                icon.classList.replace('fa-xmark', 'fa-bars');
            });
        });
    }

    // -------------------------------------------------------------
    // 2. SHOPPING CART LOGIC (LOCALSTORAGE)
    // -------------------------------------------------------------
    let cart = JSON.parse(localStorage.getItem('kenari_maluku_cart')) || [];

    const cartBtn = document.getElementById('cartBtn');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartDrawer = document.getElementById('cartDrawer');
    const cartCloseBtn = document.getElementById('cartCloseBtn');
    const cartBadge = document.getElementById('cartBadge');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const btnOpenCheckoutForm = document.getElementById('btnOpenCheckoutForm');

    // Order Form Modal Elements
    const checkoutModalOverlay = document.getElementById('checkoutModalOverlay');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const checkoutForm = document.getElementById('checkoutForm');
    const modalOrderSummary = document.getElementById('modalOrderSummary');
    const modalGrandTotal = document.getElementById('modalGrandTotal');

    // Toggle Drawer Open / Close
    function openCart() {
        cartDrawer.classList.add('active');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeCart() {
        cartDrawer.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (cartBtn) cartBtn.addEventListener('click', openCart);
    if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

    // Toggle Modal Checkout Open / Close
    function openCheckoutModal() {
        if (cart.length === 0) {
            alert('Keranjang belanja Anda masih kosong!');
            return;
        }
        closeCart(); // Close sidebar drawer

        // Render summary in modal
        let summaryHtml = '<ul style="list-style:none; padding:0; margin:0 0 10px 0;">';
        let totalAmount = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            totalAmount += itemTotal;
            summaryHtml += `
                <li style="display:flex; justify-content:space-between; font-size:0.9rem; margin-bottom:6px;">
                    <span>• ${item.title} (x${item.quantity})</span>
                    <strong>${formatRupiah(itemTotal)}</strong>
                </li>
            `;
        });
        summaryHtml += '</ul>';

        modalOrderSummary.innerHTML = summaryHtml;
        modalGrandTotal.innerText = formatRupiah(totalAmount);

        checkoutModalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeCheckoutModal() {
        checkoutModalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (btnOpenCheckoutForm) btnOpenCheckoutForm.addEventListener('click', openCheckoutModal);
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeCheckoutModal);

    // Save & Render Cart
    function saveCart() {
        localStorage.setItem('kenari_maluku_cart', JSON.stringify(cart));
        renderCart();
    }

    function formatRupiah(number) {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
    }

    function renderCart() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartBadge.innerText = totalItems;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="cart-empty-state">
                    <i class="fa-solid fa-basket-shopping"></i>
                    <p>Keranjang belanja Anda masih kosong.</p>
                    <a href="#products" class="btn-shop-now" onclick="document.getElementById('cartCloseBtn').click()">Mulai Belanja</a>
                </div>
            `;
            cartSubtotal.innerText = 'Rp 0';
            return;
        }

        let html = '';
        let totalAmount = 0;

        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            totalAmount += itemTotal;

            html += `
                <div class="cart-item">
                    <img src="${item.img}" alt="${item.title}" class="cart-item-img">
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.title}</div>
                        <div class="cart-item-price">${formatRupiah(item.price)}</div>
                        <div class="cart-item-controls">
                            <button class="btn-qty" onclick="updateQty(${index}, -1)">-</button>
                            <span class="cart-item-qty">${item.quantity}</span>
                            <button class="btn-qty" onclick="updateQty(${index}, 1)">+</button>
                        </div>
                    </div>
                    <button class="btn-remove-item" onclick="removeItem(${index})" title="Hapus"><i class="fa-solid fa-trash-can"></i></button>
                </div>
            `;
        });

        cartItemsContainer.innerHTML = html;
        cartSubtotal.innerText = formatRupiah(totalAmount);
    }

    // Add To Cart Function
    function addToCart(id, title, price, img) {
        const existingIndex = cart.findIndex(item => item.id === id);
        if (existingIndex > -1) {
            cart[existingIndex].quantity += 1;
        } else {
            cart.push({ id, title, price: Number(price), img, quantity: 1 });
        }
        saveCart();
        openCart();
    }

    // Expose helpers to global window object for onclick events
    window.updateQty = function(index, change) {
        if (cart[index]) {
            cart[index].quantity += change;
            if (cart[index].quantity <= 0) {
                cart.splice(index, 1);
            }
            saveCart();
        }
    };

    window.removeItem = function(index) {
        if (cart[index]) {
            cart.splice(index, 1);
            saveCart();
        }
    };

    // Attach Event Listeners to Product Buy Buttons
    const buyButtons = document.querySelectorAll('.btn-buy');
    buyButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            const id = productCard.getAttribute('data-id');
            const title = productCard.getAttribute('data-title');
            const price = productCard.getAttribute('data-price');
            const img = productCard.getAttribute('data-img');

            addToCart(id, title, price, img);
        });
    });

    // Handle Order Form Submission to WhatsApp
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('custName').value.trim();
            const phone = document.getElementById('custPhone').value.trim();
            const address = document.getElementById('custAddress').value.trim();
            const notes = document.getElementById('custNotes').value.trim();

            let message = `*FORM PEMESANAN KENARI MALUKU*\n\n`;
            message += `👤 *Nama Lengkap:* ${name}\n`;
            message += `📱 *No. HP/WA:* ${phone}\n`;
            message += `🏠 *Alamat Pengiriman:* ${address}\n`;
            if (notes) message += `📝 *Catatan:* ${notes}\n`;

            message += `\n-----------------------------------\n`;
            message += `📦 *RINCIAN PESANAN:*\n`;

            let grandTotal = 0;
            cart.forEach((item, i) => {
                const total = item.price * item.quantity;
                grandTotal += total;
                message += `${i + 1}. ${item.title} (x${item.quantity}) = ${formatRupiah(total)}\n`;
            });

            message += `\n💰 *TOTAL PEMBAYARAN:* ${formatRupiah(grandTotal)}\n`;
            message += `-----------------------------------\n\n`;
            message += `Mohon info nomor rekening dan estimasi ongkos kirim. Terima kasih!`;

            const targetPhone = "6281234567890";
            const encodedMsg = encodeURIComponent(message);

            // Clear cart & Close modal
            cart = [];
            saveCart();
            closeCheckoutModal();

            // Redirect to WhatsApp
            window.open(`https://wa.me/${targetPhone}?text=${encodedMsg}`, '_blank');
        });
    }

    // Initial render on page load
    renderCart();

    // -------------------------------------------------------------
    // 3. FADE-IN SCROLL ANIMATION (INTERSECTION OBSERVER)
    // -------------------------------------------------------------
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.story-grid, .unique-card, .product-card, .impact-wrapper, .story-subsection');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)';
        observer.observe(el);
    });

    // ── NATSEPA: Nutrition Bar Animation on Scroll ──
    const nutritionSection = document.getElementById('nutritionBars');
    if (nutritionSection) {
        const barObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bars = entry.target.querySelectorAll('.nutr-bar-fill');
                    bars.forEach((bar, i) => {
                        const targetWidth = bar.getAttribute('data-width');
                        setTimeout(() => {
                            bar.style.width = targetWidth + '%';
                        }, i * 150);
                    });
                    barObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        barObserver.observe(nutritionSection);
    }

    // ── NATSEPA: Journey Steps Staggered Entrance ──
    const journeySteps = document.querySelectorAll('.journey-step');
    if (journeySteps.length) {
        const stepObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const steps = entry.target.querySelectorAll('.journey-step');
                    steps.forEach((step, i) => {
                        step.style.opacity = '0';
                        step.style.transform = 'translateY(32px)';
                        step.style.transition = 'all 0.6s ease';
                        setTimeout(() => {
                            step.style.opacity = '1';
                            step.style.transform = 'translateY(0)';
                        }, i * 160);
                    });
                    stepObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        const timeline = document.querySelector('.journey-timeline');
        if (timeline) stepObserver.observe(timeline);
    }

    // ── NATSEPA: Why Cards Fade In ──
    const whyCards = document.querySelectorAll('.why-card, .trust-item');
    whyCards.forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(24px)';
        card.style.transition = `all 0.55s ease ${i * 80}ms`;
        observer.observe(card);
    });
});

