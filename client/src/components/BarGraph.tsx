import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';  // Import Chart and registerables

Chart.register(...registerables);  // Register the necessary components

interface MyChartProps {
    votes_for: number|undefined,
    votes_against: number|undefined
}

const MyChart: React.FC<MyChartProps> = ({ votes_against, votes_for }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  const data = {
    labels: ['For', 'Against'],
    datasets: [
      {
        label: "Number of Votes",
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75,192,192,0.4)',
        hoverBorderColor: 'rgba(75,192,192,1)',
        data: [votes_for, votes_against],
      },
    ],
  };

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');

      if (ctx) {
        new Chart(ctx, {
          type: 'bar',
          data:data,
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      }
    }
  }, []); // Empty dependency array ensures that this effect runs only once after the initial render

  return (
    <div className='w-3/4 lg:w-1/2 m-auto'>
      <canvas ref={chartRef} width="400" height="200"></canvas>
    </div>
  );
};

export default MyChart;
