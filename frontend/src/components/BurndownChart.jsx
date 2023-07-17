import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import { burndownAll } from "../data";
import { Dropdown, Row, Col, Container } from "react-bootstrap";

function BurndownChart() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const handleYearChange = (eventKey) => {
    setSelectedYear(parseInt(eventKey));
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
        label: "Done",
        data: months.map((month) => {
          const foundMonth = selectedYearData?.progress.find(
            (item) => item.month === month
          );
          return foundMonth ? foundMonth.wp_done : 0;
        }),
        backgroundColor: "#165BAA",
        borderColor: "#165BAA",
      },
      {
        label: "Added",
        data: months.map((month) => {
          const foundMonth = selectedYearData?.progress.find(
            (item) => item.month === month
          );
          return foundMonth ? foundMonth.wp_on_going : 0;
        }),
        backgroundColor: "#A155B9",
        borderColor: "#A155B9",
      },
    ],
    options: {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "bottom",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      aspectRatio: 3
    },
  };

  return (
    <div className="BurdownAll">
      <div className="burdownall-box">
        <Row className="chart-info">
          <Col className="d-flex justify-content-end">
            <Dropdown className="dropdown-custom" onSelect={handleYearChange}>
              <Dropdown.Toggle variant="secondary" id="yearSelect">
                {selectedYear}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {[0, 1, 2, 3, 4].map((index) => (
                  <Dropdown.Item key={index} eventKey={currentYear + index}>
                    {currentYear + index}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
        <hr style={{ marginTop:"0px", height: "2px", background: "black", border: "none" }} />
        <div style={{ height: "300px" }}>
          <Line data={chartData} options={chartData.options} />
        </div>
      </div>
    </div>
  );
}

export default BurndownChart;
