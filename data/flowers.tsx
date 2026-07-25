import { FlowerMeta, FlowerType } from "@/types";

export const FLOWERS: FlowerMeta[] = [
  {
    type: "yasemin",
    label: "Yasemin",
    freshColor: "#FBFBF0",
    driedColor: "#D8CBA0",
  },
  { type: "gul", label: "Gül", freshColor: "#E88C9A", driedColor: "#C08A6E" },
  { type: "lale", label: "Lale", freshColor: "#E14F63", driedColor: "#B56A55" },
  {
    type: "orkide",
    label: "Orkide",
    freshColor: "#B57EDC",
    driedColor: "#A9877E",
  },
  {
    type: "yasemin-mavi",
    label: "Mavi Yasemin",
    freshColor: "#AFC9EA",
    driedColor: "#A9AF9A",
  },
  {
    type: "yasemin-kirmizi",
    label: "Kırmızı Yasemin",
    freshColor: "#E68A96",
    driedColor: "#BE8B7C",
  },
  {
    type: "menekse",
    label: "Menekşe",
    freshColor: "#7B5EA7",
    driedColor: "#8B7B8A",
  },
  {
    type: "lilyum",
    label: "Lilyum",
    freshColor: "#E8863D",
    driedColor: "#B57A4E",
  },
  {
    type: "zambak",
    label: "Zambak",
    freshColor: "#FBFBF3",
    driedColor: "#D9CFAE",
  },
  {
    type: "sakayik",
    label: "Şakayık",
    freshColor: "#E56C99",
    driedColor: "#B98C93",
  },
  {
    type: "beyaz-gul",
    label: "Beyaz Gül",
    freshColor: "#F7F3E8",
    driedColor: "#D8CBA0",
  },
  {
    type: "husnuyusuf",
    label: "Hüsnüyusuf",
    freshColor: "#D1495B",
    driedColor: "#B06B62",
  },
];

export function getFlowerMeta(type: FlowerType): FlowerMeta {
  return FLOWERS.find((f) => f.type === type)!;
}

interface FlowerSvgProps {
  dried?: boolean;
  className?: string;
}

/**
 * Kurutulmuş görünüm; tüm çiçekler için ortak filtre.
 * Renk doygunluğunu düşürüp sepya/soluk bir ton verir, taze halinde ise
 * doğal renkler ve hafif bir parlaklık korunur.
 */
function driedFilter(dried?: boolean) {
  return dried
    ? "saturate(0.55) sepia(0.35) brightness(0.92) contrast(0.96)"
    : "saturate(1.05) brightness(1)";
}

export function RoseSvg({
  dried,
  className,
  white,
}: FlowerSvgProps & { white?: boolean }) {
  const outer = white
    ? dried
      ? "#D8CBA0"
      : "#F7F3E8"
    : dried
      ? "#C08A6E"
      : "#E88C9A";
  const inner = white
    ? dried
      ? "#C7A96B"
      : "#EADFC5"
    : dried
      ? "#A9694E"
      : "#D8677C";
  return (
    <svg
      viewBox="0 0 120 140"
      className={className}
      style={{ filter: driedFilter(dried), opacity: dried ? 0.92 : 1 }}
    >
      <g
        stroke="#5C6E4E"
        strokeWidth="2.5"
        fill="none"
        opacity={dried ? 0.7 : 1}
      >
        <path d="M60 90 C 58 105, 62 118, 58 132" />
        <path d="M60 100 C 48 104, 40 100, 34 108" />
        <path d="M62 112 C 74 116, 82 112, 88 120" />
      </g>
      <g transform="translate(60 55)">
        <circle
          r="26"
          fill={outer}
          opacity="0.35"
        />
        <path
          d="M0 -24 C 14 -22, 22 -10, 20 2 C 26 4, 30 14, 22 22 C 26 30, 18 38, 8 34 C 4 40, -8 40, -12 32 C -22 34, -28 24, -22 16 C -30 10, -26 -2, -16 -4 C -18 -16, -10 -26, 0 -24 Z"
          fill={outer}
        />
        <path
          d="M0 -12 C 8 -10, 12 -2, 8 4 C 12 8, 10 14, 2 14 C -2 18, -10 16, -10 8 C -16 6, -14 -2, -6 -4 C -8 -10, -4 -14, 0 -12 Z"
          fill={inner}
        />
      </g>
      <g
        stroke="#6C7C4E"
        strokeWidth="2"
        fill={dried ? "#8B8F5C" : "#7C9A5E"}
        opacity={dried ? 0.65 : 1}
      >
        <path d="M40 96 C 32 92, 26 96, 24 104 C 32 106, 38 104, 40 96 Z" />
        <path d="M82 118 C 90 114, 96 118, 98 126 C 90 128, 84 126, 82 118 Z" />
      </g>
    </svg>
  );
}

