import { useState } from "react";
import PieChart from "./PieChart";
import { projectStatus, projectPriority, totalCount } from "../data/index.js";
import { Dropdown } from "react-bootstrap";


function ProjectChart() {
  const [selectedItem, setSelectedItem] = useState("Dropdown");
  const [chartData, setChartData] = useState(generateChartData(projectStatus));

  const handleDropdownSelect = (eventKey) => {
    setSelectedItem(eventKey);
    handleChartDataUpdate(eventKey);
  };

  const dropdownItems = [
    { label: "Priority", value: "priority" },
    { label: "Status", value: "status" },
  ];

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
            "rgba(75, 192, 192, 1)",
            "#ecf0f1",
            "#50AF95",
            "#f3ba2f",
            "#2a71d0",
          ],
          borderColor: "black",
          borderWidth: 2,
        },
      ],
    };
  }

  function handleChartDataUpdate(selectedValue) {
    if (selectedValue === "status") {
      setChartData(generateChartData(projectStatus));
    } else if (selectedValue === "priority") {
      setChartData(generateChartData(projectPriority));
    }
  }

  // Get the total_project value from totalCount dataset
  const totalProjectCount = totalCount[0]?.total_project || 0;

  return (
    <div className="ProjectChart">
      <div>
        <h5>Total Project</h5>
        <h2>{totalProjectCount} Projects</h2> {/* Update the value here */}
        <Dropdown onSelect={handleDropdownSelect}>
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
      </div>
      <div style={{ width: 400 }}>
        <PieChart chartData={chartData} />
      </div>
    </div>
  );
}

export default ProjectChart;
