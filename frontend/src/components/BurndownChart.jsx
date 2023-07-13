import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import { burndownAll } from "../data";

function BurndownChart() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value));
  };

  const selectedYearData = burndownAll.find((item) => item.year === selectedYear);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const chartData = {
    labels: months,
    datasets: [
      {
        label: "Work Done",
        data: months.map((month) => {
          const foundMonth = selectedYearData?.progress.find(
            (item) => item.month === month
          );
          return foundMonth ? foundMonth.wp_done : 0;
        }),
        borderColor: "blue",
      },
      {
        label: "Work Ongoing",
        data: months.map((month) => {
          const foundMonth = selectedYearData?.progress.find(
            (item) => item.month === month
          );
          return foundMonth ? foundMonth.wp_on_going : 0;
        }),
        borderColor: "green",
      },
    ],
    options: {}, // Add any additional options you want to specify for the chart
  };

  return (
    <div className="container mt-4">
      <h2>Burndown Chart</h2>
      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="yearSelect">Select Year:</label>
            <select
              id="yearSelect"
              className="form-control"
              value={selectedYear}
              onChange={handleYearChange}
            >
              {[0, 1, 2, 3, 4].map((index) => (
                <option key={index} value={currentYear + index}>
                  {currentYear + index}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <Line data={chartData} options={chartData.options} />
        </div>
      </div>
    </div>
  );
}

export default BurndownChart;
