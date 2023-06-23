import React from "react";
import { Bar } from "react-chartjs-2";
import {Chart} from "chart.js/auto"

function BarChart({ chartData }) {
  return <Bar data={chartData} options={chartData.options} />;
}

export default BarChart;
