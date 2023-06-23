import React from "react";
import { Pie } from "react-chartjs-2";

function PieChart({ chartData }) {
  return <Pie data={chartData} options={chartData.options} />;
}

export default PieChart;
