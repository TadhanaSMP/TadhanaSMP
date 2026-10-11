"use client";
import Link from "next/link";
import { useRef, useId } from "react";
import { X, ShieldCheck } from "lucide-react";
export function CookiePreferences() {
  const titleId = useId();
  const dialog = useRef<HTMLDialogElement>(null),
    trigger = useRef<HTMLButtonElement>(null);
  return (
    <>
      <button
        ref={trigger}
        className="text-button"
        onClick={() => dialog.current?.showModal()}
      >
        Cookie preferences
      </button>
      <dialog
        className="preferences-dialog"
        ref={dialog}
        aria-labelledby={titleId}
        onClose={() => trigger.current?.focus()}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        <div className="dialog-top">
          <ShieldCheck />
          <button
            className="icon-button"
            aria-label="Close cookie preferences"
            onClick={() => dialog.current?.close()}
          >
            <X />
          </button>
        </div>
        <h2 id={titleId}>Your privacy, clearly.</h2>
        <p>
          This website uses necessary cookies for Discord sign-in when it is
          enabled. No optional analytics or marketing trackers are installed.
        </p>
        <dl className="cookie-categories">
          <div>
            <dt>Necessary</dt>
            <dd>Always active when required for sign-in</dd>
          </div>
          <div>
            <dt>Analytics & marketing</dt>
            <dd>Not installed</dd>
          </div>
        </dl>
        <div className="button-row">
          <button className="button" onClick={() => dialog.current?.close()}>
            Done
          </button>
          <Link
            href="/cookies"
            className="button button-ghost"
            onClick={() => dialog.current?.close()}
          >
            Read cookie policy
          </Link>
        </div>
      </dialog>
    </>
  );
}
