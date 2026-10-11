/* eslint-disable @next/next/no-img-element -- Pre-generated responsive WebP derivatives avoid re-encoding or upscaling archived screenshots. */
import { gallery } from "@/data/gallery";
export function WorldImage({
  id,
  className = "",
  sizes = "(max-width: 800px) 100vw, 60vw",
  priority = false,
  contain = false,
}: {
  id: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  contain?: boolean;
}) {
  const image = gallery.find((item) => item.id === id);
  if (!image) return null;
  const largest = Math.max(...image.sizes);
  return (
    <img
      src={`/images/memories/${id}-${largest}.webp`}
      srcSet={image.sizes
        .map((w) => `/images/memories/${id}-${w}.webp ${w}w`)
        .join(", ")}
      sizes={sizes}
      width={image.width}
      height={image.height}
      alt={image.alt}
      className={`${className}${contain ? " image-contain" : ""}`}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      style={{ objectPosition: image.focalPosition }}
    />
  );
}
