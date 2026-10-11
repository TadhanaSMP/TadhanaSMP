"use client";
import { useEffect, useState } from "react";
import { ShieldCheck, ArrowUpRight } from "lucide-react";
import { CopyButton } from "./CopyButton";
type User = {
  discordId: string;
  username: string;
  displayName: string;
  avatar: string | null;
  verified: boolean;
};
const errors: Record<string, string> = {
  not_authenticated: "Your session has expired. Please sign in again.",
  not_in_guild: "Join the official Discord community first.",
  pending_verification:
    "Send your code to the authorized bot, then check again.",
  verification_failed:
    "Verification could not be checked. Please try again later.",
  verification_unavailable: "Verification is temporarily unavailable.",
  authentication_unavailable: "Website verification is currently unavailable.",
  invalid_origin:
    "This request could not be verified. Refresh this page and try again.",
};
export function Verification() {
  const [user, setUser] = useState<User | null>(null),
    [enabled, setEnabled] = useState(false),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false),
    [otp, setOTP] = useState(""),
    [message, setMessage] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/auth/me", { cache: "no-store", signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        setUser(data.user ?? null);
        setEnabled(data.enabled === true);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);
  async function act(action: "generate" | "verify" | "logout") {
    setBusy(true);
    setMessage("");
    try {
      const path =
        action === "generate"
          ? "/api/auth/otp/generate"
          : action === "verify"
            ? "/api/auth/verify"
            : "/api/auth/logout";
      const response = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(
          response.status === 429
            ? "Please wait before trying again."
            : errors[data.error] ||
                "The request could not be completed. Please try again later.",
        );
        return;
      }
      if (action === "generate" && data.success) {
        setOTP(data.otp);
        setMessage(
          "This code expires in ten minutes. Send it privately to the authorized Discord bot.",
        );
      }
      if (action === "verify") {
        if (data.verified) {
          setUser((old) => (old ? { ...old, verified: true } : old));
          setOTP("");
          setMessage("Your Discord membership is verified.");
        } else
          setMessage(errors[data.status] || "Verification is still pending.");
      }
      if (action === "logout" && data.ok) {
        setUser(null);
        setOTP("");
        setMessage("You are signed out.");
      }
    } catch {
      setMessage("The connection failed. Please try again later.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section id="verify" className="verification-panel">
      <ShieldCheck className="pink" size={32} />
      <div>
        <p className="eyebrow">Discord membership</p>
        <h2>Keep your identity connected.</h2>
        {loading ? (
          <p>Checking website verification…</p>
        ) : !enabled ? (
          <p>
            Website verification is currently unavailable. You can still visit
            Discord for community support.
          </p>
        ) : !user ? (
          <>
            <p>
              Sign in with Discord to generate a one-time code for the
              authorized community bot.
            </p>
            <a className="button" href="/api/auth/discord/login">
              Sign in with Discord
              <ArrowUpRight size={16} />
            </a>
          </>
        ) : (
          <>
            <p>
              Signed in as <strong>{user.displayName}</strong>.{" "}
              {user.verified
                ? "Membership verified."
                : "Membership verification pending."}
            </p>
            <div className="button-row">
              {!user.verified && (
                <>
                  <button
                    className="button"
                    disabled={busy}
                    onClick={() => act("generate")}
                  >
                    Generate verification code
                  </button>
                  <button
                    className="button button-ghost"
                    disabled={busy}
                    onClick={() => act("verify")}
                  >
                    Check verification
                  </button>
                </>
              )}
              <button
                className="text-button"
                disabled={busy}
                onClick={() => act("logout")}
              >
                Sign out
              </button>
            </div>
            {otp && (
              <div className="otp-display">
                <code>{otp}</code>
                <CopyButton value={otp} label="Copy code" />
              </div>
            )}
          </>
        )}
        <p className="verification-message" role="status">
          {message}
        </p>
      </div>
    </section>
  );
}
