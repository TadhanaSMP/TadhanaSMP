"use client";
/* eslint-disable @next/next/no-img-element -- Curated responsive derivatives are already optimized and should not be upscaled. */
import { useState, useMemo, useRef } from "react";
import { Search, X, ArrowLeft, ArrowRight, Expand } from "lucide-react";
import {
  gallery,
  galleryCategories,
  type GalleryImage,
  type GalleryCategory,
} from "@/data/gallery";
export function Gallery() {
  const [category, setCategory] = useState<GalleryCategory | "All">("All"),
    [search, setSearch] = useState(""),
    [selected, setSelected] = useState<GalleryImage | null>(null);
  const dialog = useRef<HTMLDialogElement>(null),
    trigger = useRef<HTMLButtonElement | null>(null),
    touchStart = useRef<number | null>(null);
  const images = useMemo(
    () =>
      gallery.filter(
        (image) =>
          image.visible &&
          (category === "All" || image.category === category) &&
          `${image.title} ${image.caption} ${image.category}`
            .toLowerCase()
            .includes(search.trim().toLowerCase()),
      ),
    [category, search],
  );
  const current = selected
    ? images.findIndex((image) => image.id === selected.id)
    : -1;
  function step(direction: number) {
    if (images.length)
      setSelected(
        images[(current + direction + images.length) % images.length],
      );
  }
  return (
    <>
      <div className="gallery-tools">
        <div
          className="gallery-filters"
          role="group"
          aria-label="Filter memories"
        >
          {(["All", ...galleryCategories] as const).map((name) => (
            <button
              key={name}
              aria-pressed={category === name}
              onClick={() => setCategory(name)}
            >
              {name}
            </button>
          ))}
        </div>
        <label className="gallery-search">
          <Search size={18} />
          <span className="sr-only">Search memories</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Find a memory…"
          />
        </label>
      </div>
      <p className="gallery-count" role="status">
        {images.length} {images.length === 1 ? "memory" : "memories"}
        {category !== "All" ? ` / ${category}` : ""}
      </p>
      {images.length ? (
        <div className="gallery-grid">
          {images.map((image, index) => (
            <figure
              key={image.id}
              className={`gallery-item gallery-${image.category.toLowerCase()}`}
              data-reveal
            >
              <button
                onClick={(event) => {
                  trigger.current = event.currentTarget;
                  setSelected(image);
                  dialog.current?.showModal();
                }}
                aria-label={`Open ${image.title}`}
              >
                <img
                  src={`/images/memories/${image.id}-640.webp`}
                  srcSet={image.sizes
                    .filter((size) => size <= 1280)
                    .map(
                      (size) =>
                        `/images/memories/${image.id}-${size}.webp ${size}w`,
                    )
                    .join(", ")}
                  sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw"
                  width={image.width}
                  height={image.height}
                  alt={image.alt}
                  loading="lazy"
                  style={{ objectPosition: image.focalPosition }}
                />
                <span className="gallery-expand">
                  <Expand size={18} />
                </span>
                <span className="gallery-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </button>
              <figcaption>
                <span>{image.category}</span>
                <h2>{image.title}</h2>
                <p>{image.caption}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Search size={28} />
          <h2>No memories match that search.</h2>
          <p>Try another word or explore the full collection.</p>
          <button
            className="button button-ghost"
            onClick={() => {
              setSearch("");
              setCategory("All");
            }}
          >
            Reset filters
          </button>
        </div>
      )}
      <dialog
        className="lightbox"
        ref={dialog}
        aria-labelledby="lightbox-title"
        onClose={() => {
          setSelected(null);
          trigger.current?.focus();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            step(1);
          }
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            step(-1);
          }
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <div className="lightbox-top">
          <span aria-live="polite">
            {current + 1} / {images.length}
          </span>
          <button
            className="icon-button"
            aria-label="Close image"
            onClick={() => dialog.current?.close()}
          >
            <X />
          </button>
        </div>
        {selected && (
          <>
            <div
              className="lightbox-image"
              onTouchStart={(e) => {
                touchStart.current = e.touches[0].clientX;
              }}
              onTouchEnd={(e) => {
                if (touchStart.current !== null) {
                  const delta =
                    e.changedTouches[0].clientX - touchStart.current;
                  if (Math.abs(delta) > 60) step(delta < 0 ? 1 : -1);
                }
                touchStart.current = null;
              }}
            >
              <img
                src={`/images/memories/${selected.id}-${Math.max(...selected.sizes)}.webp`}
                width={selected.width}
                height={selected.height}
                alt={selected.alt}
              />
            </div>
            <div className="lightbox-bottom">
              <button
                className="icon-button"
                onClick={() => step(-1)}
                aria-label="Previous image"
              >
                <ArrowLeft />
              </button>
              <div aria-live="polite">
                <h2 id="lightbox-title">{selected.title}</h2>
                <p>{selected.caption}</p>
              </div>
              <button
                className="icon-button"
                onClick={() => step(1)}
                aria-label="Next image"
              >
                <ArrowRight />
              </button>
            </div>
          </>
        )}
      </dialog>
    </>
  );
}