export function TulipSvg({ dried, className }: FlowerSvgProps) {
  return (
    <svg
      viewBox="0 0 120 140"
      className={className}
      style={{ filter: driedFilter(dried), opacity: dried ? 0.92 : 1 }}
    >
      <g
        stroke="#5C6E4E"
        strokeWidth="2.5"
        fill="none"
        opacity={dried ? 0.7 : 1}
      >
        <path d="M60 78 C 58 96, 62 114, 58 132" />
        <path d="M58 100 C 46 102, 40 96, 36 100" />
      </g>
      <g transform="translate(60 50)">
        <path
          d="M-22 30 C -26 6, -18 -22, 0 -34 C 18 -22, 26 6, 22 30 C 18 22, 10 18, 0 22 C -10 18, -18 22, -22 30 Z"
          fill={dried ? "#B56A55" : "#E14F63"}
        />
        <path
          d="M-14 26 C -17 8, -10 -12, 0 -22 C 6 -14, 8 -2, 6 10 C 2 8, -2 10, -4 18 C -8 20, -12 22, -14 26 Z"
          fill={dried ? "#9A5240" : "#C43A50"}
          opacity="0.8"
        />
      </g>
      <g
        stroke="#6C7C4E"
        strokeWidth="2"
        fill={dried ? "#8B8F5C" : "#7C9A5E"}
        opacity={dried ? 0.65 : 1}
      >
        <path d="M44 90 C 30 92, 22 100, 20 112 C 34 112, 42 102, 44 90 Z" />
      </g>
    </svg>
  );
}

type JasmineHue = "white" | "blue" | "red";

const JASMINE_PALETTE: Record<
  JasmineHue,
  {
    fresh: { petal: string; center: string; stroke: string };
    dried: { petal: string; center: string; stroke: string };
  }
> = {
  white: {
    fresh: { petal: "#FBFBF0", center: "#F2C572", stroke: "#EADFC5" },
    dried: { petal: "#D8CBA0", center: "#C7A96B", stroke: "#C7A96B" },
  },
  blue: {
    fresh: { petal: "#AFC9EA", center: "#6E8FC9", stroke: "#8FB0DE" },
    dried: { petal: "#A9AF9A", center: "#8B8F5C", stroke: "#9BA085" },
  },
  red: {
    fresh: { petal: "#E68A96", center: "#C23B4C", stroke: "#D9707E" },
    dried: { petal: "#BE8B7C", center: "#9A5240", stroke: "#AD7566" },
  },
};

export function JasmineSvg({
  dried,
  className,
  hue = "white",
}: FlowerSvgProps & { hue?: JasmineHue }) {
  const p = dried ? JASMINE_PALETTE[hue].dried : JASMINE_PALETTE[hue].fresh;
  return (
    <svg
      viewBox="0 0 120 140"
      className={className}
      style={{ filter: driedFilter(dried), opacity: dried ? 0.94 : 1 }}
    >
      <g
        stroke="#6C7C4E"
        strokeWidth="2.2"
        fill="none"
        opacity={dried ? 0.65 : 1}
      >
        <path d="M60 92 C 56 106, 62 118, 58 132" />
        <path d="M60 70 C 40 66, 30 74, 26 62" />
        <path d="M60 74 C 82 68, 92 76, 98 64" />
      </g>
      <g transform="translate(60 55)">
        {[0, 1, 2, 3, 4].map((i) => {
          const angle = (i * 360) / 5;
          return (
            <ellipse
              key={i}
              cx="0"
              cy="-16"
              rx="9"
              ry="17"
              fill={p.petal}
              stroke={p.stroke}
              strokeWidth="1"
              transform={`rotate(${angle})`}
            />
          );
        })}
        <circle
          r="6"
          fill={p.center}
        />
      </g>
      <g
        fill={dried ? "#8B8F5C" : "#7C9A5E"}
        opacity={dried ? 0.6 : 1}
      >
        <ellipse
          cx="34"
          cy="66"
          rx="8"
          ry="4"
          transform="rotate(-30 34 66)"
        />
        <ellipse
          cx="90"
          cy="60"
          rx="8"
          ry="4"
          transform="rotate(20 90 60)"
        />
      </g>
    </svg>
  );
}

