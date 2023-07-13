import React, { useState, useEffect } from "react";
import { Modal, Dropdown, Container, Row, Col } from "react-bootstrap";
import { Pie } from "react-chartjs-2";
import { projectStatus, projectPriority, totalCount } from "../data/index.js";
import { projectListStatus, projectListPriority } from "../data/index.js";

function ProjectChart() {
  const dropdownItems = [
    { label: "Priority", value: "Priority" },
    { label: "Status", value: "Status" },
  ];

  const [selectedItem, setSelectedItem] = useState("Select Type");
  const [chartData, setChartData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [clickedLabel, setClickedLabel] = useState("");

  useEffect(() => {
    setChartData(generateChartData(projectPriority));
  }, []);

  function handleChartDataUpdate(selectedValue) {
    if (selectedValue === "Status") {
      setChartData(generateChartData(projectStatus));
    } else if (selectedValue === "Priority") {
      setChartData(generateChartData(projectPriority));
    }
  }

  const handleDropdownSelect = (eventKey) => {
    setSelectedItem(eventKey);
    handleChartDataUpdate(eventKey);
  };

  const handleLegendClick = (clickedLabel) => {
    setClickedLabel(clickedLabel);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const totalProjectCount = totalCount[0]?.total_project || 0;

  function generateChartData(data) {
    const dataset = data ? data[0] : {};
    const labels = Object.keys(dataset);
    const values = Object.values(dataset);

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
            position: "right",
            labels: {
              padding: 30,
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
      },
    };
  }

  return (
    <div className="ProjectChart">
      <Container className="project-box" style={{ marginTop: "20px" }}>
        <Row className="chart-info">
          <Col>
            <div className="title-count">
              <div style={{ marginBottom: "20px" }}>Total Project</div>
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
        <hr style={{ height: "2px", background: "black", border: "none" }} />
        {chartData && (
          <Pie
            data={chartData}
            options={chartData.options}
            style={{
              opacity: 1,
              transition: "opacity 0.5s ease, width 0.5s ease"
            }}
          />
        )}
      </Container>
      <Modal show={modalVisible} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Legend Clicked: {clickedLabel}</Modal.Title>
        </Modal.Header>
        {selectedItem !== "Select Type" && (
          <Modal.Body>
            {selectedItem === "Status" && (
              <ul>
                {projectListStatus[0][clickedLabel]?.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
            {selectedItem === "Priority" && (
              <ul>
                {projectListPriority[0][clickedLabel]?.map((item) => (
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
