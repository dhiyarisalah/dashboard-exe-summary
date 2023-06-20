import { useState } from "react";
import PieChart from "./PieChart";
import { projectStatus, projectPriority, totalCount } from "../data/index.js";
import { Dropdown, Container, Row, Col } from "react-bootstrap";


function ProjectChart() {
  const dropdownItems = [
    { label: "priority", value: "priority" },
    { label: "status", value: "status" },
  ];

  const [selectedItem, setSelectedItem] = useState("select type");
  const [chartData, setChartData] = useState(generateChartData(projectStatus));

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
          backgroundColor: [
            "#FA4907",
            "#327332",
            "#165BAA",
            "#F6C600"
          ],
        },
      ],
      options: {
        plugins: {
          legend: {
            position: "right"
          }
        }
      }
    };
  }

  return (
    <div className="ProjectChart">
      <Container>
        <Row>
          <Col>
            <div className="title-count">
              Total Project <br /> <span className="count-project">
              {totalProjectCount} Projects </ span> 
            </div> 
          </Col>
          <Col>
          <Dropdown className= "dropdown-custom" onSelect={handleDropdownSelect}>
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
      </Container>
      <div style={{ width: 400 }}>
        <PieChart chartData={chartData} />
      </div>
    </div>
  );
}

export default ProjectChart;
