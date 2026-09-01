# Portal Resmi KUA Kecamatan Tengaran

Website portal pelayanan publik modern, responsif, dan terpadu untuk **Kantor Urusan Agama (KUA) Kecamatan Tengaran**, Kementerian Agama Kabupaten Semarang, Provinsi Jawa Tengah.

Direkayasa ulang dari blogspot lama [tengarankua.blogspot.com](https://tengarankua.blogspot.com/) menjadi portal GovTech standar Kementerian Agama RI & Kemenpan-RB.

## 🌟 Fitur Utama & Peningkatan

1. **GovTech Identity & UI/UX Islami Modern**:
   - Skema warna identitas resmi Kemenag (*Emerald Green* #0B8043, *Gold Accent* #D97706, *Clean Slate*).
   - Mode Gelap (*Dark Mode*) & Mode Terang (*Light Mode*).
   - Pengatur Ukuran Font Aksesibilitas (A-, A, A+) untuk kemudahan membaca lansia / difabel.

2. **Deteksi Jam Pelayanan & Waktu Real-Time**:
   - Status kantor *Buka/Tutup/Istirahat Jumat* secara live berdasarkan jam dan hari operasional Kemenag.
   - Jam digital WIB otomatis.

3. **Widget Jadwal Sholat & Imsakiyah Otomatis**:
   - Menghitung waktu sholat (Subuh, Dzuhur, Ashar, Maghrib, Isya) akurat khusus wilayah Tengaran & Kab. Semarang dengan fallback offline.

4. **Interactive Marriage Requirement Simulator (Cek Syarat Berkas Nikah)**:
   - Pengguna memilih kondisi: WNI / WNA, lokasi akad (Balai KUA Rp0 vs Luar KUA Rp600rb), domisili (warga Tengaran vs numpang nikah), usia (<19 th dispensasi PA vs <21 th izin N5), status duda/janda, dan profesi TNI/POLRI.
   - Menghasilkan daftar checklist berkas spesifik seketika lengkap dengan tombol **Cetak Checklist Dokumen**.

5. **Katalog Standar Pelayanan Lengkap**:
   - Tab filter (Nikah & Rujuk, Kemasjidan SIMAS, Haji & Umrah, Wakaf & ZIS, Halal UMKM).
   - Modal detail interaktif untuk setiap layanan memuat syarat berkas, alur langkah demi langkah, biaya PNBP transparan, dan estimasi waktu.

6. **SIMAS & ID Masjid Hub**:
   - Panduan 4 langkah pendaftaran ID Masjid & Musholla ke portal Sistem Informasi Masjid (SIMAS) Kemenag RI.
   - Layanan kalibrasi dan pengukuran arah kiblat.

7. **Direktori Struktur Kepegawaian (11 Personil)**:
   - Profil Kepala KUA (**H. Muslih, S.Ag., M.H.**), Penghulu Fungsional, Pelaksana/Operator, dan 6 Penyuluh Agama (Islam & Buddha).

8. **Berita, Edukasi Perkawinan & Artikel Keagamaan**:
   - Modul pencarian artikel, filter kategori, dan modal pembaca artikel yang nyaman dengan tombol share WhatsApp.

9. **Helpdesk WhatsApp Direct Router**:
   - Formulir pesan otomatis WhatsApp yang memformat nama, asal desa, topik layanan, dan pertanyaan langsung ke hotline KUA.

10. **Survei Kepuasan Masyarakat (SKM)**:
    - Formulir indeks kepuasan publik digital.

---

## 📁 Struktur Berkas

```text
kua-tengaran-web/
├── index.html              # Halaman utama portal
├── README.md               # Dokumentasi proyek
├── assets/
│   ├── css/
│   │   └── custom.css      # Styling khusus, animasi, glassmorphism & print style
│   ├── js/
│   │   └── app.js          # Logika interaktif, simulator, jadwal sholat, filter
│   └── images/             # Folder aset gambar lokal
└── data/
    └── kua_data.json       # Database terstruktur (Profil, Layanan, Pegawai, Berita, FAQ)
```

## 🚀 Cara Menjalankan & Preview

Cukup buka berkas `index.html` di browser apa pun (Google Chrome, Microsoft Edge, Safari, Firefox), atau jalankan local server:

```bash
# Menggunakan Node.js / npx serve
npx serve .

# Atau Python
python -m http.server 3000
```
