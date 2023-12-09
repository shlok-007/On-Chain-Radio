import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface CustomChartOptions {
  responsive: boolean;
  tension: number;
  plugins: {
    legend: {
      position?: "top" | "center" | "left" | "right" | "bottom" | "chartArea" | { [scaleId: string]: number } | undefined;
      display: boolean
    };
  };
  scales?: { // Add scales to the type definition
    x?: {
      beginAtZero?: boolean;
      ticks?: {
        color?: string;
      };
    };
    y?: {
      beginAtZero?: boolean;
      ticks?: {
        color?: string;
      };
    };
  };
}

export const options: CustomChartOptions = {
  responsive: true,
  tension: 0.4,
  plugins: {
    legend: {
      position: "top",
      display: false
    },
  },
  scales: {
    x: {
      beginAtZero: true,
      ticks: {
        color: '#ffffff',
      },
    },
    y: {
      beginAtZero: true,
      ticks: {
        color: '#ffffff',
      },
    },
  },
};

const labels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

export const data = {
  labels,
  datasets: [
    {
      label: "Expenses",
      data: [
        15000, 10000, 14000, 11000, 16000, 12000, 8000, 14000, 11000, 12000,
        23000, 12000,
      ],
      borderColor: "rgb(255, 255, 255)",
      backgroundColor: "rgba(255, 255, 255, 1)",
    },
  ],
};

export default function App() {
  return <Line options={options} data={data} />;
}
