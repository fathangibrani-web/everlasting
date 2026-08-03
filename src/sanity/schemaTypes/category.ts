import { TagIcon } from "@sanity/icons/Tag";
import { defineField, defineType } from "sanity";

export const category = defineType({
  name: "category",
  title: "Genre / Kategori",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      title: "Nama Genre",
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
      name: "description",
      title: "Deskripsi Singkat",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "color",
      title: "Warna Aksen",
      type: "string",
      description: "Nama warna Tailwind, contoh: rose, blue, emerald, amber",
      options: {
        list: [
          { title: "Rose", value: "rose" },
          { title: "Blue", value: "blue" },
          { title: "Emerald", value: "emerald" },
          { title: "Amber", value: "amber" },
          { title: "Violet", value: "violet" },
          { title: "Cyan", value: "cyan" },
        ],
      },
      initialValue: "rose",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "description" },
  },
});
