/**
 * Azzura Salon & Beauty Bar - Interactive JavaScript Logic
 */

// Treatments Database
const treatmentsData = [
  {
    id: "haircut_female",
    name: "Korean Layered / Bob Haircut + Wash & Blow",
    category: "haircut",
    basePrice: 75000,
    duration: 45,
    description: "Potongan rambut tren terkini disesuaikan dengan bentuk wajah, sudah termasuk keramas rileks dan styling blow finish.",
    img: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=500&q=80",
    hasLengthMultiplier: false
  },
  {
    id: "blowout_styling",
    name: "Signature Styling & Glamour Blowout / Curly",
    category: "haircut",
    basePrice: 50000,
    duration: 35,
    description: "Penataan rambut bervolume, bouncy wave, atau sleek straight untuk acara wisuda, pesta, atau photoshoot.",
    img: "https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=500&q=80",
    hasLengthMultiplier: false
  },
  {
    id: "keratin_smoothing",
    name: "Silk Keratin Blow Smoothing Treatment",
    category: "treatment",
    basePrice: 250000,
    duration: 120,
    description: "Meluruskan sekaligus memperbaiki rambut rusak, kusam, dan mengembang menjadi halus lembut seperti sutra dan mudah diatur.",
    img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=500&q=80",
    hasLengthMultiplier: true
  },
  {
    id: "japanese_smoothing",
    name: "Japanese Straightening Rebonding",
    category: "treatment",
    basePrice: 220000,
    duration: 150,
    description: "Pelurusan rambut tahan lama dengan hasil lurus berkilau natural dan tidak kaku menggunakan formula lembut.",
    img: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=500&q=80",
    hasLengthMultiplier: true
  },
  {
    id: "hair_spa_creambath",
    name: "Aromatherapy Hair Spa & Scalp Massage",
    category: "treatment",
    basePrice: 85000,
    duration: 60,
    description: "Perawatan nutrisi batang rambut dan kulit kepala disertai pijatan relaksasi bahu dan punggung yang menenangkan.",
    img: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=500&q=80",
    hasLengthMultiplier: false
  },
  {
    id: "balayage_color",
    name: "Luxe Balayage / Ombre + Plex Protection",
    category: "coloring",
    basePrice: 350000,
    duration: 180,
    description: "Teknik pewarnaan gradasi dimensional tanpa garis tegas, membuat penampilan semakin modern & glowing tanpa merusak rambut.",
    img: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=500&q=80",
    hasLengthMultiplier: true
  },
  {
    id: "single_color",
    name: "Full Fashion Color / Gray Coverage Tone",
    category: "coloring",
    basePrice: 180000,
    duration: 90,
    description: "Pewarnaan merata dari akar hingga ujung rambut dengan pilihan warna trendi (Ash, Cokelat, Burgundy, Mocha, dll).",
    img: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=500&q=80",
    hasLengthMultiplier: true
  },
  {
    id: "nail_art_gel",
    name: "Korean Gel Nail Art & Manicure Express",
    category: "beauty",
    basePrice: 95000,
    duration: 60,
    description: "Pembersihan kutikula, perapian kuku, dan aplikasi kutek gel tahan hingga 4 minggu dengan pilihan desain estetik.",
    img: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=500&q=80",
    hasLengthMultiplier: false
  },
  {
    id: "facial_glow",
    name: "Detox Facial Glow & Head Acupressure",
    category: "beauty",
    basePrice: 110000,
    duration: 60,
    description: "Pembersihan komedo, masker pelembap mencerahkan, dan totok wajah untuk melancarkan sirkulasi darah.",
    img: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=500&q=80",
    hasLengthMultiplier: false
  }
];

// Helper: Format Currency IDR
function formatIDR(amount) {
  return "Rp " + amount.toLocaleString("id-ID");
}

