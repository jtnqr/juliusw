# Aplikasi Data Mahasiswa (Fullstack)

Aplikasi CRUD (Create, Read, Update, Delete) lengkap untuk mengelola data mahasiswa. Terdiri dari Frontend menggunakan React (dengan Tailwind CSS) dan Backend menggunakan Node.js (Express & MySQL).

## Fitur

-   **Frontend**: React, TypeScript, Tailwind CSS, Lucide Icons.
-   **Backend**: Node.js, Express.js.
-   **Database**: MySQL.
-   **Fungsionalitas**:
    -   Melihat daftar mahasiswa.
    -   Menambah data mahasiswa baru.
    -   Mengedit data yang sudah ada.
    -   Menghapus data mahasiswa.
    -   Pencarian dan Sorting.
    -   Validasi NPM (8 digit angka).

## Prasyarat

Sebelum menjalankan aplikasi, pastikan Anda telah menginstal:
1.  **Node.js** (versi 16 atau lebih baru).
2.  **MySQL Server** (bisa menggunakan XAMPP, Laragon, atau install manual).

## Instalasi & Konfigurasi

### 1. Setup Database

1.  Buat file `.env` di root folder (bisa copy dari `.env.example`). Sesuaikan kredensial database Anda jika berbeda:
    ```env
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=
    DB_NAME=kampus_db
    PORT=3000
    ```
2.  Jalankan aplikasi manajemen database Anda (phpMyAdmin, DBeaver, atau Terminal).
3.  Import file `database.sql` untuk membuat database dan tabel yang diperlukan, serta mengisi data awal.
    -   Atau jalankan query yang ada di dalam `database.sql` secara manual.

### 2. Setup Aplikasi

Buka terminal di root folder project, lalu jalankan perintah berikut:

1.  **Install dependensi**:
    ```bash
    npm install
    ```

2.  **Jalankan Server**:
    ```bash
    npm start
    ```
    Perintah ini akan menjalankan server Node.js pada port yang ditentukan (default: 3000). Server ini sekaligus akan melayani file frontend statis.

3.  **Buka Aplikasi**:
    Buka browser dan kunjungi `http://localhost:3000`.

## Struktur Project

-   `server.js`: Entry point untuk backend Express server.
-   `App.tsx` & `components/`: Kode sumber Frontend React.
-   `database.sql`: Skema database MySQL.
-   `index.html`: File HTML utama.

## Pengembangan

Jika Anda ingin mengubah kode server dan ingin restart otomatis saat save:
```bash
npm run dev
```
(Membutuhkan Node.js v18.11+ untuk fitur `--watch`)
