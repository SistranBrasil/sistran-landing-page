import type { CSSProperties } from "react";
import styles from "./StampSistran.module.css";

export type StampShape =
  | "capsule"
  | "seal"
  | "split"
  | "ticket"
  | "signature"
  | "orbit"
  | "monogram"
  | "certificate";
export type StampFinish = "solid" | "outline" | "glass";

export interface StampSistranProps {
  prefix?: string;
  brand?: string;
  color?: string;
  shape?: StampShape;
  finish?: StampFinish;
  size?: "sm" | "md" | "lg";
  rotation?: number;
  animated?: boolean;
  className?: string;
}

function SistranMark() {
  return (
    <svg
      className={styles.mark}
      viewBox="0 0 100 100"
      role="img"
      aria-label="Sistran"
    >
      <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6.5" />
      <path
        d="M51 38h25l12 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 52l15 12h23"
        fill="none"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StampSistran({
  prefix = "Realizado pela",
  brand = "Sistran",
  color = "#0757c7",
  shape = "capsule",
  finish = "outline",
  size = "md",
  rotation = -3,
  animated = true,
  className = "",
}: StampSistranProps) {
  return (
    <span
      className={[
        styles.stamp,
        styles[shape],
        styles[finish],
        styles[size],
        animated ? styles.animated : "",
        className,
      ].join(" ")}
      style={
        {
          "--stamp-color": color,
          "--stamp-rotation": `${rotation}deg`,
        } as CSSProperties
      }
      aria-label={`${prefix} ${brand}`}
    >
      <span className={styles.impact} aria-hidden="true" />
      <span className={styles.logoWrap} aria-hidden="true">
        <SistranMark />
      </span>
      <span className={styles.copy}>
        <span className={styles.eyebrow}>{prefix}</span>
        <span className={styles.brand}>{brand}</span>
      </span>
      <span className={styles.serial} aria-hidden="true">SIS • 2026</span>
    </span>
  );
}