document.addEventListener("DOMContentLoaded", () => {
  // 1. Mobile Menu Navigation Toggle
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const navMenu = document.getElementById("navMenu");

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      const icon = hamburgerBtn.querySelector("i");
      if (navMenu.classList.contains("active")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-xmark");
      } else {
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
      }
    });

    // Close menu when clicking nav links
    document.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        const icon = hamburgerBtn.querySelector("i");
        if (icon) {
          icon.classList.remove("fa-xmark");
          icon.classList.add("fa-bars");
        }
      });
    });
  }

  // 2. Render Treatment Catalog Grid
  const servicesContainer = document.getElementById("servicesContainer");
  const serviceTabs = document.querySelectorAll("#serviceTabs .tab-btn");

  function renderServices(category = "all") {
    if (!servicesContainer) return;
    servicesContainer.innerHTML = "";

    const filtered = category === "all" 
      ? treatmentsData 
      : treatmentsData.filter(item => item.category === category);

    filtered.forEach(item => {
      const card = document.createElement("div");
      card.className = "service-card";
      card.innerHTML = `
        <div class="service-img">
          <img src="${item.img}" alt="${item.name}" loading="lazy">
          <span class="service-badge">${item.category.toUpperCase()}</span>
        </div>
        <div class="service-body">
          <div class="service-title-row">
            <h3 class="service-title">${item.name}</h3>
          </div>
          <div class="service-price">${formatIDR(item.basePrice)}${item.hasLengthMultiplier ? '*' : ''}</div>
          <p class="service-desc">${item.description}</p>
          <div class="service-meta">
            <span><i class="fa-regular fa-clock"></i> ±${item.duration} Menit</span>
            <a href="#booking" class="service-action-btn" data-treatment="${item.name}">
              Pilih Layanan <i class="fa-solid fa-arrow-right"></i>
            </a>
          </div>
        </div>
      `;
      servicesContainer.appendChild(card);
    });

    // Attach quick select listeners
    document.querySelectorAll(".service-action-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const treatmentName = e.currentTarget.getAttribute("data-treatment");
        const notesField = document.getElementById("clientNotes");
        if (notesField) {
          notesField.value = `Tertarik dengan layanan: ${treatmentName}`;
        }
      });
    });
  }

  renderServices("all");

  // Tab Filtering
  serviceTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      serviceTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      renderServices(tab.getAttribute("data-category"));
    });
  });

  // 3. Calculator Logic
  const calcTreatmentsContainer = document.getElementById("calcTreatments");
  const hairLengthRadios = document.querySelectorAll('input[name="hairLength"]');
  const selectedItemsList = document.getElementById("selectedItemsList");
  const estimatedTime = document.getElementById("estimatedTime");
  const estimatedCost = document.getElementById("estimatedCost");
  const sendCalcToBookingBtn = document.getElementById("sendCalcToBookingBtn");

  // Populate Calculator Checkboxes
  if (calcTreatmentsContainer) {
    treatmentsData.forEach(item => {
      const label = document.createElement("label");
      label.className = "calc-check-item";
      label.innerHTML = `
        <input type="checkbox" value="${item.id}" data-id="${item.id}">
        <div class="calc-check-info">
          <span class="calc-item-name">${item.name}</span>
          <span class="calc-item-cost">Mulai ${formatIDR(item.basePrice)}</span>
        </div>
      `;
      calcTreatmentsContainer.appendChild(label);
    });
  }

  // Handle Radio styling
  const radioLabels = document.querySelectorAll(".hair-length-options .radio-card");
  radioLabels.forEach(card => {
    card.addEventListener("click", () => {
      radioLabels.forEach(c => c.classList.remove("active"));
      card.classList.add("active");
      updateCalculator();
    });
  });

  function updateCalculator() {
    let currentMultiplier = 1;
    const selectedLength = document.querySelector('input[name="hairLength"]:checked');
    if (selectedLength) {
      currentMultiplier = parseFloat(selectedLength.getAttribute("data-multiplier")) || 1;
    }

    const checkedBoxes = document.querySelectorAll('#calcTreatments input[type="checkbox"]:checked');
    let totalCost = 0;
    let totalDuration = 0;
    const selectedList = [];

    checkedBoxes.forEach(box => {
      const treatment = treatmentsData.find(t => t.id === box.value);
      if (treatment) {
        let itemCost = treatment.basePrice;
        if (treatment.hasLengthMultiplier) {
          itemCost = Math.round(treatment.basePrice * currentMultiplier);
        }
        totalCost += itemCost;
        totalDuration += treatment.duration;
        selectedList.push({ name: treatment.name, cost: itemCost });
      }
    });

    // Render Summary
    if (selectedItemsList) {
      if (selectedList.length === 0) {
        selectedItemsList.innerHTML = `<p class="empty-hint">Belum ada layanan yang dipilih</p>`;
      } else {
        selectedItemsList.innerHTML = selectedList.map(item => `
          <div class="selected-item-row">
            <span>${item.name}</span>
            <strong>${formatIDR(item.cost)}</strong>
          </div>
        `).join("");
      }
    }

    if (estimatedTime) {
      estimatedTime.textContent = totalDuration > 0 ? `± ${totalDuration} Menit` : "0 Menit";
    }

    if (estimatedCost) {
      estimatedCost.textContent = formatIDR(totalCost);
    }

    return { totalCost, totalDuration, selectedList };
  }

  if (calcTreatmentsContainer) {
    calcTreatmentsContainer.addEventListener("change", updateCalculator);
  }

  // Calculator Send to Booking / WhatsApp
  if (sendCalcToBookingBtn) {
    sendCalcToBookingBtn.addEventListener("click", () => {
      const { totalCost, totalDuration, selectedList } = updateCalculator();
      if (selectedList.length === 0) {
        alert("Silakan pilih minimal 1 layanan treatment terlebih dahulu pada kalkulator!");
        return;
      }

      const lengthName = document.querySelector('input[name="hairLength"]:checked').nextElementSibling.textContent;
      const treatmentNames = selectedList.map(item => `• ${item.name} (${formatIDR(item.cost)})`).join("%0A");

      const waMsg = `Halo Azzura Salon & Beauty Bar! 💕%0A%0ASaya ingin booking paket perawatan dari hasil kalkulator website:%0A%0A*Panjang Rambut:* ${lengthName}%0A*Layanan Dipilih:*%0A${treatmentNames}%0A%0A*Estimasi Durasi:* ±${totalDuration} Menit%0A*Estimasi Biaya:* ${formatIDR(totalCost)}%0A%0AMohon info ketersediaan slot jadwalnya. Terima kasih!`;
      
      const waUrl = `https://wa.me/6281234567890?text=${waMsg}`;
      window.open(waUrl, "_blank");
    });
  }

  // 4. Booking Form WhatsApp Submission
  const bookingForm = document.getElementById("bookingForm");
  if (bookingForm) {
    // Set default date to tomorrow
    const dateInput = document.getElementById("bookingDate");
    if (dateInput) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dateInput.value = tomorrow.toISOString().split("T")[0];
      dateInput.min = new Date().toISOString().split("T")[0];
    }

    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("clientName").value.trim();
      const phone = document.getElementById("clientPhone").value.trim();
      const date = document.getElementById("bookingDate").value;
      const time = document.getElementById("bookingTime").value;
      const category = document.getElementById("serviceCategorySelect").value;
      const notes = document.getElementById("clientNotes").value.trim() || "-";

      if (!name || !phone || !date || !time || !category) {
        alert("Mohon lengkapi semua kolom formulir dengan benar.");
        return;
      }

      const bookingMsg = `*FORMULIR RESERVASI AZZURA SALON*%0A-------------------------------------%0A*Nama Pelanggan:* ${encodeURIComponent(name)}%0A*No. WhatsApp:* ${encodeURIComponent(phone)}%0A*Tanggal Treatment:* ${date}%0A*Jam Kedatangan:* ${time} WIB%0A*Kategori Treatment:* ${encodeURIComponent(category)}%0A*Catatan/Request:* ${encodeURIComponent(notes)}%0A-------------------------------------%0AMohon konfirmasi jadwal reservasi saya. Terima kasih Azzura Salon! ✨`;

      const waUrl = `https://wa.me/6281234567890?text=${bookingMsg}`;
      window.open(waUrl, "_blank");
    });
  }

  // 5. FAQ Accordion Interaction
  const faqQuestions = document.querySelectorAll(".faq-question");
  faqQuestions.forEach(btn => {
    btn.addEventListener("click", () => {
      const parent = btn.parentElement;
      const isActive = parent.classList.contains("active");

      // Close all other FAQs
      document.querySelectorAll(".faq-item").forEach(item => {
        item.classList.remove("active");
      });

      // Toggle current
      if (!isActive) {
        parent.classList.add("active");
      }
    });
  });

  // 6. Active Nav Link on Scroll
  window.addEventListener("scroll", () => {
    const sections = document.querySelectorAll("section[id]");
    const scrollY = window.pageYOffset;

    sections.forEach(sec => {
      const sectionHeight = sec.offsetHeight;
      const sectionTop = sec.offsetTop - 100;
      const sectionId = sec.getAttribute("id");

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelectorAll(".nav-link").forEach(link => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  });
});
