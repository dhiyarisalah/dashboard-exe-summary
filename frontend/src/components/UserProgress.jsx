import React, { useState, useEffect } from "react";
import { Dropdown, Container, Row, Col } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import { userProgress } from "../data/index.js";

function StackedChart({ chartData, handleClick }) {
  return <Bar data={chartData} options={{ ...chartData.options, onClick: handleClick }} />;
}

function UserProgress() {
  const dropdownItems = [
    { label: "January", value: "January" },
    { label: "February", value: "February" },
    { label: "March", value: "March" },
    { label: "April", value: "April" },
    { label: "May", value: "May" },
    { label: "June", value: "June" },
    { label: "July", value: "July" },
    { label: "August", value: "August" },
    { label: "September", value: "September" },
    { label: "October", value: "October" },
    { label: "November", value: "November" },
    { label: "December", value: "December" },
  ];

  const options = {
    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: false,
      },
    },
  };

  const getCurrentMonth = () => {
    const currentDate = new Date();
    const month = currentDate.toLocaleString("default", { month: "long" });
    return month;
  };

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [projectData, setProjectData] = useState({});

  const handleDropdownChange = (eventKey) => {
    setSelectedMonth(eventKey);
  };

  const handleBarClick = (event, elements) => {
    if (elements.length > 0) {
      const clickedIndex = elements[0].index;
      const clickedLabel = projectData.labels[clickedIndex];
      window.location.href = `/assigneedetails/${clickedLabel}`;
    }
  };

  useEffect(() => {
    const selectedData =
      userProgress.find((data) => data.hasOwnProperty(selectedMonth)) || [];

    const data = selectedData[selectedMonth] || [];
    const labels = data.map((item) => item.user_name);
    const datasets = [
      {
        indexAxis: "x",
        label: "Done",
        data: data.map((item) => item.wp_done),
        fill: false,
        backgroundColor: ["#327332"],
        barThickness: 50,
      },
      {
        indexAxis: "x",
        label: "Total",
        data: data.map((item) => item.wp_total),
        fill: false,
        backgroundColor: ["#F6C600"],
        barThickness: 50,
      },
    ];

    setProjectData({
      labels: labels,
      datasets: datasets,
      options: options,
    });
  }, [selectedMonth]);

  return (
    <div className="UserProgress">
      <div className="userprogress-box">
        <Row className="chart-info">
          <Col className="d-flex justify-content-end">
            <Dropdown
              onSelect={handleDropdownChange}
              value={selectedMonth}
              className="dropdown-custom .btn-secondary ml-auto"
            >
              <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                {selectedMonth ? selectedMonth : "Select month"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item disabled>Select Month</Dropdown.Item>
                {dropdownItems.map((item) => (
                  <Dropdown.Item
                    key={item.value}
                    eventKey={item.value}
                    active={selectedMonth === item.value}
                  >
                    {item.label}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
        <hr style={{ height: "2px", background: "black", border: "none" }} />
        <Row>
          <div style={{ width: "100%", height: "100%" }}>
            {selectedMonth !== "" ? (
              projectData.labels && projectData.labels.length > 0 ? (
                <StackedChart chartData={projectData} handleClick={handleBarClick} />
              ) : (
                <p className="text-align center">No data available for the selected month.</p>
              )
            ) : (
              <p>Select month first from the dropdown button.</p>
            )}
          </div>
        </Row>
      </div>
    </div>
  );
}

export default UserProgress;