export function OrchidSvg({ dried, className }: FlowerSvgProps) {
  const petal = dried ? "#A9877E" : "#B57EDC";
  const petalInner = dried ? "#93726A" : "#9D63C2";
  const lip = dried ? "#C7A96B" : "#F2C572";
  return (
    <svg
      viewBox="0 0 120 140"
      className={className}
      style={{ filter: driedFilter(dried), opacity: dried ? 0.92 : 1 }}
    >
      <g
        stroke="#5C6E4E"
        strokeWidth="2.5"
        fill="none"
        opacity={dried ? 0.7 : 1}
      >
        <path d="M60 90 C 58 106, 62 118, 58 132" />
      </g>
      <g transform="translate(60 55)">
        <ellipse
          cx="0"
          cy="-22"
          rx="10"
          ry="19"
          fill={petal}
        />
        <ellipse
          cx="-19"
          cy="10"
          rx="10"
          ry="19"
          fill={petal}
          transform="rotate(-58 -19 10)"
        />
        <ellipse
          cx="19"
          cy="10"
          rx="10"
          ry="19"
          fill={petal}
          transform="rotate(58 19 10)"
        />
        <ellipse
          cx="-12"
          cy="-6"
          rx="7"
          ry="13"
          fill={petalInner}
          transform="rotate(-25 -12 -6)"
        />
        <ellipse
          cx="12"
          cy="-6"
          rx="7"
          ry="13"
          fill={petalInner}
          transform="rotate(25 12 -6)"
        />
        <path
          d="M0 -2 C 8 4, 8 15, 0 21 C -8 15, -8 4, 0 -2 Z"
          fill={lip}
        />
        <circle
          r="3"
          fill={dried ? "#7A6F63" : "#6C7C4E"}
        />
      </g>
    </svg>
  );
}

export function VioletSvg({ dried, className }: FlowerSvgProps) {
  const petal = dried ? "#8B7B8A" : "#7B5EA7";
  const petalDark = dried ? "#6E5F6C" : "#5B3E86";
  const center = dried ? "#C7A96B" : "#F2C572";
  return (
    <svg
      viewBox="0 0 120 140"
      className={className}
      style={{ filter: driedFilter(dried), opacity: dried ? 0.92 : 1 }}
    >
      <g
        stroke="#5C6E4E"
        strokeWidth="2.2"
        fill="none"
        opacity={dried ? 0.65 : 1}
      >
        <path d="M60 88 C 58 104, 62 118, 58 132" />
      </g>
      <g transform="translate(60 55)">
        <ellipse
          cx="-10"
          cy="-14"
          rx="9"
          ry="14"
          fill={petal}
          transform="rotate(-25 -10 -14)"
        />
        <ellipse
          cx="10"
          cy="-14"
          rx="9"
          ry="14"
          fill={petal}
          transform="rotate(25 10 -14)"
        />
        <ellipse
          cx="-16"
          cy="6"
          rx="9"
          ry="13"
          fill={petalDark}
          transform="rotate(-55 -16 6)"
        />
        <ellipse
          cx="16"
          cy="6"
          rx="9"
          ry="13"
          fill={petalDark}
          transform="rotate(55 16 6)"
        />
        <ellipse
          cx="0"
          cy="14"
          rx="11"
          ry="14"
          fill={petal}
        />
        <circle
          r="4"
          fill={center}
        />
      </g>
    </svg>
  );
}

export function LilySvg({
  dried,
  className,
  variant = "lilyum",
}: FlowerSvgProps & { variant?: "lilyum" | "zambak" }) {
  const fresh = variant === "lilyum" ? "#E8863D" : "#FBFBF3";
  const driedColor = variant === "lilyum" ? "#B57A4E" : "#D9CFAE";
  const petal = dried ? driedColor : fresh;
  const stamen = dried ? "#7A5A3E" : "#8B4A1E";
  return (
    <svg
      viewBox="0 0 120 140"
      className={className}
      style={{ filter: driedFilter(dried), opacity: dried ? 0.92 : 1 }}
    >
      <g
        stroke="#5C6E4E"
        strokeWidth="2.4"
        fill="none"
        opacity={dried ? 0.65 : 1}
      >
        <path d="M60 88 C 58 104, 62 118, 58 132" />
      </g>
      <g transform="translate(60 55)">
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const angle = i * 60;
          return (
            <path
              key={i}
              d="M0 4 C -6 -6, -5 -22, 0 -30 C 5 -22, 6 -6, 0 4 Z"
              fill={petal}
              opacity={i % 2 === 0 ? 1 : 0.88}
              transform={`rotate(${angle})`}
            />
          );
        })}
        {variant === "lilyum" && (
          <g
            stroke={stamen}
            strokeWidth="1.4"
          >
            <line
              x1="0"
              y1="0"
              x2="-4"
              y2="-16"
            />
            <line
              x1="0"
              y1="0"
              x2="4"
              y2="-16"
            />
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="-18"
            />
            <circle
              cx="-4"
              cy="-16"
              r="1.6"
              fill={stamen}
            />
            <circle
              cx="4"
              cy="-16"
              r="1.6"
              fill={stamen}
            />
            <circle
              cx="0"
              cy="-18"
              r="1.6"
              fill={stamen}
            />
          </g>
        )}
        <circle
          r="3"
          fill={dried ? "#8B8F5C" : "#C7A96B"}
          opacity="0.7"
        />
      </g>
    </svg>
  );
}

