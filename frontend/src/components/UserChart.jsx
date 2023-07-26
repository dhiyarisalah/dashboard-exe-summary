import React, { useState, useEffect } from "react";
import { Dropdown, Container, Row, Col, Button } from "react-bootstrap";
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
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [userNameFromURL, setUserNameFromURL] = useState(null);
  const [totalWP, setTotalWP] = useState(0);
  const [totalSP, setTotalSP] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);
  const [selectedSliceIndex, setSelectedSliceIndex] = useState(null);
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [tableData, setTableData] = useState([]);

  function formatDate(date) {
    return date.toISOString().slice(0, 10);
  }

  async function fetchUserData(start = "", end = "") {
    try {
      const url = "https://sw.infoglobal.id/nirmala/backend/get-assignee-details";
      const response = await axios.get(
        start && end ? `${url}?start_date=${start}&end_date=${end}` : url
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

  function handleStartDateChange(date) {
    setStartDate(date);
  }

  function handleEndDateChange(date) {
    setEndDate(date);
  }

  function handleDropdownSelect(eventKey) {
    setSelectedItem(eventKey);
  }

  async function fetchDataWithoutDate() {
    try {
      const userResponse = await axios.get(
        "https://sw.infoglobal.id/nirmala/backend/get-assignee-details"
      );
      const userData = userResponse.data;

      if (userData && Array.isArray(userData)) {
        setSelectedUser(userData);
      } else {
        setSelectedUser(null);
      }
    } catch (error) {
      console.error("Error fetching data without date:", error);
    }
  }

  useEffect(() => {
    setSelectedItem("Work Packages");
    fetchDataWithoutDate();
    setUserNameFromURL(getLabelFromURL());
  }, []);

  useEffect(() => {
    if (selectedUser && userNameFromURL) {
      setChartData(
        generateChartData(
          selectedUser.find((user) => user.user_name === userNameFromURL)?.projects || [],
          "project_name"
        )
      );

      if (selectedItem === "Work Packages") {
        setTotalWP(
          selectedUser.find((user) => user.user_name === userNameFromURL)?.total_wp || 0
        );
        setTotalSP(0);
      } else if (selectedItem === "Story Points") {
        setTotalWP(0);
        setTotalSP(
          selectedUser.find((user) => user.user_name === userNameFromURL)?.total_sp || 0
        );
      }
    }
  }, [selectedUser, selectedItem, userNameFromURL]);

  useEffect(() => {
    fetchTableData();
  }, [userNameFromURL, selectedLabel, startDate, endDate]);

  function generateChartData(data, property) {
    if (!data || !Array.isArray(data)) {
      return null;
    }

    const labels = data.map((project) => project[property]);
    const values = data.map((project) =>
      project[selectedItem === "Work Packages" ? "wp_assigned" : "story_points"]
    );

    return {
      labels: labels,
      datasets: [
        {
          label: "Total",
          data: values,
          backgroundColor: ["#FA4907", "#327332", "#165BAA", "#F6C600"],
        },
      ],
    };
  }

  function getLabelFromURL() {
    const url = window.location.href;
    const parts = url.split("/");
    const label = parts[parts.length - 1];
    return decodeURIComponent(label);
  }

  async function handleGenerateChartClick() {
    setErrorMessage(null);
  
    if (!startDate && !endDate) {
      setErrorMessage("Please fill both start and end dates.");
      return;
    }
  
    if (!startDate) {
      setErrorMessage("Please fill the start date.");
      return;
    }
  
    if (!endDate) {
      setErrorMessage("Please fill the end date.");
      return;
    }
  
    if (endDate <= startDate) {
      setErrorMessage("End date should be greater than the start date.");
      return;
    }
  
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
    await fetchUserData(formattedStartDate, formattedEndDate);
  }
  
  function validateDateInputs() {
    if (!startDate && !endDate) {
      setErrorMessage("Please fill both start and end dates.");
      return false;
    }
  
    if (!startDate) {
      setErrorMessage("Please fill the start date.");
      return false;
    }
  
    if (!endDate) {
      setErrorMessage("Please fill the end date.");
      return false;
    }
  
    if (endDate <= startDate) {
      setErrorMessage("End date should be greater than the start date.");
      return false;
    }
  
    return true;
  }
  

  async function fetchTableDataWithoutDate() {
    try {
      const url = "https://sw.infoglobal.id/nirmala/backend/get-assignee-wp-details";
      const response = await axios.get(url);

      const userData = response.data;

      if (userData && Array.isArray(userData)) {
        const selectedUser = userData.find((user) => user.user_name === userNameFromURL);
        if (selectedUser) {
          const selectedProject = selectedUser.projects.find(
            (project) => project.project_name === selectedLabel
          );
          if (selectedProject) {
            const projectTableData = selectedProject.wp_assigned.map((wp) => ({
              wp_name: wp.wp_name,
              progress: wp.progress,
              story_points: wp.story_points,
            }));

            setTableData(projectTableData);
          } else {
            setTableData([]);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching table data:", error);
    }
  }

  async function fetchTableData(selectedProjectName) {
    if (!startDate || !endDate) {
      await fetchTableDataWithoutDate();
    } else {
      try {
        const url = "https://sw.infoglobal.id/nirmala/backend/get-assignee-wp-details";
        const response = await axios.get(
          `${url}?start_date=${formatDate(startDate)}&end_date=${formatDate(endDate)}`
        );

        const userData = response.data;

        if (userData && Array.isArray(userData)) {
          const selectedUser = userData.find((user) => user.user_name === userNameFromURL);
          if (selectedUser) {
            const selectedProject = selectedUser.projects.find(
              (project) => project.project_name === selectedProjectName
            );
            if (selectedProject) {
              const projectTableData = selectedProject.wp_assigned.map((wp) => ({
                wp_name: wp.wp_name,
                progress: wp.progress,
                story_points: wp.story_points,
              }));

              setTableData(projectTableData);
            } else {
              setTableData([]);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching table data:", error);
      }
    }
  }

  function handlePieSliceClick(_, elements) {
    if (elements.length > 0) {
      const sliceIndex = elements[0].index;
      setSelectedSliceIndex(sliceIndex);

      const selectedLabel = chartData.labels[sliceIndex];
      setSelectedLabel(selectedLabel);

      // Fetch table data for the selected project
      if (startDate && endDate) {
        fetchTableData(selectedLabel);
      } else {
        setTableData([]);
      }
    }
  }

  return (
    <Container fluid className="user-components">
      <Row className="date-inputs" style={{ margin: 20 }}>
        <Col className="date-label">
          <div> Start Date:</div>
          <DatePicker
            selected={startDate}
            onChange={handleStartDateChange}
            dateFormat="yyyy-MM-dd"
            isClearable
            showYearDropdown
            scrollableYearDropdown
          />
        </Col>
        <Col className="date-label">
          <div>End Date: </div>
          <DatePicker
            selected={endDate}
            onChange={handleEndDateChange}
            dateFormat="yyyy-MM-dd"
            isClearable
            showYearDropdown
            scrollableYearDropdown
          />
          <Button className="refresh-button" style={{ marginLeft: 30 }} onClick={handleGenerateChartClick}>
            Submit
          </Button>
        </Col>
      </Row>
      {errorMessage && <div className="error-message" style={{marginLeft: 30}}>{errorMessage}</div>}
      <hr style={{ height: "2px", background: "black", border: "none", margin: 0 }} />
      <Row>
      <Col md={6} className="container-chart">
        <h3 className="sub-judul-assignee">Overview</h3>
          <div>
            <>
              <div className="title-count">
                Total {selectedItem} <br />
                <span className="count-project">
                  {selectedItem === "Work Packages"
                    ? `${totalWP} ${selectedItem}`
                    : `${totalSP} ${selectedItem}`}
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
              <hr style={{ height: "2px", background: "black", border: "none", margin:0 }} />
              {chartData ? (
                <Pie
                  id="userChart"
                  data={chartData}
                  options={{ onClick: handlePieSliceClick, aspectRatio: 2 }}
                  
                  style={{
                    opacity: 1,
                    transition: "opacity 0.5s ease, width 0.5s ease",

                  }}
                />
              ) : (
                <div className="no-data-message">No data available</div>
              )}
            </>
          </div>
        </Col>
        {selectedSliceIndex !== null && (
        <Col md={6} className="container-chart" style={{ overflowY: "auto"}}>
          <h3 className="sub-judul-assignee">{selectedLabel}</h3>
          <div style={{ width: "100%" }}>
            <table className="table">
                <thead>
                  <tr>
                    <th>Work Packages</th>
                    <th>Progress</th>
                    <th>Story Points</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((wp, index) => (
                    <tr key={index}>
                      <td>{wp.wp_name}</td>
                      <td>{wp.progress}%</td>
                      <td>{wp.story_points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Col>
        )}
      </Row>
    </Container>
  );
}

export default UserChart;
