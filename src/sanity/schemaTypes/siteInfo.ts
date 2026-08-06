import { InfoOutlineIcon } from "@sanity/icons/InfoOutline";
import { defineField, defineType } from "sanity";

export const siteInfo = defineType({
  name: "siteInfo",
  title: "Tentang Everlasting",
  type: "document",
  icon: InfoOutlineIcon,
  fields: [
    defineField({
      name: "about",
      title: "Apa itu Everlasting?",
      type: "array",
      of: [{ type: "block" }],
      description: "Muncul di halaman Profil, menjelaskan website ini ke pengunjung.",
    }),
    defineField({
      name: "vision",
      title: "Visi",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "mission",
      title: "Misi",
      type: "array",
      of: [{ type: "string" }],
      description: "Satu baris per poin misi.",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Tentang Everlasting" }),
  },
});
