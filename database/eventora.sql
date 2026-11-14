CREATE DATABASE IF NOT EXISTS eventora_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE eventora_db;

CREATE TABLE IF NOT EXISTS users (
  user_id VARCHAR(80) PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  phone VARCHAR(30) NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('customer', 'organizer', 'admin') NOT NULL DEFAULT 'customer',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS categories (
  category_id INT UNSIGNED PRIMARY KEY,
  category_name VARCHAR(80) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS venues (
  venue_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  venue_name VARCHAR(160) NOT NULL,
  address VARCHAR(255) NOT NULL,
  capacity INT UNSIGNED NOT NULL,
  facilities TEXT NULL,
  contact_info VARCHAR(190) NULL,
  booking_status ENUM('available', 'booked', 'maintenance') NOT NULL DEFAULT 'available',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS events (
  event_id VARCHAR(40) PRIMARY KEY,
  organizer_id VARCHAR(80) NULL,
  category_id INT UNSIGNED NOT NULL,
  venue_id BIGINT UNSIGNED NULL,
  event_name VARCHAR(180) NOT NULL,
  description TEXT NOT NULL,
  starts_at DATETIME NOT NULL,
  location VARCHAR(180) NOT NULL,
  ticket_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  capacity INT UNSIGNED NOT NULL,
  available_seats INT UNSIGNED NOT NULL,
  image_url VARCHAR(600) NULL,
  status ENUM('pending', 'approved', 'rejected', 'cancelled') NOT NULL DEFAULT 'approved',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_events_starts_at (starts_at),
  INDEX idx_events_location (location),
  CONSTRAINT fk_events_organizer FOREIGN KEY (organizer_id) REFERENCES users(user_id) ON DELETE SET NULL,
  CONSTRAINT fk_events_category FOREIGN KEY (category_id) REFERENCES categories(category_id),
  CONSTRAINT fk_events_venue FOREIGN KEY (venue_id) REFERENCES venues(venue_id) ON DELETE SET NULL
) ENGINE=InnoDB;

ALTER TABLE events MODIFY COLUMN status ENUM('pending', 'approved', 'rejected', 'cancelled') NOT NULL DEFAULT 'approved';

CREATE TABLE IF NOT EXISTS bookings (
  booking_id VARCHAR(80) PRIMARY KEY,
  user_id VARCHAR(80) NOT NULL,
  event_id VARCHAR(40) NOT NULL,
  quantity SMALLINT UNSIGNED NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status ENUM('pending', 'confirmed', 'cancelled') NOT NULL DEFAULT 'pending',
  booked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_bookings_event (event_id),
  CONSTRAINT fk_bookings_user FOREIGN KEY (user_id) REFERENCES users(user_id),
  CONSTRAINT fk_bookings_event FOREIGN KEY (event_id) REFERENCES events(event_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS reviews (
  review_id VARCHAR(80) PRIMARY KEY,
  booking_id VARCHAR(80) NOT NULL UNIQUE,
  user_id VARCHAR(80) NOT NULL,
  event_id VARCHAR(40) NOT NULL,
  rating TINYINT UNSIGNED NOT NULL,
  review_text VARCHAR(600) NOT NULL,
  status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  moderated_at TIMESTAMP NULL,
  CONSTRAINT chk_reviews_rating CHECK (rating BETWEEN 1 AND 5),
  CONSTRAINT uq_reviews_user_event UNIQUE (user_id, event_id),
  CONSTRAINT fk_reviews_booking FOREIGN KEY (booking_id) REFERENCES bookings(booking_id),
  CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) REFERENCES users(user_id),
  CONSTRAINT fk_reviews_event FOREIGN KEY (event_id) REFERENCES events(event_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS payments (
  payment_id VARCHAR(80) PRIMARY KEY,
  booking_id VARCHAR(80) NOT NULL UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  method ENUM('card', 'mobile_banking', 'cash_on_event', 'demo') NOT NULL DEFAULT 'demo',
  status ENUM('pending', 'paid', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
  paid_at TIMESTAMP NULL,
  CONSTRAINT fk_payments_booking FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
) ENGINE=InnoDB;

INSERT IGNORE INTO categories (category_id, category_name) VALUES
  (1, 'Technology'), (2, 'Education'), (3, 'Sports'), (4, 'Music'),
  (5, 'Business'), (6, 'Cultural'), (7, 'Entertainment'), (8, 'Workshop');

INSERT IGNORE INTO events
  (event_id, category_id, event_name, description, starts_at, location, ticket_price, capacity, available_seats, image_url)
VALUES
  ('ev-design', 1, 'The Future of Design', 'A practical look at the ideas and tools shaping tomorrow''s creative work.', '2026-12-03 18:30:00', 'Brooklyn, NY', 49.00, 180, 180, 'https://images.unsplash.com/photo-1497366754035-f200968a6e72'),
  ('ev-jazz', 4, 'Blue Note Sessions', 'An intimate evening of live jazz from rising New York musicians.', '2026-11-28 20:00:00', 'Manhattan, NY', 35.00, 120, 120, 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819'),
  ('ev-makers', 8, 'Makers & Meaning', 'Build, experiment, and share ideas in a welcoming hands-on studio.', '2026-12-11 17:30:00', 'Queens, NY', 20.00, 40, 40, 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3'),
  ('ev-ideas', 5, 'Ideas in Motion', 'A day of talks and conversations for people building what comes next.', '2026-12-18 09:00:00', 'Brooklyn, NY', 59.00, 240, 240, 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4'),
  ('ev-culture', 6, 'A Night of Stories', 'True stories, local voices, and a room full of attentive listeners.', '2027-01-09 19:00:00', 'Manhattan, NY', 28.00, 100, 100, 'https://images.unsplash.com/photo-1516280440614-37939bbacd81'),
  ('ev-tech', 1, 'Next Wave Summit', 'Meet the teams and technologies changing how we work and live.', '2027-01-21 09:00:00', 'Brooklyn, NY', 89.00, 400, 400, 'https://images.unsplash.com/photo-1540575467063-178a50c2df87'),
  ('ev-learning', 2, 'Learning in Public', 'Short, useful lessons from educators who love sharing what they know.', '2026-12-06 13:00:00', 'Queens, NY', 15.00, 70, 70, 'https://images.unsplash.com/photo-1523580494863-6f3031224c94'),
  ('ev-run', 3, 'The Riverside 5K', 'A relaxed community run with routes for first-timers and regulars.', '2026-12-20 08:00:00', 'Manhattan, NY', 25.00, 500, 500, 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211'),
  ('ev-film', 7, 'Independent Film Night', 'A screening of independent shorts followed by a filmmaker Q&A.', '2027-01-15 19:30:00', 'Brooklyn, NY', 32.00, 150, 150, 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba'),
  ('ev-founders', 5, 'Founders at Work', 'Honest conversations about the real work behind early-stage companies.', '2027-02-02 18:00:00', 'Manhattan, NY', 45.00, 200, 200, 'https://images.unsplash.com/photo-1551836022-d5d88e9218df'),
  ('ev-ceramics', 8, 'Clay After Hours', 'Try hand-building with clay in a guided, beginner-friendly workshop.', '2027-02-12 18:30:00', 'Queens, NY', 38.00, 26, 26, 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261'),
  ('ev-festival', 4, 'Winter Sound Festival', 'A full evening of live sets, food stalls, and local music makers.', '2027-02-20 16:00:00', 'Brooklyn, NY', 55.00, 800, 800, 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3');