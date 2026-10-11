"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";
export function CopyButton({
  value,
  label = "Copy address",
}: {
  value: string;
  label?: string;
}) {
  const [feedback, setFeedback] = useState({ value: "", text: "" });
  const message = feedback.value === value ? feedback.text : "";
  const setMessage = (text: string) => setFeedback({ value, text });
  const [busy, setBusy] = useState(false);
  async function copy() {
    setBusy(true);
    setMessage("");
    try {
      await navigator.clipboard.writeText(value);
      setMessage("Copied");
    } catch {
      setMessage("Copy unavailable. Select the address and copy it manually.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <span className="copy-control">
      <button
        type="button"
        className="copy-button"
        onClick={copy}
        disabled={busy}
        aria-label={`${label}: ${value}`}
      >
        {message === "Copied" ? <Check size={16} /> : <Copy size={16} />}
        <span>{message === "Copied" ? "Copied" : label}</span>
      </button>
      <span
        role="status"
        className={message === "Copied" ? "sr-only" : "copy-feedback"}
      >
        {message}
      </span>
    </span>
  );
}
