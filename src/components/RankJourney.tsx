"use client";
import { useRef, useState } from "react";
import { ranks, rankSource } from "@/data/ranks";
import { Sparkles, ArrowRight } from "lucide-react";
export function RankJourney() {
  const [selected, setSelected] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  if (!rankSource.active) return <p>Gameplay rank publication is paused. Check /rankup in game.</p>;
  return (
    <div className="rank-journey">
      <div className="rank-tabs" role="tablist" aria-label="Gameplay ranks">
        {ranks.map((rank, index) => (
          <button
            ref={(el) => {
              tabs.current[index] = el;
            }}
            key={rank.name}
            id={`rank-tab-${index}`}
            type="button"
            role="tab"
            aria-selected={index === selected}
            aria-controls="rank-panel"
            tabIndex={index === selected ? 0 : -1}
            onClick={() => setSelected(index)}
            onKeyDown={(event) => {
              let target: number;
              if (event.key === "ArrowRight")
                target = (index + 1) % ranks.length;
              else if (event.key === "ArrowLeft")
                target = (index - 1 + ranks.length) % ranks.length;
              else if (event.key === "Home") target = 0;
              else if (event.key === "End") target = ranks.length - 1;
              else return;
              event.preventDefault();
              setSelected(target);
              tabs.current[target]?.focus();
            }}
          >
            <span className="rank-point">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span>{rank.name}</span>
          </button>
        ))}
      </div>
      <div
        className="rank-panel"
        id="rank-panel"
        role="tabpanel"
        tabIndex={0}
        aria-labelledby={`rank-tab-${selected}`}
      >
        <Sparkles className="rank-spark" size={28} />
        <div>
          <span className="eyebrow">
            Gameplay rank / {String(selected + 1).padStart(2, "0")}
          </span>
          <h3>{ranks[selected].name}</h3>
          <p>
            {ranks[selected].requirements ||
              "Current requirements are being reviewed. Check /rankup in game for the approved progression."}
          </p>
          <dl className="rank-metrics">{ranks[selected].metrics.map(metric => <div key={metric.label}><dt>{metric.label}</dt><dd>{metric.value.toLocaleString("en-PH")}</dd></div>)}</dl>
          <p className="small muted">
            {ranks[selected].perks ||
              "Benefits will appear here when confirmed by the server team."}
          </p>
        </div>
        <span className="rank-earned">
          Earned through play
          <ArrowRight size={16} />
        </span>
      </div>
    </div>
  );
}