export function PeonySvg({ dried, className }: FlowerSvgProps) {
  const outer = dried ? "#B98C93" : "#E56C99";
  const mid = dried ? "#A9727B" : "#D94A80";
  const inner = dried ? "#8F5B66" : "#B92E5F";
  return (
    <svg
      viewBox="0 0 120 140"
      className={className}
      style={{ filter: driedFilter(dried), opacity: dried ? 0.92 : 1 }}
    >
      <g
        stroke="#5C6E4E"
        strokeWidth="2.5"
        fill="none"
        opacity={dried ? 0.7 : 1}
      >
        <path d="M60 92 C 58 106, 62 118, 58 132" />
      </g>
      <g transform="translate(60 55)">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const angle = i * 45;
          return (
            <ellipse
              key={`o${i}`}
              cx="0"
              cy="-18"
              rx="10"
              ry="15"
              fill={outer}
              opacity="0.9"
              transform={`rotate(${angle})`}
            />
          );
        })}
        {[0, 1, 2, 3, 4].map((i) => {
          const angle = i * 72 + 20;
          return (
            <ellipse
              key={`m${i}`}
              cx="0"
              cy="-10"
              rx="8"
              ry="11"
              fill={mid}
              transform={`rotate(${angle})`}
            />
          );
        })}
        <circle
          r="8"
          fill={inner}
        />
      </g>
    </svg>
  );
}

export function SweetWilliamSvg({ dried, className }: FlowerSvgProps) {
  const petal = dried ? "#B06B62" : "#D1495B";
  const center = dried ? "#C7A96B" : "#F2C572";
  const cluster = [
    { x: -12, y: -22 },
    { x: 10, y: -26 },
    { x: -2, y: -10 },
    { x: 14, y: -8 },
    { x: -16, y: -6 },
  ];
  return (
    <svg
      viewBox="0 0 120 140"
      className={className}
      style={{ filter: driedFilter(dried), opacity: dried ? 0.92 : 1 }}
    >
      <g
        stroke="#5C6E4E"
        strokeWidth="2.2"
        fill="none"
        opacity={dried ? 0.65 : 1}
      >
        <path d="M60 92 C 58 106, 62 118, 58 132" />
      </g>
      <g transform="translate(60 60)">
        {cluster.map((c, idx) => (
          <g
            key={idx}
            transform={`translate(${c.x} ${c.y})`}
          >
            {[0, 1, 2, 3, 4].map((i) => {
              const angle = (i * 360) / 5;
              return (
                <ellipse
                  key={i}
                  cx="0"
                  cy="-5"
                  rx="3.2"
                  ry="5.2"
                  fill={petal}
                  transform={`rotate(${angle})`}
                />
              );
            })}
            <circle
              r="1.6"
              fill={center}
            />
          </g>
        ))}
      </g>
    </svg>
  );
}

export function FlowerIllustration({
  type,
  dried,
  className,
}: {
  type: FlowerType;
  dried?: boolean;
  className?: string;
}) {
  switch (type) {
    case "gul":
      return (
        <RoseSvg
          dried={dried}
          className={className}
        />
      );
    case "beyaz-gul":
      return (
        <RoseSvg
          dried={dried}
          className={className}
          white
        />
      );
    case "lale":
      return (
        <TulipSvg
          dried={dried}
          className={className}
        />
      );
    case "yasemin":
      return (
        <JasmineSvg
          dried={dried}
          className={className}
          hue="white"
        />
      );
    case "yasemin-mavi":
      return (
        <JasmineSvg
          dried={dried}
          className={className}
          hue="blue"
        />
      );
    case "yasemin-kirmizi":
      return (
        <JasmineSvg
          dried={dried}
          className={className}
          hue="red"
        />
      );
    case "orkide":
      return (
        <OrchidSvg
          dried={dried}
          className={className}
        />
      );
    case "menekse":
      return (
        <VioletSvg
          dried={dried}
          className={className}
        />
      );
    case "lilyum":
      return (
        <LilySvg
          dried={dried}
          className={className}
          variant="lilyum"
        />
      );
    case "zambak":
      return (
        <LilySvg
          dried={dried}
          className={className}
          variant="zambak"
        />
      );
    case "sakayik":
      return (
        <PeonySvg
          dried={dried}
          className={className}
        />
      );
    case "husnuyusuf":
      return (
        <SweetWilliamSvg
          dried={dried}
          className={className}
        />
      );
  }
}
