import { useState } from "react";
import BarChart from "./BarChart";
import { userProgress } from "../data/index.js";
import { Container, Row, Dropdown } from "react-bootstrap";

function UserProgress() {
  const dropdownItems = [ 
    { label: "January", value: "January" },
    { label: "February", value: "February" },
    { label: "March", value: "March" },
    { label: "April", value: "April" },
    { label: "May", value: "May" },
    { label: "June", value: "June" },
    { label: "July", value: "July" },
    { label: "August", value: "August" },
    { label: "September", value: "September" },
    { label: "October", value: "October" },
    { label: "November", value: "November" },
    { label: "December", value: "December" },
  ];

  const [selectedMonth, setSelectedMonth] = useState("select month");
  const [projectData, setProjectData] = useState(null);

  const handleDropdownChange = (event) => {
    const month = event;
    setSelectedMonth(month);
    const filteredData = userProgress[0][month]; // Access the data for the selected month
  
    if (filteredData) {
      const labels = filteredData.map((data) => data.user_name);
      const datasets = [
        {
          indexAxis: "x",
          label: "WP Done",
          data: filteredData.map((data) => data.wp_done),
          fill: false,
          backgroundColor: [
            "rgba(75,192,192,1)",
            "#ecf0f1",
            "#50AF95",
            "#f3ba2f",
            "#2a71d0",
          ],
          borderColor: "black",
          borderWidth: 1,
          barThickness: 30,
        },
        {
          indexAxis: "x",
          label: "WP Total",
          data: filteredData.map((data) => data.wp_total),
          fill: false,
          backgroundColor: [
            "rgba(75,192,192,1)",
            "#ecf0f1",
            "#50AF95",
            "#f3ba2f",
            "#2a71d0",
          ],
          borderColor: "black",
          borderWidth: 1,
          barThickness: 30,
        },
      ];
      const options = {
        plugins: {
          legend: {
            display: true,
            position: "bottom",
          },
        },
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
          },
        },
      };
  
      setProjectData({
        labels: labels,
        datasets: datasets,
        options: options,
      });
    } else {
      setProjectData(null);
    }
  };


  return (
    <div className="Progress">
      <Container className="progress-box">
        <Row>
          <Dropdown onSelect={handleDropdownChange}>
            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
              {selectedMonth ? selectedMonth : "select month"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {dropdownItems.map((item) => (
                <Dropdown.Item
                  key={item.value}
                  eventKey={item.value}
                  active={selectedMonth === item.value}
                >
                  {item.label}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Row>
        <Row>
          <div style={{ width: "100%", height: "100%" }}>
            {projectData ? (
              <BarChart
                chartData={projectData}
              />
            ) : (
              <p>No data available for the selected month.</p>
            )}
          </div>
        </Row>
      </Container>
    </div>
  );
}

export default UserProgress;
