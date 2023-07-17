import React, { useState, useEffect } from "react";
import { Dropdown, Container, Row, Col, Table } from "react-bootstrap";
import { Pie } from "react-chartjs-2";
import { userDetails, wpDetails } from "../data/index.js";

function UserChart() {
  const dropdownItems = [
    { label: "Work Packages", value: "Work Packages" },
    { label: "User Points", value: "Story Points" },
  ];

  const [selectedItem, setSelectedItem] = useState("Work Packages");
  const [chartData, setChartData] = useState(null);
  const [totalProjectCount, setTotalProjectCount] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [showTableMessage, setShowTableMessage] = useState(true);
  const [isProjectSelected, setIsProjectSelected] = useState(false);

  useEffect(() => {
    const label = getLabelFromURL();
    const user = userDetails.find((user) => user.user_name === label);
    setSelectedUser(user);
  }, []);

  function getLabelFromURL() {
    const url = window.location.href;
    const parts = url.split("/");
    const label = parts[parts.length - 1];
    return decodeURIComponent(label);
  }

  useEffect(() => {
    if (selectedUser) {
      handleChartDataUpdate(selectedItem);
      handleTotalProjectCountUpdate(selectedItem);
      setShowTableMessage(true);
    }
  }, [selectedUser, selectedItem]);

  useEffect(() => {
    if (selectedUser && selectedProject) {
      updateTableData(selectedUser, selectedProject);
      setIsProjectSelected(true); // Set the project selection flag
    } else {
      setTableData([]);
      setIsProjectSelected(false); // Reset the project selection flag
    }
  }, [selectedProject]);

  function handleTotalProjectCountUpdate(selectedValue) {
    if (selectedValue === "Work Packages") {
      setTotalProjectCount(selectedUser.total_wp);
    } else if (selectedValue === "Story Points") {
      setTotalProjectCount(selectedUser.total_sp);
    }
  }

  function handleChartDataUpdate(selectedValue) {
    if (selectedValue === "Work Packages") {
      setChartData(generateChartData(selectedUser.projects, "wp_assigned"));
    } else if (selectedValue === "Story Points") {
      setChartData(generateChartData(selectedUser.projects, "story_points"));
    }
  }

  function handleDropdownSelect(eventKey) {
    setSelectedItem(eventKey);
    handleChartDataUpdate(eventKey);
    handleTotalProjectCountUpdate(eventKey);
    setSelectedProject(null); // Reset selected project
    setShowTableMessage(true);
  }

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
              padding: 30,
              boxWidth: 15,
            },
          },
        },
        onClick: handleChartClick,
      },
    };
  }

  function updateTableData(selectedUser, selectedProject) {
    if (selectedUser && selectedProject) {
      const userWpDetails = wpDetails.find(
        (user) => user.user_name === selectedUser.user_name
      );
      const projectWpDetails = userWpDetails.projects.find(
        (project) => project.project_name === selectedProject.project_name
      );
      const wpAssigned = projectWpDetails.wp_assigned;

      const tableData = wpAssigned.map((wp) => ({
        wp_name: wp.wp_name,
        progress: wp.progress,
        story_points: wp.story_points,
      }));

      setTableData(tableData);
    }
  }

  return (
    <Container fluid className="user-components">
      <Row>
        <Col>
          <h3 className="sub-judul-assignee">Overview</h3>
          <div className="container-chart">
            <div className="title-count">
              Total {selectedItem} <br />
              <span style={{ marginTop: "20px" }} className="count-project">
                {totalProjectCount} {selectedItem}
              </span>
            </div>
            <Row>
              <Col className="d-flex justify-content-end">
                <Dropdown onSelect={handleDropdownSelect}>
                  <Dropdown.Toggle variant="primary" id="dropdown-basic">
                    {selectedItem}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {dropdownItems.map((item, index) => (
                      <Dropdown.Item key={index} eventKey={item.value}>
                        {item.label}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
            </Row>
            <hr style={{ height: "2px", background: "black", border: "none" }} />
            {chartData ? (
              <Pie data={chartData} options={chartData.options} />
            ) : (
              <div className="chart-placeholder">
                {selectedItem !== "Select Type"
                  ? "Select type first from dropdown button"
                  : null}
              </div>
            )}
          </div>
        </Col>
        <Col >
          <div className="container-chart" style={{ marginTop: 85}}>
          <h3 className="sub-judul-assignee" >Project {selectedProject?.project_name}</h3>
            <Row className="row">
              {isProjectSelected ? (
                <Table striped bordered hover style={{ width: "100%"}}>
                  <thead>
                    <tr>
                      <th>Work Packages</th>
                      <th>Progress</th>
                      <th>Story Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row, index) => (
                      <tr key={index}>
                        <td>{row.wp_name}</td>
                        <td>{row.progress}</td>
                        <td>{row.story_points}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="table-placeholder">
                  {showTableMessage ? "Select project from the chart" : "No project selected"}
                </div>
              )}
            </Row>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default UserChart;
