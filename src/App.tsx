import { useEffect, useState } from "react";

const rnd = (max: number) => Math.floor(Math.random() * max);

interface Tick {
  year: number;
  items: number;
}

const initial = Array(20)
  .fill(0)
  .map((_, i) => {
    return { year: 1889 + i * 10, items: rnd(50) + 1 };
  });

const minmax = (data: number[]) => {
  const sorted = data.sort((a, b) => a - b);
  return [sorted[0], sorted[sorted.length - 1]];
};

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<{
    height?: number;
    width?: number;
  }>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    const handleResize = () =>
      setWindowSize({
        width: window.document.body.clientWidth,
        height: window.document.body.clientHeight,
      });

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return windowSize;
};

const BarChart = ({
  ticks,
  svgWidth,
  svgHeight,
  onClick,
  onHover,
}: {
  ticks: Tick[];
  svgWidth: number;
  svgHeight: number;
  onClick: (year: number) => void;
  onHover: (year?: number) => void;
}) => {
  const barWidth = 10;
  const barGap = 2;
  const marginLeft = (svgWidth - ticks.length * (barWidth + barGap)) / 2;
  const marginTop = 20;
  const marginBottom = 10;
  const maxBarHeight = svgHeight - marginTop - marginBottom;
  const [, maxValue] = minmax(ticks.map((e) => e.items));
  const barHeight = (value: number): number => {
    return Math.ceil((maxBarHeight * value) / maxValue);
  };
  return (
    <svg width={svgWidth} height={svgHeight} className="border">
      <g transform={`translate(${marginLeft}, ${marginTop})`}>
        {ticks.map(({ year, items }, i) => {
          const h = barHeight(items);
          return (
            <rect
              onClick={() => onClick(year)}
              onMouseOver={() => onHover(year)}
              onMouseLeave={() => onHover(undefined)}
              className="cursor-pointer hover:fill-black"
              key={year}
              x={(barWidth + barGap) * i}
              y={svgHeight - h - marginBottom - marginTop}
              fill="grey"
              width={barWidth}
              height={h}
            />
          );
        })}
      </g>
    </svg>
  );
};

const App = () => {
  const [ticks, setTicks] = useState(initial);
  const [yearClicked, setYearClicked] = useState<number>();
  const [yearHovered, setYearHovered] = useState<number>();
  const { width } = useWindowSize();
  console.log(width);
  return (
    <main>
      <div className="flex">
        <textarea
          className="text-[11px] flex-grow"
          rows={10}
          value={JSON.stringify(ticks).replaceAll("},", "},\n")}
          onChange={(e) => {
            try {
              setTicks(JSON.parse(e.target.value));
            } catch (e) {
              console.error(e);
            }
          }}
        />
      </div>
      <BarChart
        ticks={ticks}
        svgWidth={width ?? window.document.body.clientWidth}
        svgHeight={200}
        onClick={setYearClicked}
        onHover={setYearHovered}
      />
      <div className="flex justify-center mt-4">
        Year clicked: {yearClicked ?? "n/a"}
      </div>
      <div className="flex justify-center">
        Year hovered: {yearHovered ?? "none"}
      </div>
    </main>
  );
};

export default App;
