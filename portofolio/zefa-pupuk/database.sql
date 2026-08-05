-- ====================================================
-- DATABASE SETUP: ZEFA MULIA SEJAHTERA
-- Jalankan file ini di phpMyAdmin RumahWeb
-- ====================================================

CREATE DATABASE IF NOT EXISTS `zefa_pupuk` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `zefa_pupuk`;

-- Tabel Reseller
CREATE TABLE IF NOT EXISTS `resellers` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `slug` VARCHAR(100) NOT NULL UNIQUE COMMENT 'URL path (contoh: eko, budi)',
    `nama` VARCHAR(255) NOT NULL,
    `wa_number` VARCHAR(20) NOT NULL COMMENT 'Format: 628xxx',
    `wa_message` TEXT COMMENT 'Pesan WA custom untuk reseller ini',
    `kota` VARCHAR(100) DEFAULT NULL,
    `aktif` TINYINT(1) DEFAULT 1 COMMENT '1=aktif, 0=nonaktif',
    `total_klik` INT DEFAULT 0 COMMENT 'Tracking klik CTA WA',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_slug` (`slug`),
    INDEX `idx_aktif` (`aktif`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabel Admin Sessions (opsional, untuk keamanan tambahan)
CREATE TABLE IF NOT EXISTS `admin_logs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `action` VARCHAR(255) NOT NULL,
    `detail` TEXT,
    `ip_address` VARCHAR(45),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabel Site Settings (nomor WA default, dll)
CREATE TABLE IF NOT EXISTS `settings` (
    `key_name` VARCHAR(100) PRIMARY KEY,
    `value` TEXT,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default settings
INSERT INTO `settings` (`key_name`, `value`) VALUES
('default_wa_number', '6285727289279'),
('default_wa_message', 'Halo Zefa Mulia Sejahtera, saya tertarik dengan produk pupuk Anda. Boleh minta info lebih lanjut?'),
('site_name', 'Zefa Mulia Sejahtera'),
('admin_password_hash', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi') -- password: godmode
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`);

-- Contoh data reseller untuk testing
INSERT INTO `resellers` (`slug`, `nama`, `wa_number`, `wa_message`, `kota`) VALUES
('demo', 'Demo Reseller', '6281234567890', 'Halo, saya mau tanya tentang produk pupuk Zefa. Apakah masih tersedia?', 'Jakarta')
ON DUPLICATE KEY UPDATE `nama` = VALUES(`nama`);
