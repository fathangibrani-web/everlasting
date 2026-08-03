# Everlasting

Website artikel bergambar seputar mindset, intelek, dan wawasan Islami, dibangun dengan **Next.js 16** (App Router) + **Sanity** (CMS untuk menulis & upload gambar) + siap deploy ke **Vercel**.

Fitur:

- **Home** — artikel unggulan besar di atas + grid artikel terbaru
- **Genre Artikel** — bank artikel dikelompokkan per kategori/genre
- **Profil** — foto, bio, dan sosial media kamu
- Setiap artikel bergambar, dengan halaman detail lengkap (gambar sampul, isi kaya teks + gambar inline, artikel terkait)
- Bisa terus posting artikel baru lewat **Sanity Studio** tanpa perlu deploy ulang

## 1. Hubungkan ke Sanity (sekali saja)

1. Buka [sanity.io/manage](https://sanity.io/manage) → **Create project**. Pakai dataset bernama `production`.
2. Salin **Project ID** yang muncul.
3. Buka file `.env.local` di root project ini, isi:

   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=project-id-kamu
   NEXT_PUBLIC_SANITY_DATASET=production
   NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
   ```

4. Jalankan project:

   ```bash
   npm run dev
   ```

5. Buka `http://localhost:3000/studio` — di sinilah kamu menulis artikel, mengatur genre, dan mengisi profil. Studio ini ikut ter-deploy bersama website (tidak perlu hosting terpisah).

6. Isi dulu:
   - **Profil Saya** (dokumen singleton) — foto, nama, bio, sosial media.
   - Beberapa **Genre / Kategori** (mis. Berita, Teknologi, Olahraga).
   - Artikel pertamamu di menu **Artikel** — jangan lupa isi gambar utama & pilih genre.

## 2. Deploy ke Vercel

1. Push project ini ke GitHub (lihat perintah di bawah).
2. Di [vercel.com](https://vercel.com) → **Add New Project** → import repo GitHub-mu.
3. Saat konfigurasi, tambahkan Environment Variables yang sama seperti `.env.local`:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
   - `NEXT_PUBLIC_SANITY_API_VERSION`
4. Deploy. Setelah selesai kamu akan dapat URL seperti `https://nama-kamu.vercel.app`.
5. Kembali ke [sanity.io/manage](https://sanity.io/manage) → project kamu → **API** → **CORS Origins** → tambahkan URL Vercel kamu (dan `http://localhost:3000` untuk development) supaya Studio bisa menyimpan data dari domain tersebut.

## 3. Push ke GitHub

Repo: https://github.com/fathangibrani-web/everlasting

```bash
git add .
git commit -m "Pesan commit kamu"
git push
```

## Struktur penting

- `src/app/(site)/` — halaman publik (Home, Genre, Artikel, Profil)
- `src/app/(studio)/studio/` — Sanity Studio, otomatis ikut ter-deploy di `/studio`
- `src/sanity/schemaTypes/` — struktur data: `post` (artikel), `category` (genre), `profile`
- `src/components/` — Navbar, Footer, ArticleCard, dll.

## Menambah genre baru

Tinggal buka `/studio` → **Genre / Kategori** → **Create**. Tidak perlu ubah kode — navbar & halaman genre otomatis menyesuaikan.

## Perintah lain

```bash
npm run dev      # development
npm run build    # build produksi (jalankan ini untuk cek sebelum deploy)
npm run lint     # cek kualitas kode
```
