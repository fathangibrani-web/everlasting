import { UserIcon } from "@sanity/icons/User";
import { defineField, defineType } from "sanity";

export const profile = defineType({
  name: "profile",
  title: "Profil Saya",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "name",
      title: "Nama",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline / Jabatan",
      type: "string",
      description: 'Contoh: "Penulis & Jurnalis Lepas"',
    }),
    defineField({
      name: "photo",
      title: "Foto Profil",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
    }),
    defineField({
      name: "socials",
      title: "Sosial Media",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "platform",
              title: "Platform",
              type: "string",
              options: {
                list: [
                  "Instagram",
                  "Twitter / X",
                  "GitHub",
                  "LinkedIn",
                  "YouTube",
                  "TikTok",
                  "Facebook",
                  "Website",
                ],
              },
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
            }),
          ],
          preview: {
            select: { title: "platform", subtitle: "url" },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "tagline", media: "photo" },
  },
});
