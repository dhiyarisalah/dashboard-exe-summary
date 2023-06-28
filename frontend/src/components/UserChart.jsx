import React, { useState, useEffect } from "react";
import { Modal, Dropdown, Container, Row, Col, Table } from "react-bootstrap";
import { Pie } from "react-chartjs-2";
import { projectStatus, projectPriority, userDetails } from "../data/index.js";

function UserChart() {
  const dropdownItems = [
    { label: "work packages", value: "work packages" },
    { label: "user points", value: "story points" },
  ];

  const [selectedItem, setSelectedItem] = useState("select type");
  const [chartData, setChartData] = useState(generateChartData(projectStatus));
  const [totalProjectCount, setTotalProjectCount] = useState(0); // Initialize with 0
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const label = getLabelFromURL(); // Get the label from the URL
    const user = userDetails.find((user) => user.user_name === label); // Find the user based on the label
    setSelectedUser(user); // Set the selected user
  }, []);

  useEffect(() => {
    if (selectedUser) {
      handleChartDataUpdate(selectedItem);
      handleTotalProjectCountUpdate(selectedItem);
    }
  }, [selectedUser, selectedItem]);

  function getLabelFromURL() {
    // Logic to extract the label from the URL
    const url = window.location.href;
    const parts = url.split("/");
    const label = parts[parts.length - 1];
    return decodeURIComponent(label);
  }

  function handleTotalProjectCountUpdate(selectedValue) {
    if (selectedValue === "work packages") {
      setTotalProjectCount(selectedUser.total_wp);
    } else if (selectedValue === "story points") {
      setTotalProjectCount(selectedUser.total_sp);
    }
  }

  function handleChartDataUpdate(selectedValue) {
    if (selectedValue === "work packages") {
      setChartData(generateChartData(selectedUser.projects, "wp_assigned"));
    } else if (selectedValue === "story points") {
      setChartData(generateChartData(selectedUser.projects, "story_points"));
    }
  }

  const handleDropdownSelect = (eventKey) => {
    setSelectedItem(eventKey);
    handleChartDataUpdate(eventKey);
    handleTotalProjectCountUpdate(eventKey);
  };

  function handleChartClick(event, elements) {
    if (elements.length > 0) {
      const selectedIndex = elements[0].index;
      const selectedProject = selectedUser.projects[selectedIndex];
      setSelectedProject(selectedProject);
    }
  }

  function generateChartData(data, property) {
    const labels = data.map((project) => project.project_name);
    const values = data.map((project) => project[property]);

    return {
      labels: labels,
      datasets: [
        {
          label: "Total",
          data: values,
          backgroundColor: ["#FA4907", "#327332", "#165BAA", "#F6C600"],
        },
      ],
      options: {
        plugins: {
          legend: {
            position: "right",
            labels: {
              paddingLeft: 20,
              boxWidth: 12,
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            },
          },
        },
        onClick: handleChartClick,
      },
    };
  }

  if (!selectedUser) {
    return <div>Loading...</div>; // Display a loading state while fetching the user data
  }

  return (
    <div className="ProjectChart">
      <Container className="project-box">
        <Row>
          <Col>
            <div className="title-count">
              Total {selectedItem} <br />
              <span className="count-project">
                {totalProjectCount} {selectedItem}
              </span>
            </div>
          </Col>
          <Col>
            <Dropdown className="dropdown-custom" onSelect={handleDropdownSelect}>
              <Dropdown.Toggle variant="secondary" id="dropdownMenu2">
                {selectedItem}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {dropdownItems.map((item) => (
                  <Dropdown.Item key={item.value} eventKey={item.value}>
                    {item.label}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
        <div style={{ width: "100%", height: "100%" }}>
          <Pie data={chartData} options={chartData.options} />
        </div>
        <div>
          <h3 className='overview'>Project {selectedProject?.project_name}</h3>
          {selectedProject && (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Work Packages</th>
                  <th>Progress</th>
                  <th>Story Points</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{selectedProject.project_name}</td>
                  <td>{selectedProject.property1}</td>
                  <td>{selectedProject.property2}</td>
                </tr>
              </tbody>
            </Table>
          )}
        </div>
      </Container>
    </div>
  );
}

export default UserChart;
