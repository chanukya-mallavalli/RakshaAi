
import "./ShieldScene.css";

type ShieldSceneProps = {
  compact?: boolean;
  label?: string;
};

export default function ShieldScene({
  compact = false,
  label = "RakshaAI AI-assisted protection shield",
}: ShieldSceneProps) {
  return (
    <div
      className={`ra-shield-scene${compact ? " ra-shield-scene--compact" : ""}`}
      role="img"
      aria-label={label}
    >
      <div className="ra-shield-scene__ambient" aria-hidden="true" />
      <div className="ra-shield-scene__grid" aria-hidden="true" />

      <div className="ra-shield-orbit ra-shield-orbit--one" aria-hidden="true">
        <span />
      </div>

      <div className="ra-shield-orbit ra-shield-orbit--two" aria-hidden="true">
        <span />
      </div>

      <div className="ra-shield-orbit ra-shield-orbit--three" aria-hidden="true">
        <span />
      </div>

      <div className="ra-shield-halo">
        <div className="ra-shield-halo__inner">
          <svg
            className="ra-shield-icon"
            viewBox="0 0 180 200"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <linearGradient
                id="raShieldStroke"
                x1="20"
                y1="20"
                x2="160"
                y2="180"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#42E8F5" />
                <stop offset="52%" stopColor="#258AFF" />
                <stop offset="100%" stopColor="#B47CFF" />
              </linearGradient>

              <linearGradient
                id="raShieldFill"
                x1="35"
                y1="20"
                x2="145"
                y2="180"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#183B68" />
                <stop offset="100%" stopColor="#080F28" />
              </linearGradient>

              <filter id="raShieldGlow" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <path
              d="M90 10 155 36V85c0 43-27 78-65 103C52 163 25 128 25 85V36Z"
              fill="url(#raShieldFill)"
              stroke="url(#raShieldStroke)"
              strokeWidth="4"
              strokeLinejoin="round"
              filter="url(#raShieldGlow)"
            />

            <path
              d="M90 27 139 47V85c0 32-19 59-49 80-30-21-49-48-49-80V47Z"
              fill="#42E8F5"
              fillOpacity=".07"
              stroke="#42E8F5"
              strokeOpacity=".25"
              strokeWidth="1.5"
            />

            <path
              d="m57 99 23 23 44-48"
              fill="none"
              stroke="#42E8F5"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#raShieldGlow)"
            />
          </svg>
        </div>
      </div>

      <div className="ra-shield-label ra-shield-label--top">
        <span className="ra-status-dot" />
        <span>DIGITAL PROTECTION</span>
      </div>

      <div className="ra-shield-floating-card ra-shield-floating-card--top">
        <span className="ra-floating-icon" aria-hidden="true">⌑</span>
        <span>
          <strong>Stay alert</strong>
          <small>Think before you click</small>
        </span>
      </div>

      <div className="ra-shield-caption">
        <span className="ra-status-dot" />
        AI-ASSISTED PROTECTION
      </div>

      <div className="ra-shield-floating-card ra-shield-floating-card--bottom">
        <span className="ra-floating-icon ra-floating-icon--green" aria-hidden="true">
          ✓
        </span>
        <span>
          <strong>Your safety matters</strong>
          <small>Check suspicious messages</small>
        </span>
      </div>
    </div>
  );
}
