"use client";
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { Menu, X, ChevronDown, ArrowUpRight } from "lucide-react";
import { navigation } from "@/data/navigation";
export function Navigation() {
  const dialog = useRef<HTMLDialogElement>(null),
    trigger = useRef<HTMLButtonElement>(null);
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="brand" aria-label="TadhanaSMP home">
          <Image
            src="/images/brand/wordmark.webp"
            alt="TadhanaSMP"
            width={1100}
            height={449}
            sizes="180px"
            unoptimized
          />
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map((group) => (
            <details className="nav-group" key={group.label}>
              <summary>
                {group.label}
                <ChevronDown size={14} />
              </summary>
              <div className="nav-popover">
                {group.links.map((link) => (
                  <Link
                    href={link.href}
                    key={link.href}
                    onClick={(event) => {
                      const details = event.currentTarget.closest("details");
                      if (details) details.open = false;
                    }}
                  >
                    {link.label}
                    <ArrowUpRight size={14} />
                  </Link>
                ))}
              </div>
            </details>
          ))}
        </nav>
        <Link href="/play" className="button button-small header-cta">
          How to play
          <ArrowUpRight size={15} />
        </Link>
        <button
          ref={trigger}
          className="icon-button menu-trigger"
          onClick={() => dialog.current?.showModal()}
          aria-label="Open navigation"
          aria-controls="mobile-navigation"
        >
          <Menu />
        </button>
      </div>
      <dialog
        ref={dialog}
        id="mobile-navigation"
        className="mobile-menu"
        aria-label="Site navigation"
        onClose={() => trigger.current?.focus()}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <div className="mobile-menu-top">
          <span>Find your next chapter</span>
          <button
            className="icon-button"
            aria-label="Close navigation"
            onClick={() => dialog.current?.close()}
          >
            <X />
          </button>
        </div>
        <nav aria-label="Mobile navigation">
          {navigation.map((group) => (
            <section key={group.label}>
              <h2>{group.label}</h2>
              {group.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => dialog.current?.close()}
                >
                  {link.label}
                  <ArrowUpRight size={16} />
                </Link>
              ))}
            </section>
          ))}
        </nav>
      </dialog>
    </header>
  );
}
