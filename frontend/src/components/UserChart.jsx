import React, { useState, useEffect } from "react";
import {Dropdown, Container, Row, Col, Table } from "react-bootstrap";
import { Pie } from "react-chartjs-2";
import {userDetails, wpDetails } from "../data/index.js";

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

  useEffect(() => {
    const label = getLabelFromURL();
    const user = userDetails.find((user) => user.user_name === label);
    setSelectedUser(user);
  }, []);

  useEffect(() => {
    if (selectedUser) {
      handleChartDataUpdate(selectedItem);
      handleTotalProjectCountUpdate(selectedItem);
      updateTableData(selectedUser, selectedProject);
    }
  }, [selectedUser, selectedItem, selectedProject]);

  useEffect(() => {
    if (selectedItem === "Select Type") {
      setChartData(null);
    }
  }, [selectedItem]);

  function getLabelFromURL() {
    const url = window.location.href;
    const parts = url.split("/");
    const label = parts[parts.length - 1];
    return decodeURIComponent(label);
  }

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
    setShowTableMessage(true);
  }

  function handleChartClick(event, elements) {
    if (elements.length > 0) {
      const selectedIndex = elements[0].index;
      const selectedProject = selectedUser.projects[selectedIndex];
      setSelectedProject(selectedProject);
      updateTableData(selectedUser, selectedProject);
      setShowTableMessage(false);
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
              boxWidth: 15   
            },
          },
        },
        onClick: handleChartClick,
      },
    };
  }

  function updateTableData(selectedUser, selectedProject) {
    if (selectedUser && selectedProject) {
      const userWpDetails = wpDetails.find((user) => user.user_name === selectedUser.user_name);
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
      <h3 className="sub-judul-assignee">Overview</h3>
      <div className="container-chart">
        <Row className="row">
          <div className="title-count">
            Total {selectedItem} <br />
            <span style={{ marginTop: "20px" }} className="count-project">
              {totalProjectCount} {selectedItem}
            </span>
          </div>
        </Row>

        <Row className="row">
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
        <Row className="row">
          {chartData ? (
            <Pie data={chartData} options={chartData.options} />
          ) : (
            <div className="chart-placeholder">
              {selectedItem !== "Select Type" ? "Select type first from dropdown button" : null}
            </div>
          )}
        </Row>
      </div>
      <h3 className="sub-judul-assignee">Project {selectedProject?.project_name}</h3>
      <div>
        <Row className="row">
          {selectedProject ? (
            <Table striped bordered hover style={{ width: "60%", marginLeft: 40 }}>
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
              {showTableMessage ? "Select project first" : "No project selected"}
            </div>
          )}
        </Row>
      </div>
    </Container>
  );
}

export default UserChart;
