/* ==========================================================================
   ZEFA MULIA SEJAHTERA - INTERACTIVITY & MEMBER AREA CORE ENGINE (VANILLA JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. STATE CONFIGURATION
    // ==========================================
    const STATE = {
        currentUser: null,
        cart: [],
        activeDashboardTab: 'db-overview'
    };

    // ==========================================
    // 2. STICKY NAVBAR & SCROLL HIGHLIGHTING
    // ==========================================
    const navbar = document.querySelector('.navbar-wrapper');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        // Sticky class toggle
        if (window.scrollY > 100) {
            navbar.classList.add('sticky-active');
        } else {
            navbar.classList.remove('sticky-active');
        }

        // Active link highlighting
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });

    // Mobile menu handles in shared.js

    // ==========================================
    // 4. ABOUT TABS (FILOSOFI / VISI / MISI)
    // ==========================================
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            // Toggle buttons active state
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Toggle active content pane
            tabPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.getAttribute('id') === targetTab) {
                    pane.classList.add('active');
                }
            });
        });
    });

    // ==========================================
    // 5. FAQ ACCORDION PANEL TOGGLES
    // ==========================================
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const isActive = item.classList.contains('active');
            
            // Close all items
            document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));
            
            // Open current if not active previously
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // ==========================================
    // 6. GENERAL TOAST ALERTS SYSTEM
    // ==========================================
    const toast = document.getElementById('toast-notif');
    const toastText = toast.querySelector('.toast-text');

    function showToast(message, duration = 3000) {
        toastText.textContent = message;
        toast.classList.remove('hide');
        
        setTimeout(() => {
            toast.classList.add('hide');
        }, duration);
    }

    // ==========================================
    // 7. REGISTRATION MODAL & WHATSAPP INTEGRATION
    // ==========================================
    const regModal = document.getElementById('reg-modal');
    const openRegButtons = document.querySelectorAll('.open-reg-btn');
    const closeRegBtn = document.getElementById('close-reg-btn');
    const regForm = document.getElementById('reg-form');

    // Open/Close Registration
    openRegButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            regModal.classList.add('active');
        });
    });

    if (closeRegBtn) {
        closeRegBtn.addEventListener('click', () => {
            regModal.classList.remove('active');
        });
    }

    if (regForm) {
        regForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('reg-name').value;
            const phone = document.getElementById('reg-phone').value;
            const pack = document.getElementById('reg-package').value;
            
            // Generate customized WhatsApp URL
            const text = `Halo Admin PT Zefa Mulia Sejahtera, saya tertarik mendaftar sebagai mitra bisnis Zefa.\n\n` +
                         `*Nama:* ${name}\n` +
                         `*No. WhatsApp:* ${phone}\n` +
                         `*Pilihan Paket Join:* ${pack}\n\n` +
                         `Mohon diproses untuk aktivasi kemitraan saya. Terima kasih!`;
            
            const encodedText = encodeURIComponent(text);
            const waUrl = `https://api.whatsapp.com/send?phone=6285727289279&text=${encodedText}`;
            
            regModal.classList.remove('active');
            regForm.reset();
            
            showToast("Membuka WhatsApp untuk pendaftaran...", 2000);
            setTimeout(() => {
                window.open(waUrl, '_blank');
            }, 1000);
        });
    }

    // ==========================================
    // 8. PRODUCT WHATSAPP ORDER TRIGGERS
    // ==========================================
    const orderWaButtons = document.querySelectorAll('.order-whatsapp');
    orderWaButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const productName = btn.getAttribute('data-prod');
            const message = `Halo Admin Zefa, saya tertarik memesan produk:\n` +
                            `*${productName}*\n\n` +
                            `Apakah stok tersedia? Mohon informasi cara pemesanan dan pengirimannya. Terima kasih!`;
            const encoded = encodeURIComponent(message);
            const waUrl = `https://api.whatsapp.com/send?phone=6285727289279&text=${encoded}`;
            
            showToast(`Menghubungkan ke WhatsApp untuk pemesanan ${productName}...`, 2000);
            setTimeout(() => {
                window.open(waUrl, '_blank');
            }, 1000);
        });
    });

    // ==========================================
    // 9. MEMBER AUTHENTICATION SYSTEM (LOGIN/LOGOUT)
    // ==========================================
    const loginModal = document.getElementById('login-modal');
    const openLoginBtn = document.getElementById('open-login-btn');
    const closeLoginBtn = document.getElementById('close-login-btn');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error-msg');
    const togglePwdBtn = document.getElementById('toggle-pwd-btn');
    const passwordInput = document.getElementById('password');
    const submitLoginBtn = document.getElementById('submit-login-btn');

    // Views
    const homeView = document.getElementById('home-view');
    const dashboardView = document.getElementById('dashboard-view');

    // Open/Close Login Modal
    if (openLoginBtn) {
        openLoginBtn.addEventListener('click', () => {
            loginModal.classList.add('active');
            loginError.classList.add('hide');
        });
    }

    if (closeLoginBtn) {
        closeLoginBtn.addEventListener('click', () => {
            loginModal.classList.remove('active');
            if (loginForm) loginForm.reset();
        });
    }

    // Toggle Password Visibility
    if (togglePwdBtn && passwordInput) {
        togglePwdBtn.addEventListener('click', () => {
            const isPassword = passwordInput.getAttribute('type') === 'password';
            passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
            togglePwdBtn.querySelector('i').className = isPassword ? 'fa fa-eye-slash' : 'fa fa-eye';
        });
    }

    // Form Submission & Verification
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const usernameVal = document.getElementById('username').value.trim().toLowerCase();
            const passwordVal = passwordInput.value.trim();

            // Set loading animation status
            submitLoginBtn.disabled = true;
            submitLoginBtn.querySelector('span').textContent = "Memverifikasi Akun...";

            setTimeout(() => {
                // AUTH CHECK: lukman / sukses
                if (usernameVal === 'lukman' && passwordVal === 'sukses') {
                    loginError.classList.add('hide');
                    loginModal.classList.remove('active');
                    loginForm.reset();
                    
                    // Trigger Portal View
                    STATE.currentUser = 'Lukman Hakim';
                    showToast("Login Berhasil! Selamat Datang Lukman Hakim.", 2500);
                    
                    // Transition to Dashboard View
                    setTimeout(() => {
                        homeView.classList.remove('view-active');
                        homeView.classList.add('view-inactive');
                        
                        dashboardView.classList.remove('view-inactive');
                        dashboardView.classList.add('view-active');
                        
                        // Load Dashboard state
                        initDashboard();
                    }, 500);
                } else {
                    // Show error box
                    loginError.classList.remove('hide');
                }
                
                // Restore button state
                submitLoginBtn.disabled = false;
                submitLoginBtn.querySelector('span').textContent = "Masuk Portal Mitra";
            }, 1000);
        });
    }

    // Logout Action
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            showToast("Anda telah keluar dari Portal Member Zefa.", 2000);
            
            setTimeout(() => {
                dashboardView.classList.remove('view-active');
                dashboardView.classList.add('view-inactive');
                
                homeView.classList.remove('view-inactive');
                homeView.classList.add('view-active');
                
                STATE.currentUser = null;
                STATE.cart = [];
                updateCartCount();
                
                // Scroll to top of landing page
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 500);
        });
    }

    // ==========================================
    // 10. INTERACTIVE MEMBER PORTAL FUNCTIONS
    // ==========================================
    
    // Sidebar Tabs navigation
    const dbNavItems = document.querySelectorAll('.db-nav-item');
    const dbTabPanes = document.querySelectorAll('.db-tab-pane');
    const dbActiveTitle = document.getElementById('db-active-tab-title');

    dbNavItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetPane = item.getAttribute('data-db-tab');
            const tabTitle = item.textContent.trim();
            
            dbNavItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            dbTabPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.getAttribute('id') === targetPane) {
                    pane.classList.add('active');
                }
            });

            dbActiveTitle.textContent = tabTitle;
        });
    });

    // Trigger tab transition from shortcuts inside dashboard overview
    const triggerGenealogy = document.getElementById('trigger-genealogy-tab');
    if (triggerGenealogy) {
        triggerGenealogy.addEventListener('click', (e) => {
            e.preventDefault();
            const genealogyNavItem = document.querySelector('[data-db-tab="db-genealogy"]');
            if (genealogyNavItem) {
                genealogyNavItem.click();
            }
        });
    }

    // Setup dates and dynamic features on dashboard initialization
    function initDashboard() {
        // Render current local date beautifully in header
        const dateDisplay = document.getElementById('db-date-display');
        if (dateDisplay) {
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const today = new Date();
            dateDisplay.textContent = today.toLocaleDateString('id-ID', options);
        }
    }

    // Copy Referral Link functionality
    const copyRefBtn = document.getElementById('copy-ref-btn');
    const refInputUrl = document.getElementById('referral-url');
    
    if (copyRefBtn && refInputUrl) {
        copyRefBtn.addEventListener('click', () => {
            refInputUrl.select();
            refInputUrl.setSelectionRange(0, 99999); // For mobile viewports
            
            navigator.clipboard.writeText(refInputUrl.value)
                .then(() => {
                    showToast("Link referral berhasil disalin ke papan klip! 📋");
                    copyRefBtn.innerHTML = '<i class="fa fa-check"></i> Tersalin';
                    copyRefBtn.classList.add('btn-success');
                    
                    setTimeout(() => {
                        copyRefBtn.innerHTML = '<i class="fa fa-copy"></i> Salin Link';
                        copyRefBtn.classList.remove('btn-success');
                    }, 2000);
                })
                .catch(err => {
                    console.error('Error copying text: ', err);
                });
        });
    }

    // ==========================================
    // 11. MEMBER SHOPPING CART LOGIC
    // ==========================================
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    const cartCountBadge = document.getElementById('cart-count');

    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = btn.getAttribute('data-id');
            const productName = btn.getAttribute('data-name');
            const productPrice = parseInt(btn.getAttribute('data-price'));
            
            // Add product into current cart state
            STATE.cart.push({ id: productId, name: productName, price: productPrice });
            updateCartCount();
            
            showToast(`${productName} ditambahkan ke keranjang belanja Anda! 🛒`);
        });
    });

    function updateCartCount() {
        if (cartCountBadge) {
            cartCountBadge.textContent = STATE.cart.length;
        }
    }

    // Simulated modal close triggers on clicking background overlay
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.classList.remove('active');
            loginForm.reset();
        }
        if (e.target === regModal) {
            regModal.classList.remove('active');
            regForm.reset();
        }
    });

    // Keydown triggers (Escape key closes open modals)
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            loginModal.classList.remove('active');
            regModal.classList.remove('active');
        }
    });
});
