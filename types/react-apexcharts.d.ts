declare module 'react-apexcharts' {
  import { ComponentType } from 'react';
  import type { ApexOptions } from 'apexcharts';

  export interface ReactApexChartProps {
    type?: 'line' | 'area' | 'bar' | 'pie' | 'donut' | 'radialBar' | 'scatter' | 'bubble' | 'heatmap' | 'candlestick' | 'radar' | 'polarArea' | 'rangeBar' | 'treemap';
    series: any;
    options?: ApexOptions;
    width?: string | number;
    height?: string | number;
  }

  const ReactApexChart: ComponentType<ReactApexChartProps>;
  export default ReactApexChart;
}
