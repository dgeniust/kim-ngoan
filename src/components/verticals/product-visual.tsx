import { SmartImage } from "@/components/shared/smart-image";
import type { ArtKind } from "@/types/catalog";
import { cn } from "@/lib/utils";
import { ProductArt } from "@/components/shared/product-art";

/** Real photo when available, otherwise the vector illustration. Always on a `.v-art` background so the product stands out. */
export function ProductVisual({
  name,
  art,
  image,
  sizes = "(min-width: 1024px) 25vw, 50vw",
  className,
  artClassName,
  preload,
}: {
  name: string;
  art: ArtKind;
  image?: string;
  sizes?: string;
  className?: string;
  artClassName?: string;
  /** Large above-the-fold image (LCP) → preload. */
  preload?: boolean;
}) {
  return (
    <div className={cn("v-art relative overflow-hidden", className)}>
      {image ? (
        <SmartImage src={image} alt={name} fill sizes={sizes} preload={preload} className="object-cover" />
      ) : (
        <ProductArt kind={art} title={name} className={cn("absolute inset-0 m-auto size-[78%]", artClassName)} />
      )}
    </div>
  );
}
