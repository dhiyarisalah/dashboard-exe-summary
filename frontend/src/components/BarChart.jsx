import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

function BarChart({ chartData }) {
  const handleBarClick = (event, barElement) => {
    if (barElement.length > 0) {
      const dataIndex = barElement[0].index;
      const label = chartData.labels[dataIndex];
      window.location.href = "/projectdetails?label=" + label;
    }
  };

  const options = {
    ...chartData.options,
    onClick: handleBarClick, // Attach the onClick event handler
  };

  return <Bar data={chartData} options={options} />;
}

export default BarChart;
