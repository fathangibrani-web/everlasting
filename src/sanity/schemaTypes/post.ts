import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { defineField, defineType } from "sanity";

export const post = defineType({
  name: "post",
  title: "Artikel",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "title",
      title: "Judul",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "mainImage",
      title: "Gambar Utama",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt text",
        },
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Genre / Kategori",
      type: "reference",
      to: [{ type: "category" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "author",
      title: "Penulis",
      type: "reference",
      to: [{ type: "author" }],
    }),
    defineField({
      name: "excerpt",
      title: "Ringkasan",
      type: "text",
      rows: 3,
      description: "Muncul di kartu artikel dan hasil pencarian",
      validation: (rule) => rule.max(220),
    }),
    defineField({
      name: "deck",
      title: "Deck (subjudul)",
      type: "text",
      rows: 2,
      description:
        "Satu kalimat di bawah judul, di halaman artikel. Kalau kosong, pakai Ringkasan.",
      validation: (rule) => rule.max(160),
    }),
    defineField({
      name: "publishedAt",
      title: "Tanggal Terbit",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "featured",
      title: "Jadikan Artikel Unggulan",
      type: "boolean",
      description: "Tampilkan besar di bagian atas Home",
      initialValue: false,
    }),
    defineField({
      name: "body",
      title: "Isi Artikel",
      type: "blockContent",
    }),
    defineField({
      name: "nextRead",
      title: "Baca Berikutnya (opsional)",
      type: "reference",
      to: [{ type: "post" }],
      description:
        "Artikel yang disarankan setelah ini. Kalau kosong, sistem pilih otomatis dari genre yang sama.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "mainImage",
      subtitle: "category.title",
    },
  },
});
