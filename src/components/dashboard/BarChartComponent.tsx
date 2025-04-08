
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  XAxisProps,
  YAxisProps
} from 'recharts';
import { ChartContainer } from '@/components/ui/chart';

type BarChartComponentProps = {
  title: string;
  data: {
    name: string;
    value: number;
    [key: string]: any;
  }[];
  dataKey: string;
  barColor?: string;
  className?: string;
};

const BarChartComponent: React.FC<BarChartComponentProps> = ({
  title,
  data,
  dataKey,
  barColor = "#2563EB",
  className,
}) => {
  // Define custom XAxis and YAxis props with proper defaults
  const xAxisProps: XAxisProps = {
    dataKey: "name",
    tick: { fontSize: 12 },
    tickLine: false,
    axisLine: { stroke: '#E5E7EB' },
    angle: -45,
    textAnchor: "end",
    height: 60
  };

  const yAxisProps: YAxisProps = {
    axisLine: false,
    tickLine: false,
    tick: { fontSize: 12 }
  };

  return (
    <Card className={`shadow-card ${className}`}>
      <CardHeader>
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 5,
                left: 5,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis {...xAxisProps} />
              <YAxis {...yAxisProps} />
              <Tooltip 
                formatter={(value) => [`${value}`, '']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }}
              />
              <Bar 
                dataKey={dataKey} 
                fill={barColor} 
                radius={[4, 4, 0, 0]} 
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default BarChartComponent;
