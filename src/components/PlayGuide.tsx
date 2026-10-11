"use client";
import { useState, useRef } from "react";
import { Monitor, Gamepad2, ArrowRight } from "lucide-react";
import type { PublicConfig } from "@/config/server";
import { CopyButton } from "./CopyButton";
export function PlayGuide({
  config,
  initialEdition = "java",
}: {
  config: PublicConfig;
  initialEdition?: "java" | "bedrock";
}) {
  const [edition, setEdition] = useState<"java" | "bedrock">(initialEdition);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const java = edition === "java";
  const address = java ? config.javaAddress : config.bedrockAddress;
  const javaValue = `${config.javaAddress}${config.javaPort ? `:${config.javaPort}` : ""}`;
  const ready = !!address && (java || !!config.bedrockPort);
  const steps = java
    ? [
        "Open Minecraft: Java Edition on your computer.",
        "Choose Multiplayer, then Add Server.",
        "Enter TadhanaSMP as the name and the configured Java address below.",
        "Save, select the server, and join using a supported client version.",
      ]
    : [
        "Open Minecraft: Bedrock Edition on a supported device.",
        "Choose Play, then Servers, then Add Server where your platform allows it.",
        "Enter the Bedrock address and its separate port shown below.",
        "Save and connect using a supported client version.",
      ];
  return (
    <div className="play-guide">
      <div
        className="edition-tabs"
        role="tablist"
        aria-label="Minecraft edition"
      >
        {(["java", "bedrock"] as const).map((name, index) => (
          <button
            ref={(el) => {
              tabs.current[index] = el;
            }}
            key={name}
            id={`${name}-tab`}
            role="tab"
            aria-selected={edition === name}
            aria-controls="edition-panel"
            tabIndex={edition === name ? 0 : -1}
            onClick={() => setEdition(name)}
            onKeyDown={(event) => {
              if (
                !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)
              )
                return;
              event.preventDefault();
              const target =
                event.key === "Home" ? 0 : event.key === "End" ? 1 : 1 - index;
              setEdition(target === 0 ? "java" : "bedrock");
              tabs.current[target]?.focus();
            }}
          >
            {name === "java" ? <Monitor size={20} /> : <Gamepad2 size={20} />}
            <span>{name === "java" ? "Java Edition" : "Bedrock Edition"}</span>
          </button>
        ))}
      </div>
      <div
        id="edition-panel"
        role="tabpanel"
        tabIndex={0}
        aria-labelledby={`${edition}-tab`}
        className="edition-panel"
      >
        <div>
          <span className="eyebrow">
            {java
              ? "Desktop / Windows, macOS, Linux"
              : "Mobile, Windows & supported platforms"}
          </span>
          <h2>
            A few steps.
            <br />A whole new story.
          </h2>
          <ol className="play-steps">
            {steps.map((step, index) => (
              <li key={step}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{step}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="connection-panel">
          <span className="eyebrow">Your connection details</span>
          <h3>{java ? "Java" : "Bedrock"} server</h3>
          {ready ? (
            <>
              <div className="address-field">
                <span>Server address</span>
                <code>{java ? javaValue : address}</code>
                <CopyButton value={java ? javaValue : address} />
              </div>
              {!java && (
                <div className="address-field">
                  <span>Bedrock port</span>
                  <code>{config.bedrockPort}</code>
                  <CopyButton
                    value={String(config.bedrockPort)}
                    label="Copy port"
                  />
                </div>
              )}
            </>
          ) : (
            <div className="empty-connection">
              <span className="status-dot" />
              <p>
                Connection details are
                <br />
                <strong>currently being updated.</strong>
              </p>
            </div>
          )}
          <p className="small">
            Supported versions:{" "}
            {config.supportedVersions ||
              "check the latest official announcement."}
          </p>
          {config.maintenance && (
            <p className="notice-inline">{config.maintenanceNotice}</p>
          )}
          {config.discordUrl && (
            <a
              className="text-link"
              href={config.discordUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {config.maintenance
                ? "Get reopening updates"
                : "Check Discord announcements"}
              <ArrowRight size={16} />
            </a>
          )}
          <p className="small muted">
            Console editions may not expose a custom-server field. Contact
            support for current platform guidance.
          </p>
        </div>
      </div>
    </div>
  );
}
