import React, { useState, useEffect } from "react";
import { Modal, Dropdown, Container, Row, Col } from "react-bootstrap";
import { Pie } from "react-chartjs-2";
import axios from "axios";

function ProjectChart() {
  const dropdownItems = [
    { label: "Priority", value: "Priority" },
    { label: "Status", value: "Status" },
  ];

  const [selectedItem, setSelectedItem] = useState("Priority");
  const [chartData, setChartData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [clickedLabel, setClickedLabel] = useState("");
  const [totalProjectCount, setTotalProjectCount] = useState(0);
  const [projectListStatus, setProjectListStatus] = useState(null);
  const [projectListPriority, setProjectListPriority] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData("Priority");
    fetchTotalCount();
  }, []);

  async function fetchTotalCount() {
    try {
      const response = await axios.get("https://sw.infoglobal.id/nirmala/backend/count-all");
      const totalCountData = response.data;
      console.log("Total Count Data:", totalCountData);
      if (totalCountData && totalCountData.total_project) {
        setTotalProjectCount(totalCountData.total_project);
      } else {
        console.error("Invalid total count data:", totalCountData);
      }
    } catch (error) {
      console.error("Error fetching total count:", error);
    }
  }

  async function fetchData(selectedValue) {
    try {
      setLoading(true);
      const url =
        selectedValue === "Status"
          ? "https://sw.infoglobal.id/nirmala/backend/project-count-by-status"
          : "https://sw.infoglobal.id/nirmala/backend/project-count-by-priority";

      const response = await axios.get(url);
      const data = response.data;

      console.log("Data from API:", data);

      const chartData = generateChartData(Array.isArray(data) ? data[0] : data);
      setChartData(chartData);

      if (selectedValue === "Status") {
        const projectListResponse = await axios.get("https://sw.infoglobal.id/nirmala/backend/project-list-by-status");
        setProjectListStatus(projectListResponse.data);
      } else {
        const projectListResponse = await axios.get("https://sw.infoglobal.id/nirmala/backend/project-list-by-priority");
        setProjectListPriority(projectListResponse.data);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  }

  function handleChartDataUpdate(selectedValue) {
    setSelectedItem(selectedValue);
    fetchData(selectedValue);
  }

  const handleDropdownSelect = (eventKey) => {
    handleChartDataUpdate(eventKey);
  };

  const handleLegendClick = (clickedLabel) => {
    setClickedLabel(clickedLabel);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  function generateChartData(data) {
    if (!data || !Object.keys(data).length) {
      return null;
    }
  
    const labels = Object.keys(data);
    const values = Object.values(data);
  
    return {
      labels: labels,
      datasets: [
        {
          label: "Total Project",
          data: values,
          backgroundColor: ["#FA4907", "#327332", "#165BAA", "#F6C600"],
        },
      ],
      options: {
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              boxWidth: 15,
            },
          },
        },
        onClick: (_, activeElements) => {
          if (activeElements.length > 0) {
            const clickedLabel = labels[activeElements[0].index];
            handleLegendClick(clickedLabel);
          }
        },
        aspectRatio: 2
      },
    };
  }

  return (
    <div className="ProjectChart">
      <Container className="project-box">
        <Row className="chart-info">
          <Col>
            <div className="title-count">
              <div style={{ marginBottom: "10px" }}>Total Project</div>
              <span className="count-project">{totalProjectCount} Projects</span>
            </div>
          </Col>
          <Col className="d-flex justify-content-end">
            <Dropdown className="dropdown-custom" onSelect={handleDropdownSelect}>
              <Dropdown.Toggle variant="secondary" id="dropdownMenu2">
                {selectedItem}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item disabled>Select Type</Dropdown.Item>
                {dropdownItems.map((item) => (
                  <Dropdown.Item key={item.value} eventKey={item.value}>
                    {item.label}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
        <hr style={{ marginTop: "0px", height: "2px", background: "black", border: "none" }} />
        <div className="chart-wrapper d-flex justify-content-center align-items-center">
          {loading ? (
            <div>Loading...</div>
          ) : chartData ? (
            <Pie
              data={chartData}
              options={chartData.options}
              style={{
                opacity: 1,
                transition: "opacity 0.5s ease, width 0.5s ease",
              }}
            />
          ) : (
            <div>No data available</div>
          )}
        </div>
      </Container>
      <Modal show={modalVisible} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Legend Clicked: {clickedLabel}</Modal.Title>
        </Modal.Header>
        {selectedItem !== "Select Type" && (
          <Modal.Body>
            {selectedItem === "Status" && (
              <ul>
                {projectListStatus && projectListStatus[clickedLabel]?.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
            {selectedItem === "Priority" && (
              <ul>
                {projectListPriority && projectListPriority[clickedLabel]?.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </Modal.Body>
        )}
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleCloseModal}>
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ProjectChart;
