-- Ù‚Ø§Ø¹Ø¯Ø© Ø¨ÙŠØ§Ù†Ø§Øª Ø¨ÙŠØª Ø§Ù„Ø­ÙŠØ§ÙŠØ§ - MySQL
-- ØªØ´ØºÙŠÙ„: mysql -u root -p < server/database/schema.sql
-- Ø£Ùˆ Ø§Ø³ØªÙŠØ±Ø§Ø¯ Ù…Ù† Ø£Ø¯ÙˆØ§Øª Ø¥Ø¯Ø§Ø±Ø© MySQL

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE DATABASE IF NOT EXISTS semo_reptile_house CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE semo_reptile_house;

-- Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù…ÙˆÙ†
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role ENUM('admin','manager','editor','user') NOT NULL DEFAULT 'user',
  avatar_url VARCHAR(512) DEFAULT NULL,
  password_hash VARCHAR(128) DEFAULT NULL,
  password_salt VARCHAR(64) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª (Ø²ÙˆØ§Ø­Ù)
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  species VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(12,2) NOT NULL DEFAULT 0,
  image_url VARCHAR(1024) NOT NULL DEFAULT '',
  rating DECIMAL(3,2) NOT NULL DEFAULT 5,
  is_available TINYINT(1) NOT NULL DEFAULT 1,
  status VARCHAR(32) NOT NULL DEFAULT 'Ù…ØªÙˆÙØ±',
  category VARCHAR(32) NOT NULL,
  specifications JSON,
  reviews JSON,
  care_instructions TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ø§Ù„Ø·Ù„Ø¨Ø§Øª
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(64) PRIMARY KEY,
  date VARCHAR(32) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'Ù‚ÙŠØ¯ Ø§Ù„Ù…Ø¹Ø§Ù„Ø¬Ø©',
  total DECIMAL(12,2) NOT NULL DEFAULT 0,
  payment_confirmation_image VARCHAR(1024) DEFAULT NULL,
  payment_method VARCHAR(32) DEFAULT NULL,
  payment_verification_status VARCHAR(32) NOT NULL DEFAULT 'Ù‚ÙŠØ¯ Ø§Ù„Ù…Ø±Ø§Ø¬Ø¹Ø©',
  rejection_reason TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ø¹Ù†Ø§ØµØ± Ø§Ù„Ø·Ù„Ø¨
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id VARCHAR(64) NOT NULL,
  reptile_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  price DECIMAL(12,2) NOT NULL,
  image_url VARCHAR(1024) DEFAULT '',
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  INDEX idx_order (order_id)
);

-- Ø§Ù„Ù…Ù‚Ø§Ù„Ø§Øª
CREATE TABLE IF NOT EXISTS articles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT,
  content LONGTEXT,
  category VARCHAR(64) NOT NULL,
  date VARCHAR(32) NOT NULL,
  author VARCHAR(255) NOT NULL,
  image VARCHAR(1024) NOT NULL DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ø§Ù„Ù…Ø³ØªÙ„Ø²Ù…Ø§Øª
CREATE TABLE IF NOT EXISTS supplies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(64) NOT NULL,
  description TEXT,
  price DECIMAL(12,2) NOT NULL DEFAULT 0,
  image_url VARCHAR(1024) NOT NULL DEFAULT '',
  rating DECIMAL(3,2) NOT NULL DEFAULT 5,
  is_available TINYINT(1) NOT NULL DEFAULT 1,
  status VARCHAR(32) NOT NULL DEFAULT 'Ù…ØªÙˆÙØ±',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ø´Ø±Ø§Ø¦Ø­ Ø§Ù„Ù‡ÙŠØ±Ùˆ
