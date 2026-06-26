# SiPadi Fuzzy

## Penerapan Fuzzy Inference System Metode Mamdani untuk Rekomendasi Kebutuhan Pupuk dan Irigasi Tanaman Padi di Kabupaten Lombok Tengah

---

## Kelompok Punk

| No. | Nama | NIM |
|-----|------|-----|
| 1 | Ayu Liza Putri Wiwaha | F1D02310003 |
| 2 | Baiq Adelia Dwi Savitri | F1D02310006 |
| 3 | Nayla Anugerah Nisa | F1D02310020 |
| 4 | Alya Dwi Pangesti | F1D02310104 |

---

## Deskripsi

SiPadi Fuzzy adalah aplikasi web yang membantu petani dan penyuluh lapangan dalam menentukan rekomendasi kebutuhan pupuk urea dan irigasi untuk tanaman padi di Kabupaten Lombok Tengah, NTB.

Aplikasi ini menggunakan model Fuzzy Inference System metode Mamdani untuk memproses kondisi lapangan berupa suhu udara, kelembapan relatif, dan tinggi genangan air. Hasilnya berupa nilai rekomendasi kebutuhan pupuk urea dan debit irigasi, serta kategori linguistik yang mudah dipahami.

Sistem ini menganalisis tiga parameter input lingkungan:

- **Suhu Udara** (15–40°C)
- **Kelembapan Relatif** (20–100%)
- **Tinggi Genangan Air** (0–30 cm)

Dan menghasilkan dua output rekomendasi:

- **Pupuk Urea** (0–300 kg/Ha)
- **Debit Irigasi** (0–5 L/s/Ha)

---

## Teknologi yang Digunakan

- **HTML5** - Struktur markup
- **CSS3** - Styling dan responsif design
- **JavaScript (ES6+)** - Logika fuzzy dan inferensi
- **Canvas API** - Visualisasi grafik fungsi keanggotaan

---

## Struktur File

```
PROJECT-LOGIKAFUZZY-PUNK/
├── index.html          # File HTML utama
├── styles.css          # Stylesheet
├── script.js           # Logika fuzzy dan inferensi
├── README.md           # Dokumentasi proyek
```

---

## Cara Menggunakan

### Membuka Aplikasi

1. Buka file `index.html` di browser modern (Chrome, Firefox, Safari, Edge)
2. Aplikasi akan langsung dapat digunakan tanpa instalasi atau setup tambahan

### Cara Kerja

1. **Sesuaikan Parameter Input**
   - Geser slider untuk mengatur Suhu, Kelembapan, dan Tinggi Genangan Air
   - Nilai akan diperbarui secara real-time

2. **Lihat Hasil Rekomendasi**
   - Kartu hasil menampilkan jumlah pupuk (kg/Ha) dan debit irigasi (L/s/Ha)
   - Kategori otomatis ditampilkan berdasarkan hasil fuzzy

3. **Gunakan Data Sampel**
   - Klik tombol "Kasus 1-5" untuk melihat contoh skenario:
     - Kasus 1: Panas-Kering
     - Kasus 2: Normal
     - Kasus 3: Sejuk-Basah
     - Kasus 4: Sangat Kering
     - Kasus 5: Sejuk-Sedang

4. **Analisis Proses**
   - Lihat grafik fungsi keanggotaan (membership function) untuk setiap variabel
   - Pelajari aturan fuzzy yang aktif pada panel "Aturan Fuzzy yang Aktif"
   - Pahami alur proses Mamdani di panel "Alur Proses Metode Fuzzy Mamdani"

---

## Metodologi Fuzzy Mamdani

Sistem mengimplementasikan 4 tahap utama:

### 1. **Fuzzifikasi**

Mengubah nilai crisp (angka biasa) menjadi derajat keanggotaan (0–1) menggunakan fungsi segitiga.

**Contoh:** Suhu 28°C → Dingin: 0.0, Sedang: 1.0, Panas: 0.0

### 2. **Aplikasi Fungsi Implikasi (MIN)**

Untuk setiap aturan, nilai α-predikat dihitung sebagai minimum dari ketiga derajat keanggotaan input.

$$α = \min(μ_{suhu}, μ_{kelembapan}, μ_{air})$$

### 3. **Komposisi Aturan (MAX)**

Daerah fuzzy keluaran dari semua aturan yang aktif (α > 0) digabungkan menggunakan operator maksimum.

### 4. **Defuzzifikasi (Centroid)**

Daerah agregat dihitung titik beratnya dengan integrasi numerik (1000 diskretisasi) untuk menghasilkan nilai crisp akhir.

$$z^* = \frac{∫ z·μ(z) \, dz}{∫ μ(z) \, dz}$$

---

## Basis Aturan Fuzzy

Sistem menggunakan **27 aturan fuzzy** yang mencakup semua kombinasi:

- 3 kategori Suhu (Dingin, Sedang, Panas)
- 3 kategori Kelembapan (Rendah, Sedang, Tinggi)
- 3 kategori Tinggi Air (Kering, Cukup, Tergenang)

**Contoh Aturan:**

- IF Suhu=Dingin AND Kelembapan=Tinggi AND Air=Tergenang THEN Pupuk=Sedikit AND Irigasi=Kecil
- IF Suhu=Panas AND Kelembapan=Rendah AND Air=Kering THEN Pupuk=Banyak AND Irigasi=Besar

---

## Fitur Utama

✅ **Input Interaktif**

- Slider untuk memasukkan parameter dengan range yang jelas
- Tampilan real-time dari nilai input

✅ **Output Visual**

- Angka rekomendasi pupuk dan irigasi
- Kategori linguistik (Sedikit/Sedang/Banyak)
- Rekomendasi naratif dalam bahasa Indonesia

✅ **Visualisasi Grafis**

- Grafik fungsi keanggotaan untuk semua variabel
- Garis indikator nilai input saat ini
- Warna yang mudah dibedakan

✅ **Transparansi Proses**

- Daftar aturan fuzzy yang aktif dengan nilai α
- Derajat keanggotaan setiap himpunan fuzzy
- Alur proses step-by-step

✅ **Data Sampel & Tabel**

- 5 skenario uji coba
- Tabel hasil perbandingan
- Alternatif masukan cepat

✅ **Responsif**

- Desain mobile-friendly
- Bekerja di berbagai ukuran layar

---

## Desain dan Interface

- **Palet Warna Hijau-Biru** - Mencerminkan tema pertanian dan air
- **Typography Profesional** - DM Serif Display (judul), Nunito (body), IBM Plex Mono (data)
- **Layout Grid** - Organisasi konten yang jelas dan rapi
- **Dark-Light Contrast** - Mudah dibaca dan nyaman dipandang

---

## Catatan Teknis

### Defuzzifikasi Centroid

- Menggunakan integrasi numerik dengan 1000 titik diskretisasi
- Memberikan hasil yang akurat dan stabil
- Proses otomatis setiap kali slider diubah

### Aturan Fuzzy

- Basis aturan diadaptasi dari penelitian Fadila (2022)
- Disesuaikan dengan kondisi iklim Lombok Tengah, NTB
- Dapat dimodifikasi untuk daerah lain

## 📝 Lisensi

Proyek ini adalah tugas besar mata kuliah Logika Fuzzy dan dapat digunakan untuk keperluan akademik.

---
