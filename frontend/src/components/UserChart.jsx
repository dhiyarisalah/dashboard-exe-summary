import React, { useState, useEffect } from "react";
import { Modal, Dropdown, Container, Row, Col, Table } from "react-bootstrap";
import { Pie } from "react-chartjs-2";
import { projectStatus, projectPriority, userDetails, wpDetails } from "../data/index.js";

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
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const label = getLabelFromURL(); // Get the label from the URL
    const user = userDetails.find((user) => user.user_name === label); // Find the user based on the label
    setSelectedUser(user); // Set the selected user
  }, []);

  useEffect(() => {
    if (selectedUser) {
      handleChartDataUpdate(selectedItem);
      handleTotalProjectCountUpdate(selectedItem);
      updateTableData(selectedUser, selectedProject);
    }
  }, [selectedUser, selectedItem, selectedProject]);

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

  function handleDropdownSelect(eventKey) {
    setSelectedItem(eventKey);
    handleChartDataUpdate(eventKey);
    handleTotalProjectCountUpdate(eventKey);
  }

  function handleChartClick(event, elements) {
    if (elements.length > 0) {
      const selectedIndex = elements[0].index;
      const selectedProject = selectedUser.projects[selectedIndex];
      setSelectedProject(selectedProject);
      updateTableData(selectedUser, selectedProject);
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
      <h3 className='sub-judul-assignee'>Overview</h3>
      <div className="container-chart">
        <Row className="row">
          <div className="title-count">
            Total {selectedItem} <br /> 
            <span className="count-project">
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
        <Row className="row">
          <Pie data={chartData} options={chartData.options} />
        </Row>
      </div>
      <h3 className="sub-judul-assignee">Project {selectedProject?.project_name}</h3>
      <div>
        <Row className="row">
          {selectedProject && (
            <Table striped bordered hover style={{ width: '60%', marginLeft: 40 }}>
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
          )}
        </Row>
      </div>
    </Container>
  );
}

export default UserChart;
