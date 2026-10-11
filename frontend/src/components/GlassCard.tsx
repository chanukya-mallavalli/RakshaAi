
import type { HTMLAttributes } from "react";
import "./GlassCard.css";

type GlassCardProps = HTMLAttributes<HTMLDivElement> & {
  interactive?: boolean;
};

export default function GlassCard({
  children,
  className = "",
  interactive = false,
  ...props
}: GlassCardProps) {
  return (
    <div
      {...props}
      className={[
        "ra-glass-card",
        interactive ? "ra-glass-card--interactive" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
