import Image from "next/image";
import { PortableText, type PortableTextComponents } from "next-sanity";

import { urlForImage } from "@/sanity/lib/image";

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      return (
        <figure>
          <div className="relative aspect-video w-full overflow-hidden rounded-xl">
            <Image
              src={urlForImage(value).width(1200).url()}
              alt={value.alt || ""}
              fill
              sizes="(max-width: 768px) 100vw, 700px"
              className="object-cover"
            />
          </div>
          {value.caption && <figcaption>{value.caption}</figcaption>}
        </figure>
      );
    },
  },
};

export default function PortableTextRenderer({
  value,
}: {
  value: Parameters<typeof PortableText>[0]["value"];
}) {
  return (
    <div className="prose-article max-w-none text-neutral-700 dark:text-neutral-300">
      <PortableText value={value} components={components} />
    </div>
  );
}
