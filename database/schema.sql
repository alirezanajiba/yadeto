SET NAMES utf8mb4;
SET time_zone = '+00:00';

CREATE TABLE users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  mobile VARCHAR(15) NOT NULL,
  password_hash VARCHAR(255) NULL,
  full_name VARCHAR(120) NULL,
  email VARCHAR(190) NULL,
  timezone VARCHAR(64) NOT NULL DEFAULT 'Asia/Tehran',
  status ENUM('active','suspended','deleted') NOT NULL DEFAULT 'active',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  UNIQUE KEY uq_users_mobile (mobile),
  KEY idx_users_status_created (status, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE birthday_groups (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(80) NOT NULL,
  icon VARCHAR(60) NOT NULL DEFAULT 'users',
  is_default TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_groups_user FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE KEY uq_groups_user_name (user_id, name),
  KEY idx_groups_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE birthdays (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  group_id BIGINT UNSIGNED NULL,
  full_name VARCHAR(120) NOT NULL,
  mobile VARCHAR(15) NULL,
  jalali_year SMALLINT UNSIGNED NULL,
  jalali_month TINYINT UNSIGNED NOT NULL,
  jalali_day TINYINT UNSIGNED NOT NULL,
  gender ENUM('male','female','none') NOT NULL DEFAULT 'none',
  note TEXT NULL,
  avatar_path VARCHAR(255) NULL,
  is_favorite TINYINT(1) NOT NULL DEFAULT 0,
  next_occurrence DATE NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  CONSTRAINT fk_birthdays_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_birthdays_group FOREIGN KEY (group_id) REFERENCES birthday_groups(id) ON DELETE SET NULL,
  KEY idx_birthdays_user_next (user_id, next_occurrence, id),
  KEY idx_birthdays_user_name (user_id, full_name),
  KEY idx_birthdays_user_favorite (user_id, is_favorite, next_occurrence),
  KEY idx_birthdays_due (next_occurrence, id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE reminder_jobs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  birthday_id BIGINT UNSIGNED NOT NULL,
  channel ENUM('sms_owner','sms_birthday','push') NOT NULL,
  scheduled_at DATETIME NOT NULL,
  status ENUM('pending','processing','sent','failed','cancelled') NOT NULL DEFAULT 'pending',
  attempt_count TINYINT UNSIGNED NOT NULL DEFAULT 0,
  idempotency_key CHAR(64) NOT NULL,
  last_error VARCHAR(500) NULL,
  processed_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_jobs_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_jobs_birthday FOREIGN KEY (birthday_id) REFERENCES birthdays(id),
  UNIQUE KEY uq_jobs_idempotency (idempotency_key),
  KEY idx_jobs_dispatch (status, scheduled_at, id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE admin_audit_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  admin_id BIGINT UNSIGNED NOT NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(80) NOT NULL,
  entity_id VARCHAR(80) NULL,
  metadata_json JSON NULL,
  ip_address VARBINARY(16) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_audit_admin_created (admin_id, created_at),
  KEY idx_audit_entity (entity_type, entity_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
