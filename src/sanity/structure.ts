import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Konten")
    .items([
      S.listItem()
        .title("Artikel")
        .schemaType("post")
        .child(S.documentTypeList("post").title("Artikel")),
      S.listItem()
        .title("Genre / Kategori")
        .schemaType("category")
        .child(S.documentTypeList("category").title("Genre / Kategori")),
      S.listItem()
        .title("Penulis")
        .schemaType("author")
        .child(S.documentTypeList("author").title("Penulis")),
      S.divider(),
      S.listItem()
        .title("Tentang Everlasting")
        .child(
          S.document().schemaType("siteInfo").documentId("siteInfo")
        ),
    ]);
