import React, { useState } from "react";
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
  const [chartData, setChartData] = useState(generateChartData(projectStatus));
  const [modalVisible, setModalVisible] = useState(false);
  const [clickedLabel, setClickedLabel] = useState("");
  const [projectList, setProjectList] = useState([]);

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
    const dataset = data[0];
    const labels = Object.keys(dataset);
    const values = Object.values(dataset);

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
              padding: 30,
              boxWidth: 15,
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            },
          },
        },
        onClick: (_, activeElements) => {
          if (activeElements.length > 0) {
            const legendItem = activeElements[0];
            const clickedLabel = labels[legendItem.index]; // Use labels from the current chartData
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
              {selectedItem === "Select Type" ? "Select Type" : selectedItem}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item disabled>Select Type</Dropdown.Item> {/* Disable the "Select Type" item */}
              {dropdownItems.map((item) => (
                <Dropdown.Item key={item.value} eventKey={item.value}>
                  {item.label}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          </Col>
        </Row>
        <hr style={{ height: '2px', background: 'black', border: 'none' }} />

        <div className="pie-project" style={{ width: "100%", height: "500px", marginTop: "20px" }}>
          <Pie data={chartData} options={chartData.options} />
        </div>
      </Container>
      <Modal show={modalVisible} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Legend Clicked: {clickedLabel}</Modal.Title>
        </Modal.Header>
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
