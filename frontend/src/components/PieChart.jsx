import React from "react";
import { Pie } from "react-chartjs-2";

function PieChart({ chartData, handleLegendClick }) {
  const legendClickHandler = (_, legendItem) => {
    if (handleLegendClick) {
      handleLegendClick(legendItem);
    }
  };

  const chartOptions = {
    ...chartData.options,
    onClick: (_, activeElements) => {
      if (activeElements.length > 0 && handleLegendClick) {
        const legendItem = activeElements[0];
        handleLegendClick(legendItem);
      }
    },
  };

  return <Pie data={chartData} options={chartOptions} />;
}

export default PieChart;
