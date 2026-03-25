import { useId, useMemo } from 'react';

type RoleCounts = {
  MEMBER: number;
  DEALER: number;
  BEST: number;
  BUSINESS: number;
};

type RoleDonutCardProps = {
  className?: string;
  roleCounts: RoleCounts;
};

type RoleKey = keyof RoleCounts;

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const rad = (Math.PI / 180) * angle;

  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeDonutSegment(
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  outerStartAngle: number,
  outerEndAngle: number,
  innerStartAngle: number,
  innerEndAngle: number,
) {
  const outerStart = polarToCartesian(cx, cy, outerR, outerStartAngle);
  const outerEnd = polarToCartesian(cx, cy, outerR, outerEndAngle);
  const innerEnd = polarToCartesian(cx, cy, innerR, innerEndAngle);
  const innerStart = polarToCartesian(cx, cy, innerR, innerStartAngle);

  const outerAngleDiff = (outerEndAngle - outerStartAngle + 360) % 360;
  const innerAngleDiff = (innerEndAngle - innerStartAngle + 360) % 360;
  const outerLargeArcFlag = outerAngleDiff > 180 ? 1 : 0;
  const innerLargeArcFlag = innerAngleDiff > 180 ? 1 : 0;

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerR} ${outerR} 0 ${outerLargeArcFlag} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerR} ${innerR} 0 ${innerLargeArcFlag} 0 ${innerStart.x} ${innerStart.y}`,
    'Z',
  ].join(' ');
}

const LEGEND_ORDER: RoleKey[] = ['MEMBER', 'DEALER', 'BEST', 'BUSINESS'];
const DONUT_ORDER: RoleKey[] = ['MEMBER', 'BUSINESS', 'BEST', 'DEALER'];

const ROLE_META: Record<
  RoleKey,
  { label: string; dotColor: string; solidColor: string }
> = {
  MEMBER: {
    label: 'MEMBER',
    dotColor: '#F1B52B',
    solidColor: '#FFC633',
  },
  DEALER: {
    label: 'DEALER',
    dotColor: '#FCBB60',
    solidColor: '#E4BA68',
  },
  BEST: {
    label: 'BEST',
    dotColor: '#DDA9FF',
    solidColor: '#C39BE8',
  },
  BUSINESS: {
    label: 'BUSINESS',
    dotColor: '#91B6FF',
    solidColor: '#97B1E7',
  },
};

export default function RoleDonutCard({
  className = '',
  roleCounts,
}: RoleDonutCardProps) {
  const gradientId = useId();

  const totalCount =
    roleCounts.MEMBER +
    roleCounts.DEALER +
    roleCounts.BEST +
    roleCounts.BUSINESS;

  const safeTotalCount = totalCount || 1;

  const legendItems = useMemo(
    () =>
      LEGEND_ORDER.map((key) => ({
        key,
        label: ROLE_META[key].label,
        count: roleCounts[key],
        dotColor: ROLE_META[key].dotColor,
        percent: (roleCounts[key] / safeTotalCount) * 100,
      })),
    [roleCounts, safeTotalCount],
  );

  const donutSegments = useMemo(() => {
    const visibleKeys = DONUT_ORDER.filter((key) => roleCounts[key] > 0);

    if (visibleKeys.length === 0) return [];

    const startAngle = -88;
    const gapAngle = 7;
    const availableAngle = 360 - gapAngle * visibleKeys.length;

    let currentAngle = startAngle;

    return visibleKeys.map((key) => {
      const sweepAngle = (roleCounts[key] / safeTotalCount) * availableAngle;

      const segment = {
        key,
        startAngle: currentAngle,
        endAngle: currentAngle + sweepAngle,
      };

      currentAngle += sweepAngle + gapAngle;

      return segment;
    });
  }, [roleCounts, safeTotalCount]);

  return (
    <div className={`w-full max-w-[640px] ${className}`.trim()}>
      <svg
        viewBox="0 0 640 196"
        className="block h-auto w-full"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="회원 역할 비율 카드"
      >
        <defs>
          <linearGradient
            id={gradientId}
            x1="118"
            y1="180"
            x2="118"
            y2="16"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#ECE79E" />
            <stop offset="100%" stopColor="#F4CB3D" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="640" height="196" rx="24" fill="white" />

        {donutSegments.map((segment) => {
          const fill =
            segment.key === 'MEMBER'
              ? `url(#${gradientId})`
              : ROLE_META[segment.key].solidColor;
          const sweepAngle =
            (segment.endAngle - segment.startAngle + 360) % 360;
          const innerInsetAngle = Math.min(2.2, Math.max((sweepAngle - 0.8) / 2, 0));

          return (
            <path
              key={segment.key}
              d={describeDonutSegment(
                118,
                98,
                84,
                44,
                segment.startAngle,
                segment.endAngle,
                segment.startAngle + innerInsetAngle,
                segment.endAngle - innerInsetAngle,
              )}
              fill={fill}
              stroke={fill}
              strokeWidth="4"
              strokeLinejoin="round"
            />
          );
        })}

        {legendItems.map((item, index) => {
          const y = 48 + index * 34;

          return (
            <circle key={item.key} cx="248" cy={y} r="6" fill={item.dotColor} />
          );
        })}

        <g
          fill="#111111"
          fontFamily="Pretendard, 'Pretendard Variable', system-ui, sans-serif"
          fontSize="17"
          fontWeight="500"
          dominantBaseline="middle"
        >
          {legendItems.map((item, index) => {
            const y = 48 + index * 34;

            return (
              <text key={item.key} x="265" y={y}>
                {item.label}
              </text>
            );
          })}
        </g>

        <g
          fill="#111111"
          fontFamily="Pretendard, 'Pretendard Variable', system-ui, sans-serif"
          fontSize="17"
          fontWeight="500"
          dominantBaseline="middle"
          textAnchor="start"
        >
          {legendItems.map((item, index) => {
            const y = 48 + index * 34;

            return (
              <text key={item.key} x="542" y={y}>
                {`${item.percent.toFixed(1)}%`}
              </text>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
