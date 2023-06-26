import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js";
import { LineController, LineElement, PointElement, LinearScale, Title } from "chart.js";
Chart.register(LineController, LineElement, PointElement, LinearScale, Title);

function Ganttchart() {
  const chartRef = useRef(null);

  useEffect(() => {
    // Setup
    const data = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Weekly Sales',
        data: [18, 12, 6, 9, 12, 3, 9],
        backgroundColor: [
          'rgba(255, 26, 104, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(0, 0, 0, 0.2)'
        ],
        borderColor: [
          'rgba(255, 26, 104, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(0, 0, 0, 1)'
        ],
        borderWidth: 1
      }]
    };

    // Config
    const config = {
      type: 'bar',
      data: data,
      options: {
        indexAxis: 'y',
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
            }
          }
        }
      }
    };

    // Render chart
    const ctx = chartRef.current.getContext("2d");
    new Chart(ctx, config);

  }, []);

  return (
    <div className="Progress">
      <canvas ref={chartRef} id="myChart" width="400" height="400"></canvas>
    </div>
  );
}

export default Ganttchart;
