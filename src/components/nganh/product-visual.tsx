import { SmartImage } from "@/components/shared/smart-image";
import type { ArtKind } from "@/lib/data/types";
import { cn } from "@/lib/utils";
import { ProductArt } from "./product-art";

/** Ảnh thật nếu có, không thì hình minh hoạ. Luôn nằm trên nền `.v-art` để sản phẩm nổi rõ. */
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
  /** ảnh lớn ở màn hình đầu (LCP) → tải trước */
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
