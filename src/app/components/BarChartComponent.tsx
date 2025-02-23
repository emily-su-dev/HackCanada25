import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface BarChartComponentProps {
  data: Array<{ range: string; count: number }>;
}

const BarChartComponent: React.FC<BarChartComponentProps> = ({ data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey="range"
        angle={-45}
        textAnchor="end"
        height={60}
        interval={0}
        label={{
          value: 'Fail Rate Range',
          position: 'insideBottom',
          offset: -10,
        }}
      />
      <YAxis
        label={{
          value: 'Number of Employees',
          angle: -90,
          position: 'insideLeft',
          dy: 60, // move the label down so it isn't cut off
        }}
      />
      <Tooltip />
      <Bar dataKey="count" fill="#8884d8">
        {data.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={`#416aa8`}
          />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
);

export default BarChartComponent;
