import React, { useState, useEffect } from "react";
import { Dropdown, Row, Col, ListGroup } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import Profil from "../assets/profile.png";
import axios from "axios";

function StackedChart({ chartData, handleClick }) {
  return (
    <div>
      <h3>Assignees Progress</h3>
      <Bar data={chartData} options={{ ...chartData.options, onClick: handleClick }} />
    </div>
  );
}

function ProjectDetailsChart({ projectData, selectedLabel }) {
  return (
    <div>
      <h3 style={{ paddingLeft: "0px" }}>Details for {selectedLabel}</h3>
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
  const [selectedProjectLabel, setSelectedProjectLabel] = useState("");
  const [userProgress, setUserProgress] = useState({});
  const [progressProject, setProgressProject] = useState({});
  const [isLoadingData, setIsLoadingData] = useState(true);

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
      const projectDetailsData = progressProject[selectedYear][selectedMonth][clickedLabel];
      const labels = Object.keys(projectDetailsData);
      const datasets = [
        {
          indexAxis: "x",
          label: "Total",
          data: labels.map((item) => projectDetailsData[item].wp_total),
          fill: false,
          backgroundColor: ["#F6C600"],
          barThickness: 40,
        },
        {
          indexAxis: "x",
          label: "Done",
          data: labels.map((item) => projectDetailsData[item].wp_done),
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
      setSelectedProjectLabel(clickedLabel);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setIsLoadingData(true);
    try {
      const [userProgressResponse, progressProjectResponse] = await Promise.all([
        axios.get("https://sw.infoglobal.id/nirmala/backend/get-progress-assignee-total"),
        axios.get("https://sw.infoglobal.id/nirmala/backend/get-progress-assignee")
      ]);

      const userProgressData = userProgressResponse.data;
      const progressProjectData = progressProjectResponse.data;

      setUserProgress(userProgressData);
      setProgressProject(progressProjectData);

      console.log("Data fetched successfully:", userProgressData, progressProjectData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoadingData(false);
    }
  }

  const handleUserClick = (userName) => {
    window.location.href = `/nirmala/assigneedetails/${userName}`;
  };

  useEffect(() => {
    if (userProgress && userProgress[selectedYear] && userProgress[selectedYear][selectedMonth]) {
      const data = userProgress[selectedYear][selectedMonth];
      const labels = Object.keys(data);
      const datasets = [
        {
          indexAxis: "x",
          label: "Total",
          data: labels.map((userName) => data[userName].wp_total),
          fill: false,
          backgroundColor: ["#F6C600"],
          barThickness: 40,
          group: 1,
        },
        {
          indexAxis: "x",
          label: "Done",
          data: labels.map((userName) => data[userName].wp_done),
          fill: false,
          backgroundColor: ["#327332"],
          barThickness: 40,
          group: 1,
        },
      ];
      setProjectData({
        labels: labels,
        datasets: datasets,
        options: options,
      });

      setUserNames(labels);
    } else {
      // If there's no data available, set projectData to an empty object {}
      setProjectData({});
      setUserNames([]);

      // Reset selectedProjectData and selectedProjectLabel when there's no data available
      setSelectedProjectData({});
      setSelectedProjectLabel("");
    }
  }, [selectedMonth, selectedYear, userProgress]);

  return (
    <div className="UserProgress">
      <div className="userprogress-box">
        <Row className="chart-info">
          <Col className="d-flex justify-content-end">
            <Dropdown
              style={{ marginRight: "10px" }}
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
        <hr
          style={{ margin: "0px 0px 20px 0px", height: "2px", background: "black", border: "none" }}
        />
        <Row>
          <Col md={3} className="d-flex flex-column" style={{ borderColor: "black" }}>
            <div>
              <h3>List of Assignees</h3>
              <ListGroup style={{ flex: 1, overflowY: "auto" }}>
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
          {/* Check if data is loading */}
          {isLoadingData ? (
                <p>Loading...</p>
              ) : selectedMonth !== "" ? (
                Array.isArray(projectData.labels) && projectData.labels.length > 0 ? (
                  <StackedChart chartData={projectData} handleClick={handleBarClick} />
                ) : (
                  <p className="text-align-center">No data available for the selected month.</p>
                )
              ) : (
                <p>Select month first from the dropdown button.</p>
              )}
            </div>
          </Col>
        </Row>
        <Row>
        <Col md={12}>
            <hr
              style={{ margin: "20px 0px 20px 0px", height: "2px", background: "black", border: "none" }}
            />
            <div>
              {/* Check if data is loading */}
              {isLoadingData ? (
                <p>Loading...</p>
              ) : selectedProjectData.labels && selectedProjectData.labels.length > 0 ? (
                <ProjectDetailsChart projectData={selectedProjectData} selectedLabel={selectedProjectLabel} />
              ) : (
                // Show message when selectedProjectData.labels is empty and selectedProjectLabel is empty
                selectedProjectLabel === "" && (
                  <p className="text-align-center">Click specific user first</p>
                )
              )}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default UserProgress;
