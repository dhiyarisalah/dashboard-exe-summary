import React, { useState, useEffect } from "react";
import { Dropdown, Row, Col, ListGroup } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import { userProgress, progressProject } from "../data/index.js";
import Profil from "../assets/profile.png";

function StackedChart({ chartData, handleClick }) {
  return (
    <div>
      <h3>Assignees Progress</h3>
      <Bar data={chartData} options={{ ...chartData.options, onClick: handleClick }}/>
    </div>
  ) 
  
}

function ProjectDetailsChart({ projectData, selectedLabel }) {
  return (
    <div>
      <h3>Details for {selectedLabel}</h3>
      <Bar data={projectData} options={{ ...projectData.options }} />
    </div>
  );
}

function UserProgress() {
  const dropdownMonths = [
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

  const getCurrentYear = () => {
    return new Date().getFullYear();
  };

  const dropdownYears = Array.from({ length: 5 }, (_, index) => {
    return { label: (getCurrentYear() + index).toString(), value: (getCurrentYear() + index).toString() };
  });

  const options = {
    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false,
        },
      },
      y: {
        beginAtZero: true,
      },
    },
    responsive: true,
    elements: {
      bar: {
        borderWidth: 3,
      },
    },
  };
  

  const getCurrentMonth = () => {
    const currentDate = new Date();
    const month = currentDate.toLocaleString("default", { month: "long" });
    return month;
  };

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [selectedYear, setSelectedYear] = useState(getCurrentYear().toString());
  const [projectData, setProjectData] = useState({});
  const [userNames, setUserNames] = useState([]);
  const [selectedProjectData, setSelectedProjectData] = useState({});
  const [selectedProjectLabel, setSelectedProjectLabel] = useState(""); // Add this state

  const handleDropdownChange = (eventKey) => {
    setSelectedMonth(eventKey);
  };

  const handleYearDropdownChange = (eventKey) => {
    setSelectedYear(eventKey);
  };

  const handleBarClick = (event, elements) => {
    if (elements.length > 0) {
      const clickedIndex = elements[0].index;
      const clickedLabel = projectData.labels[clickedIndex];
      const projectDetailsData = progressProject.find(data => data.hasOwnProperty(selectedYear));
      const yearData = projectDetailsData[selectedYear];
      const monthData = yearData[selectedMonth];
      const userData = monthData[clickedLabel];
      const labels = Object.keys(userData);
      const datasets = [
        {
          indexAxis: "x",
          label: "Total",
          data: Object.values(userData).map((item) => item.wp_total),
          fill: false,
          backgroundColor: ["#F6C600"],
          barThickness: 40,
        },
        {
          indexAxis: "x",
          label: "Done",
          data: Object.values(userData).map((item) => item.wp_done),
          fill: false,
          backgroundColor: ["#327332"],
          barThickness: 40,
        },
      ];

      setSelectedProjectData({
        labels: labels,
        datasets: datasets,
        options: options,
      });
      setSelectedProjectLabel(clickedLabel); // Add this line to update the selected project label
    }
  };

  useEffect(() => {
    const selectedData = userProgress.find((data) => data.hasOwnProperty(selectedYear)) || {};

    const selectedYearData = selectedData[selectedYear] || {};

    const data = selectedYearData[selectedMonth] || {};

    const labels = Object.keys(data);
    const datasets = [
      {
        indexAxis: "x",
        label: "Total",
        data: Object.values(data).map((item) => item.wp_total),
        fill: false,
        backgroundColor: ["#F6C600"],
        barThickness: 40,
        group: 1
      },
      {
        indexAxis: "x",
        label: "Done",
        data: Object.values(data).map((item) => item.wp_done),
        fill: false,
        backgroundColor: ["#327332"],
        barThickness: 40,
        group: 1
      },
    ];

    setProjectData({
      labels: labels,
      datasets: datasets,
      options: options,
    });

    setUserNames(labels);

    setSelectedProjectData({
      labels: [],
      datasets: [],
      options: options,
    });
  }, [selectedMonth, selectedYear]);

  const handleUserClick = (userName) => {
    window.location.href = `/assigneedetails/${userName}`;
  };

  return (
    <div className="UserProgress">
      <div className="userprogress-box">
        <Row className="chart-info">
          <Col className="d-flex justify-content-end">
          <Dropdown
              style={{marginRight:"10px"}}
              onSelect={handleYearDropdownChange}
              value={selectedYear}
              className="dropdown-custom .btn-secondary ml-auto"
            >
              <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                {selectedYear ? selectedYear : "Select year"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item disabled>Select Year</Dropdown.Item>
                {dropdownYears.map((item) => (
                  <Dropdown.Item
                    key={item.value}
                    eventKey={item.value}
                    active={selectedYear === item.value}
                  >
                    {item.label}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
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
                {dropdownMonths.map((item) => (
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
        <hr style={{ margin: "0px 0px 20px 0px", height: "2px", background: "black", border: "none" }} />
        <Row>
          <Col md={3} className="d-flex flex-column" style={{borderColor: "black"}}>
            <div className="assignees-container">
              <h3>List of Assignees</h3>
              <ListGroup style={{ flex: 1, overflowY: "auto"}}>
                {userNames.map((userName) => (
                  <ListGroup.Item
                    key={userName}
                    action
                    onClick={() => handleUserClick(userName)}
                    style={{ cursor: "pointer" }}
                  >
                    <span style={{ marginRight: "10px" }}>
                      <img src={Profil} alt="Profile Icon" style={{ width: "30px" }} />
                    </span>
                    {userName}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          </Col>
          <Col md={8}>
            <div>
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
          </Col>
        </Row>
        <Row>
          <Col md={12} >
          <hr style={{ margin:"20px 0px 20px 0px", height: "2px", background: "black", border: "none" }} />
            <div style={{ width: "60",alignItems: "center" }}>
              {selectedProjectData.labels && selectedProjectData.labels.length > 0 ? (
                <ProjectDetailsChart projectData={selectedProjectData} selectedLabel={selectedProjectLabel} />
              ) : (
                <p className="text-align center">No project details data available.</p>
              )}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default UserProgress;
