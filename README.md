# Aplikasi Data Mahasiswa (Fullstack)

Aplikasi CRUD (Create, Read, Update, Delete) lengkap untuk mengelola data mahasiswa. Terdiri dari Frontend menggunakan React (Vite + TypeScript) dan Backend menggunakan Node.js (Express & MySQL).

## Fitur

- **Frontend**: React, TypeScript, Tailwind CSS, Lucide Icons (Built with Vite).
- **Backend**: Node.js, Express.js.
- **Database**: MySQL.
- **Fungsionalitas**:
  - Melihat daftar mahasiswa.
  - Menambah data mahasiswa baru.
  - Mengedit data yang sudah ada.
  - Menghapus data mahasiswa.
  - Integrasi API antara Frontend dan Backend.

## Prasyarat

Sebelum menjalankan aplikasi, pastikan Anda telah menginstal:

1.  **Node.js** (versi 18 atau lebih baru sangat disarankan).
2.  **MySQL Server** (bisa menggunakan XAMPP, Laragon, atau install manual).

## Instalasi & Konfigurasi

### 1. Setup Database

1.  Buat file `.env` di root folder. Sesuaikan kredensial database Anda:
    ```env
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=
    DB_NAME=labti_rpl2
    PORT=3000
    ```
2.  Jalankan aplikasi manajemen database Anda (phpMyAdmin, DBeaver, dll).
3.  Import file `database.sql` atau jalankan query SQL manual untuk membuat tabel `mahasiswa`.

### 2. Setup Aplikasi

Buka terminal di root folder project, lalu jalankan perintah berikut:

1.  **Install dependensi**:
    ```bash
    npm install
    ```

## Cara Menjalankan

Terdapat dua mode untuk menjalankan aplikasi ini:

### A. Mode Pengembangan (Development)

Gunakan mode ini saat Anda sedang coding atau mengedit program. Frontend dan Backend akan berjalan bersamaan dengan fitur _hot-reload_.

```bash
npm run dev
```

Aplikasi akan terbuka di: http://localhost:5173
API berjalan di background pada port 3000.

### B. Mode Produksi (Production)

Gunakan mode ini untuk mensimulasikan aplikasi siap pakai. Perintah ini akan melakukan build pada frontend React menjadi file statis, lalu dilayani sepenuhnya oleh Express server.

```bash
npm start
```

Aplikasi akan berjalan di: http://localhost:3000

## Struktur Project

- src/: Kode sumber Frontend (React components, pages, styles).
- server.js: Entry point untuk backend Express server & API.
- dist/: Hasil build/kompilasi frontend (dihasilkan otomatis).
- database.sql: Skema database MySQL.
- vite.config.ts: Konfigurasi bundler Vite & Proxy API.
