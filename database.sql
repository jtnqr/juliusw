-- 1. Buat Database
CREATE DATABASE IF NOT EXISTS labti_rpl2;

-- 2. Gunakan Database
USE labti_rpl2;

-- 3. Buat Tabel
CREATE TABLE IF NOT EXISTS mahasiswa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  jurusan VARCHAR(100) NOT NULL,
  npm VARCHAR(20) NOT NULL
);

-- 4. (Opsional) Masukkan Data Dummy
INSERT INTO mahasiswa (nama, jurusan, npm) VALUES 
('Budi Santoso', 'Teknik Informatika', '20240001'),
('Siti Aminah', 'Sistem Informasi', '20240002'),
('Rudi Hermawan', 'Teknik Industri', '20240003');