"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
export function Motion() {
  const pathname = usePathname();
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const items = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    let observer: IntersectionObserver | undefined;
    const show = () =>
      items.forEach((item) => item.removeAttribute("data-pending"));
    const initialize = () => {
      observer?.disconnect();
      show();
      if (media.matches || !("IntersectionObserver" in window)) return;
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.removeAttribute("data-pending");
              observer?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08 },
      );
      items.forEach((item) => {
        if (item.getBoundingClientRect().top > window.innerHeight) {
          item.dataset.pending = "true";
          observer?.observe(item);
        }
      });
    };
    initialize();
    media.addEventListener("change", initialize);
    return () => {
      observer?.disconnect();
      media.removeEventListener("change", initialize);
      show();
    };
  }, [pathname]);
  return null;
}
