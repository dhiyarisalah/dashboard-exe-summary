import React from "react";
import { Bar } from "react-chartjs-2";
import {Chart} from "chart.js/auto"

function BarChart2({ chartData, options }) {
  return <Bar data={chartData} options={options} />
}

export default BarChart2;
