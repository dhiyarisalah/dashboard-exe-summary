import React, { useState } from "react";
import { Modal, Dropdown, Container, Row, Col } from "react-bootstrap";
import PieChart from "./PieChart";
import { projectStatus, projectPriority, totalCount } from "../data/index.js";
import { Chart as ChartJS } from "chart.js";
function ProjectChart() {
  const dropdownItems = [
    { label: "priority", value: "priority" },
    { label: "status", value: "status" },
  ];

  const [selectedItem, setSelectedItem] = useState("select type");
  const [chartData, setChartData] = useState(generateChartData(projectStatus));
  const [modalVisible, setModalVisible] = useState(false);
  const [clickedLabel, setClickedLabel] = useState ("")

  function handleChartDataUpdate(selectedValue) {
    if (selectedValue === "status") {
      setChartData(generateChartData(projectStatus));
    } else if (selectedValue === "priority") {
      setChartData(generateChartData(projectPriority));
    }
  }

  const handleDropdownSelect = (eventKey) => {
    setSelectedItem(eventKey);
    handleChartDataUpdate(eventKey);
  };

  const handleLegendClick = (legendItem) => {
    const clickedLabel = chartData.labels[legendItem.index];
    setClickedLabel(clickedLabel)
    setModalVisible(true); // Open the modal when legend is clicked
  };

  const handleCloseModal = () => {
    setModalVisible(false); // Close the modal
  };

  // Get the total_project value from totalCount dataset
  const totalProjectCount = totalCount[0]?.total_project || 0;

  function generateChartData(data) {
    const labels = Object.keys(data[0]);
    const values = Object.values(data[0]);

    return {
      labels: labels,
      datasets: [
        {
          label: "Project",
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
      }
    }
  }

  return (
    <div className="ProjectChart">
      <Container className="project-box">
        <Row>
          <Col>
            <div className="title-count">
              Total Project <br />{" "}
              <span className="count-project">{totalProjectCount} Projects</span>
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
        <div style={{width: "100%", height: "100%"  }}>
          <PieChart chartData={chartData} handleLegendClick={handleLegendClick} />
        </div>
      </Container>
      <Modal show={modalVisible} onHide={handleCloseModal}>
        <Modal.Header closeButton>
        <Modal.Title>Legend Clicked: {clickedLabel}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{clickedLabel}.</p>
        </Modal.Body>
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
