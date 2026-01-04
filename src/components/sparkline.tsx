 ;

import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";

interface SparklineProps {
  data: { value: number; date: string }[];
  color?: string;
  height?: number;
}

export function Sparkline({ data, color = "#CCFF00", height = 50 }: SparklineProps) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="bg-[#050505] border border-white/10 p-2 rounded-lg shadow-xl">
                    <p className="text-[10px] text-white/50 uppercase tracking-wider mb-0.5">
                      {item.date}
                    </p>
                    <p className="text-sm font-bold text-white">
                      {item.value.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </p>
                  </div>
                );
              }
              return null;
            }}
            cursor={{ stroke: "white", strokeWidth: 1, strokeOpacity: 0.1 }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: color, stroke: "#000", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}