CREATE TABLE IF NOT EXISTS hero_slides (
  id VARCHAR(64) PRIMARY KEY,
  image VARCHAR(1024) NOT NULL DEFAULT '',
  title VARCHAR(255) NOT NULL,
  subtitle TEXT,
  button_text VARCHAR(128) NOT NULL DEFAULT '',
  link VARCHAR(255) NOT NULL DEFAULT '',
  active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ø§Ù„Ø¹Ù†Ø§ÙˆÙŠÙ†
CREATE TABLE IF NOT EXISTS addresses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  label VARCHAR(128) NOT NULL,
  street VARCHAR(512) NOT NULL,
  city VARCHAR(128) NOT NULL,
  country VARCHAR(128) NOT NULL,
  is_default TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ù…Ø¹Ù„ÙˆÙ…Ø§Øª Ø§Ù„Ø´Ø±ÙƒØ© (ØµÙ ÙˆØ§Ø­Ø¯)
CREATE TABLE IF NOT EXISTS company_info (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL DEFAULT '',
  name_english VARCHAR(255) NOT NULL DEFAULT '',
  description TEXT,
  founded_year INT DEFAULT NULL,
  mission TEXT,
  vision TEXT,
  story TEXT,
  logo_url VARCHAR(1024) DEFAULT NULL,
  mascot_url VARCHAR(1024) DEFAULT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Ù…Ø¹Ù„ÙˆÙ…Ø§Øª Ø§Ù„ØªÙˆØ§ØµÙ„ (ØµÙ ÙˆØ§Ø­Ø¯)
CREATE TABLE IF NOT EXISTS contact_info (
  id INT AUTO_INCREMENT PRIMARY KEY,
  phone VARCHAR(64) NOT NULL DEFAULT '',
  email VARCHAR(255) NOT NULL DEFAULT '',
  address VARCHAR(512) NOT NULL DEFAULT '',
  city VARCHAR(128) NOT NULL DEFAULT '',
  country VARCHAR(128) NOT NULL DEFAULT '',
  working_hours VARCHAR(255) NOT NULL DEFAULT '',
  social_media JSON,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª Ø´Ø§Ù… ÙƒØ§Ø´ (ØµÙ ÙˆØ§Ø­Ø¯)
CREATE TABLE IF NOT EXISTS shamcash_config (
  id INT AUTO_INCREMENT PRIMARY KEY,
  barcode_image_url VARCHAR(1024) NOT NULL DEFAULT '',
  account_code VARCHAR(64) NOT NULL DEFAULT '',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  account_holder_name VARCHAR(255) NOT NULL DEFAULT '',
  phone_number VARCHAR(64) NOT NULL DEFAULT '',
  payment_instructions TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- SEO settings (single row)
CREATE TABLE IF NOT EXISTS seo_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  site_name VARCHAR(255) NOT NULL DEFAULT 'Reptile House',
  default_title VARCHAR(255) NOT NULL DEFAULT 'بيت الزواحف | متجر الزواحف والمستلزمات',
  title_separator VARCHAR(16) NOT NULL DEFAULT '|',
  default_description TEXT,
  default_keywords TEXT,
  canonical_base_url VARCHAR(1024) NOT NULL DEFAULT 'http://localhost:5173',
  default_og_image VARCHAR(1024) DEFAULT '',
  twitter_handle VARCHAR(64) DEFAULT '',
  robots_index TINYINT(1) NOT NULL DEFAULT 1,
  robots_follow TINYINT(1) NOT NULL DEFAULT 1,
  google_verification VARCHAR(255) DEFAULT '',
  bing_verification VARCHAR(255) DEFAULT '',
  yandex_verification VARCHAR(255) DEFAULT '',
  locale VARCHAR(16) NOT NULL DEFAULT 'ar_SY',
  theme_color VARCHAR(16) NOT NULL DEFAULT '#0f172a',
  organization_name VARCHAR(255) NOT NULL DEFAULT 'Reptile House',
  organization_logo VARCHAR(1024) DEFAULT '',
  organization_description TEXT,
  sitemap_enabled TINYINT(1) NOT NULL DEFAULT 1,
  excluded_paths TEXT,
  custom_robots_txt TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Ø£Ø¹Ø¶Ø§Ø¡ Ø§Ù„ÙØ±ÙŠÙ‚
CREATE TABLE IF NOT EXISTS team_members (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  image_url VARCHAR(1024) NOT NULL DEFAULT '',
  bio TEXT,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ù…Ø¬Ù…ÙˆØ¹Ø§Øª Ø§Ù„ÙÙ„Ø§ØªØ±
CREATE TABLE IF NOT EXISTS filter_groups (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(32) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  applies_to VARCHAR(32) NOT NULL DEFAULT 'products',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ø®ÙŠØ§Ø±Ø§Øª Ø§Ù„ÙÙ„ØªØ±
CREATE TABLE IF NOT EXISTS filter_options (
  id VARCHAR(64) PRIMARY KEY,
  filter_group_id VARCHAR(64) NOT NULL,
  name VARCHAR(255) NOT NULL,
  value VARCHAR(255) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0,
  FOREIGN KEY (filter_group_id) REFERENCES filter_groups(id) ON DELETE CASCADE,
  INDEX idx_group (filter_group_id)
);

-- Ø§Ù„ØªØµÙ†ÙŠÙØ§Øª Ø§Ù„Ù…Ø®ØµØµØ©
CREATE TABLE IF NOT EXISTS custom_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  value VARCHAR(64) NOT NULL,
  label VARCHAR(255) NOT NULL,
  UNIQUE KEY uq_value (value)
);

-- Ø§Ù„Ø£Ù†ÙˆØ§Ø¹ Ø§Ù„Ù…Ø®ØµØµØ©
CREATE TABLE IF NOT EXISTS custom_species (
  id INT AUTO_INCREMENT PRIMARY KEY,
  species VARCHAR(255) NOT NULL,
  UNIQUE KEY uq_species (species(191))
);

-- Ø§Ù„Ø³ÙŠØ§Ø³Ø§Øª
CREATE TABLE IF NOT EXISTS policies (
  id VARCHAR(64) PRIMARY KEY,
  type VARCHAR(32) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content LONGTEXT NOT NULL,
  last_updated VARCHAR(32) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  icon VARCHAR(128) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ø§Ù„Ø¹Ø±ÙˆØ¶ Ø§Ù„ØªØ±ÙˆÙŠØ¬ÙŠØ©
CREATE TABLE IF NOT EXISTS offers (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(1024) NOT NULL DEFAULT '',
  discount_percentage INT DEFAULT NULL,
  start_date VARCHAR(32) NOT NULL,
  end_date VARCHAR(32) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  target_category VARCHAR(32) DEFAULT NULL,
  button_text VARCHAR(128) DEFAULT NULL,
  button_link VARCHAR(512) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول الخدمات
CREATE TABLE IF NOT EXISTS services (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(1024) NOT NULL DEFAULT '',
  icon VARCHAR(64) DEFAULT NULL,
  price DECIMAL(10, 2) DEFAULT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_sort_order (sort_order),
  INDEX idx_published (is_published)
);

-- Ù…Ø­ØªÙˆÙ‰ Ø§Ù„ØµÙØ­Ø§Øª (CMS)
CREATE TABLE IF NOT EXISTS page_contents (
  id VARCHAR(64) PRIMARY KEY,
  slug VARCHAR(128) NOT NULL,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT,
  content LONGTEXT NOT NULL,
  seo_title VARCHAR(255) DEFAULT NULL,
  seo_description TEXT,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_page_contents_slug (slug)
);


-- مكتبة الوسائط مع ميزات متقدمة
CREATE TABLE IF NOT EXISTS media_items (
  id VARCHAR(64) PRIMARY KEY,
  url TEXT NOT NULL,
  name VARCHAR(255) NOT NULL,
  size VARCHAR(32) NOT NULL,
  file_type VARCHAR(16) DEFAULT 'image',
  mime_type VARCHAR(64) DEFAULT NULL,
  alt_text VARCHAR(255) DEFAULT NULL,
  description TEXT DEFAULT NULL,
  category VARCHAR(64) DEFAULT NULL,
  folder_id VARCHAR(64) DEFAULT NULL,
  date VARCHAR(32) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_name (name(191)),
  INDEX idx_category (category),
  INDEX idx_folder (folder_id),
  INDEX idx_date (date)
);

-- مجلدات الوسائط
CREATE TABLE IF NOT EXISTS media_folders (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  parent_id VARCHAR(64) DEFAULT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES media_folders(id) ON DELETE CASCADE,
  INDEX idx_parent (parent_id)
);

-- تفضيلات المستخدم (UI)
CREATE TABLE IF NOT EXISTS user_preferences (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(64) DEFAULT 'default',
  theme VARCHAR(16) NOT NULL DEFAULT 'dark',
  language VARCHAR(8) NOT NULL DEFAULT 'ar',
  notifications_enabled TINYINT(1) NOT NULL DEFAULT 1,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_user_prefs (user_id)
);

-- Ø¥Ø¯Ø±Ø§Ø¬ ØµÙ Ø§ÙØªØ±Ø§Ø¶ÙŠ Ù„Ù„Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª Ø§Ù„Ø£Ø­Ø§Ø¯ÙŠØ©
INSERT IGNORE INTO company_info (id, name, name_english) VALUES (1, 'Reptile House', 'Reptile House');
INSERT IGNORE INTO contact_info (id, phone, email, address, city, country, working_hours) VALUES (1, '+963 XXX XXX XXX', 'info@reptilehouse.sy', 'Ø¯Ù…Ø´Ù‚ØŒ Ø³ÙˆØ±ÙŠØ§', 'Ø¯Ù…Ø´Ù‚', 'Ø³ÙˆØ±ÙŠØ§', 'Ø§Ù„Ø³Ø¨Øª - Ø§Ù„Ø®Ù…ÙŠØ³: 9:00 - 20:00');
INSERT IGNORE INTO shamcash_config (id, account_code, payment_instructions) VALUES (1, '000000000000', 'Ù‚Ù… Ø¨Ù…Ø³Ø­ Ø§Ù„Ø¨Ø§Ø±ÙƒÙˆØ¯ Ø£Ùˆ Ø¥Ø¯Ø®Ø§Ù„ Ø±Ù‚Ù… Ø§Ù„Ø­Ø³Ø§Ø¨ ÙŠØ¯ÙˆÙŠØ§Ù‹.');
INSERT IGNORE INTO seo_settings (id) VALUES (1);
INSERT IGNORE INTO user_preferences (id, user_id, theme, language, notifications_enabled) VALUES (1, 'default', 'dark', 'ar', 1);

SET FOREIGN_KEY_CHECKS = 1;
