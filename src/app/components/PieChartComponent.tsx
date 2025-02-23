import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

interface PieChartComponentProps {
  data: Array<{ name: string; value: number }>;
  colors: string[];
}

const PieChartComponent: React.FC<PieChartComponentProps> = ({
  data,
  colors,
}) => (
  <ResponsiveContainer width="100%" height="100%">
    <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={({ name, percent }) =>
          `${name} (${(percent * 100).toFixed(0)}%)`
        }
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
);

export default PieChartComponent;
