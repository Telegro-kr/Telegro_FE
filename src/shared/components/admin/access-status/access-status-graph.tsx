import { type Dispatch, type SetStateAction } from 'react';
import { cn } from '@libs/cn';
import {
  type ChartFilter,
  type DataPoint,
  type HoverState,
} from '@hooks/use-access-status-chart';

const AccessStatusGraph = ({
  filter,
  data,
  hovered,
  onHoverChange,
  isReady,
  canGoPrev,
  canGoNext,
  onPrev,
  onNext,
}: {
  filter: ChartFilter;
  data: DataPoint[];
  hovered: HoverState;
  onHoverChange: Dispatch<SetStateAction<HoverState>>;
  isReady: boolean;
  canGoPrev: boolean;
  canGoNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}) => {
  const width = 1040;
  const height = 300;
  const paddingX = 72;
  const headerSpace = 78;
  const bottomPadding = 36;
  const graphHeight = height - headerSpace - bottomPadding;
  const stepX =
    data.length > 1 ? (width - paddingX * 2) / (data.length - 1) : 0;
  const maxValue = Math.max(...data.map((item) => item.value), 1);
  const minValue = Math.min(...data.map((item) => item.value), 0);
  const valueRange = Math.max(maxValue - minValue, 1);

  const points = data.map((item, index) => {
    const x = paddingX + stepX * index;
    const normalized = (item.value - minValue) / valueRange;
    const y =
      headerSpace + graphHeight - normalized * (graphHeight * 0.62) - 14;
    return { ...item, x, y };
  });

  const baselineY = headerSpace + graphHeight;
  const linePath = createSmoothPath(points);
  const areaPath = createAreaPath(points, baselineY);

  return (
    <div className="relative w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-y-[7.4rem] left-0 z-10 hidden items-center md:flex">
        <GraphArrowButton
          direction="left"
          disabled={!canGoPrev}
          onClick={onPrev}
        />
      </div>
      <div className="pointer-events-none absolute inset-y-[7.4rem] right-0 z-10 hidden items-center md:flex">
        <GraphArrowButton
          direction="right"
          disabled={!canGoNext}
          onClick={onNext}
        />
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="block w-full overflow-visible"
      >
        {points.map((point) => (
          <line
            key={`${point.id}-grid`}
            x1={point.x}
            y1={headerSpace - 10}
            x2={point.x}
            y2={baselineY}
            stroke="#B1B1B1"
            strokeOpacity="0.22"
            strokeWidth="1"
          />
        ))}

        {points.map((point, index) => (
          <g key={`${point.id}-label`}>
            <text
              x={point.x}
              y={34}
              textAnchor="middle"
              className="fill-[#A9ADB5] text-[15px] font-semibold md:text-[16px]"
            >
              {point.label}
            </text>
            {point.subLabel && (
              <text
                x={point.x}
                y={56}
                textAnchor="middle"
                className="fill-[#2B2B2B] text-[16px] font-semibold md:text-[18px]"
              >
                {point.subLabel}
              </text>
            )}

            {hovered?.index === index && (
              <foreignObject
                x={point.x - 56}
                y={point.y - 74}
                width={112}
                height={72}
              >
                <div className="flex h-full w-full items-center justify-center overflow-visible">
                  <div className="flex h-11 min-w-[6.4rem] items-center justify-center rounded-[0.8rem] border border-gray-300 bg-white px-4">
                    <span className="text-[0.95rem] font-semibold text-[#FFB800] md:text-[1.05rem]">
                      {point.value}
                    </span>
                  </div>
                </div>
              </foreignObject>
            )}
          </g>
        ))}

        <g
          style={{
            clipPath: isReady ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)',
            transition: 'clip-path 900ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <path
            d={areaPath}
            fill="url(#access-status-gradient)"
            opacity="0.92"
          />
        </g>

        <path
          d={linePath}
          fill="none"
          stroke="#FFC633"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={100}
          strokeDasharray={100}
          strokeDashoffset={isReady ? 0 : 100}
          style={{
            transition:
              'stroke-dashoffset 1100ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />

        {hovered && points[hovered.index] && (
          <circle
            cx={points[hovered.index].x}
            cy={points[hovered.index].y}
            r="5"
            fill="#FFC633"
          />
        )}

        {points.map((point, index) => {
          const zoneWidth = index === points.length - 1 ? stepX / 2 : stepX;

          return (
            <rect
              key={`${point.id}-hover`}
              x={point.x - stepX / 2}
              y={0}
              width={Math.max(zoneWidth, 56)}
              height={height}
              fill="transparent"
              onMouseEnter={() =>
                onHoverChange({ index, x: point.x, y: point.y })
              }
              onMouseMove={() =>
                onHoverChange({ index, x: point.x, y: point.y })
              }
              onMouseLeave={() => onHoverChange(null)}
            />
          );
        })}

        <defs>
          <linearGradient
            id="access-status-gradient"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor="rgba(255,198,51,0.22)" />
            <stop offset="100%" stopColor="rgba(255,198,51,0)" />
          </linearGradient>
        </defs>
      </svg>

      {hovered && data[hovered.index] ? (
        <div className="mt-2 text-right text-xl text-[#777]">
          <span className="font-medium text-[#444]">
            {data[hovered.index].tooltipLabel}
          </span>
          <span className="mx-1" />
          <span>{data[hovered.index].value}회</span>
        </div>
      ) : (
        <div className="mt-2 text-right text-xl text-[#A0A0A0]">
          {filter === 'daily'
            ? '좌우 버튼으로 이전 날짜와 다음 날짜 구간을 볼 수 있어요.'
            : '그래프에 마우스를 올리면 상세 수치가 보여요.'}
        </div>
      )}
    </div>
  );
};

function GraphArrowButton({
  direction,
  disabled,
  onClick,
}: {
  direction: 'left' | 'right';
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'pointer-events-auto grid h-12 w-12 cursor-pointer place-items-center rounded-full transition-colors',
        disabled
          ? 'cursor-not-allowed text-[#E5E5E5]'
          : 'text-[#D9D9D9] hover:text-[#B8B8B8]',
      )}
      aria-label={direction === 'left' ? '이전 구간 보기' : '다음 구간 보기'}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-9 w-9"
        fill="none"
        aria-hidden="true"
      >
        {direction === 'left' ? (
          <path
            d="M14.5 5L7.5 12L14.5 19"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M9.5 5L16.5 12L9.5 19"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  );
}

function createSmoothPath(points: Array<{ x: number; y: number }>) {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let index = 0; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    const controlX = (current.x + next.x) / 2;
    path += ` C ${controlX} ${current.y}, ${controlX} ${next.y}, ${next.x} ${next.y}`;
  }

  return path;
}

function createAreaPath(
  points: Array<{ x: number; y: number }>,
  baselineY: number,
) {
  if (points.length === 0) return '';
  const line = createSmoothPath(points);
  const first = points[0];
  const last = points[points.length - 1];
  return `${line} L ${last.x} ${baselineY} L ${first.x} ${baselineY} Z`;
}

export default AccessStatusGraph;
