import React, { useState, useEffect } from "react";
import { Dropdown, Container, Row } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import { userProgress } from "../data/index.js";

function BarChart2({ chartData, handleClick }) {
  return <Bar data={chartData} options={{ ...chartData.options, onClick: handleClick }} />;
}

function Progress() {
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
  };

  const [selectedMonth, setSelectedMonth] = useState("");
  const [projectData, setProjectData] = useState({});

  const handleDropdownChange = (eventKey) => {
    setSelectedMonth(eventKey);
  };

  const handleBarClick = (event, elements) => {
    if (elements.length > 0) {
      const clickedIndex = elements[0].index;
      const clickedLabel = projectData.labels[clickedIndex];
      window.location.href = `/user/${clickedLabel}`;
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
        label: "Project Progress (Total)",
        data: data.map((item) => item.wp_total),
        fill: false,
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
        ],
        borderColor: "black",
        borderWidth: 1,
        barThickness: 30,
      },
      {
        indexAxis: "x",
        label: "Project Progress (Done)",
        data: data.map((item) => item.wp_done),
        fill: false,
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
        ],
        borderColor: "black",
        borderWidth: 1,
        barThickness: 30,
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
      <Container className="userprogress-box">
        <Row>
          <Dropdown onSelect={handleDropdownChange} value={selectedMonth}>
            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
              {selectedMonth ? selectedMonth : "Select month"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
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
        </Row>
        <Row>
          <div style={{ width: "100%", height: "100%" }}>
            {projectData.labels ? (
              <BarChart2 chartData={projectData} handleClick={handleBarClick} />
            ) : (
              <p>No data available for the selected month.</p>
            )}
          </div>
        </Row>
      </Container>
    </div>
  );
}

export default Progress;
