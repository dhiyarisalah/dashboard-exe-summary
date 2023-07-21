import React, { useState, useEffect } from "react";
import { Dropdown, Container, Row, Col, Table } from "react-bootstrap";
import { Pie } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

function UserChart() {
  const dropdownItems = [
    { label: "Work Packages", value: "Work Packages" },
    { label: "Story Points", value: "Story Points" },
  ];

  const [selectedItem, setSelectedItem] = useState("Work Packages");
  const [chartData, setChartData] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [showTableMessage, setShowTableMessage] = useState(true);
  const [isProjectSelected, setIsProjectSelected] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [userNameFromURL, setUserNameFromURL] = useState(null);
  const [totalWP, setTotalWP] = useState(0);
  const [totalSP, setTotalSP] = useState(0);

  function formatDate(date) {
    return date.toISOString().slice(0, 10);
  }

  async function fetchUserData(start, end) {
    try {
      const response = await axios.get(
        `https://sw.infoglobal.id/executive-summary-dashboard/get-assignee-details?start_date=${start}&end_date=${end}`
      );
      const data = response.data;

      if (data && Array.isArray(data)) {
        setSelectedUser(data);
      } else {
        setSelectedUser(null);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  async function fetchWpData(start, end) {
    try {
      const response = await axios.get(
        `https://sw.infoglobal.id/executive-summary-dashboard/get-assignee-wp-details?start_date=${start}&end_date=${end}`
      );
      const data = response.data;

      if (data && Array.isArray(data)) {
        setTotalWP(data.find((user) => user.user_name === userNameFromURL)?.total_wp || 0);
        setTotalSP(data.find((user) => user.user_name === userNameFromURL)?.total_sp || 0);

        if (selectedItem === "Work Packages") {
          setChartData(generateChartData(data.find((user) => user.user_name === userNameFromURL)?.projects || [], "project_name"));
        } else if (selectedItem === "Story Points") {
          setChartData(generateChartData(data.find((user) => user.user_name === userNameFromURL)?.projects || [], "project_name"));
        }

        handleTableDataUpdate(data.find((user) => user.user_name === userNameFromURL)?.projects || []);
      } else {
        setTotalWP(0);
        setTotalSP(0);
        setChartData(null);
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching work package data:", error);
    }
  }

  function handleStartDateChange(date) {
    setStartDate(date);
  }

  function handleEndDateChange(date) {
    setEndDate(date);
  }

  function handleChartClick(event, elements) {
    if (elements.length > 0) {
      const selectedIndex = elements[0].index;
      const selectedProject = selectedUser?.find((user) => user.user_name === userNameFromURL)?.projects[selectedIndex];
      setSelectedProject(selectedProject);
    }
  }

  function handleDropdownSelect(eventKey) {
    setSelectedItem(eventKey);

    // Calculate the totalWP and totalSP based on the selected item
    if (eventKey === "Work Packages") {
      setTotalWP(selectedUser?.find((user) => user.user_name === userNameFromURL)?.total_wp || 0);
      setTotalSP(0);
      setChartData(generateChartData(selectedUser?.find((user) => user.user_name === userNameFromURL)?.projects || [], "project_name"));
    } else if (eventKey === "Story Points") {
      setTotalWP(0);
      setTotalSP(selectedUser?.find((user) => user.user_name === userNameFromURL)?.total_sp || 0);
      setChartData(generateChartData(selectedUser?.find((user) => user.user_name === userNameFromURL)?.projects || [], "project_name"));
    }

    handleTableDataUpdate(selectedUser?.find((user) => user.user_name === userNameFromURL)?.projects || []);
    setSelectedProject(null); // Reset selected project
    setShowTableMessage(true);
  }

  function handleChartDataUpdate(data, property) {
    if (!data || data.length === 0) {
      setChartData(null);
    } else {
      setChartData(generateChartData(data, property));
    }
  }

  function generateChartData(data, property) {
    if (!data || !Array.isArray(data)) {
      return null;
    }

    const labels = data.map((project) => project[property]);
    const values = data.map((project) => project[selectedItem === "Work Packages" ? "wp_assigned" : "story_points"]);

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

  function handleTableDataUpdate(data) {
    if (selectedProject) {
      const projectData = data.find((project) => project.project_name === selectedProject.project_name);
      if (projectData) {
        const wpAssigned = projectData.wp_assigned;
        const tableData = wpAssigned.map((wp) => ({
          wp_name: wp.wp_name,
          progress: wp.progress,
          story_points: wp.story_points,
        }));
        setTableData(tableData);
      }
    }
  }

  function getLabelFromURL() {
    const url = window.location.href;
    const parts = url.split("/");
    const label = parts[parts.length - 1];
    return decodeURIComponent(label);
  }

  useEffect(() => {
    // Fetch user data when the component mounts (initial page load)
    setUserNameFromURL(getLabelFromURL());

    // Check if the date pickers have valid dates selected before making the API call
    if (startDate && endDate) {
      fetchUserData(startDate, endDate);
      fetchWpData(startDate, endDate);
    }
  }, []);

  useEffect(() => {
    // Fetch user data when either of the dates change
    if (startDate && endDate) {
      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);
      fetchUserData(formattedStartDate, formattedEndDate);
      fetchWpData(formattedStartDate, formattedEndDate);
    }
  }, [startDate, endDate]);

  return (
    <Container fluid className="user-components">
      <Row>
        <Col>
          <h3 className="sub-judul-assignee">Date Range</h3>
          <div className="date-inputs">
            <div className="date-label">Start Date:</div>
            <DatePicker
              selected={startDate ? new Date(startDate) : null}
              onChange={handleStartDateChange}
              dateFormat="yyyy-MM-dd"
              isClearable
              showYearDropdown
              scrollableYearDropdown
            />
          </div>
          <div className="date-inputs">
            <div className="date-label">End Date:</div>
            <DatePicker
              selected={endDate ? new Date(endDate) : null}
              onChange={handleEndDateChange}
              dateFormat="yyyy-MM-dd"
              isClearable
              showYearDropdown
              scrollableYearDropdown
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <h3 className="sub-judul-assignee">Overview</h3>
          <div className="container-chart">
            <div className="title-count">
              Total {selectedItem} <br />
              <span style={{ marginTop: "20px" }} className="count-project">
                {selectedItem === "Work Packages" ? totalWP : totalSP} {selectedItem}
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
              <Pie data={chartData} />
            ) : (
              <div className="no-data-message">No data available</div>
            )}
          </div>
        </Col>
        <Col>
          <h3 className="sub-judul-assignee">Project Details</h3>
          <div className="project-table">
            {isProjectSelected ? (
              <div>
                <h4>{selectedProject?.project_name}</h4>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Work Package Name</th>
                      <th>Progress</th>
                      <th>Story Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((item, index) => (
                      <tr key={index}>
                        <td>{item.wp_name}</td>
                        <td>{item.progress}</td>
                        <td>{item.story_points}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : showTableMessage ? (
              <div className="no-data-message">No project selected</div>
            ) : (
              <div className="no-data-message">No data available</div>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default UserChart;
