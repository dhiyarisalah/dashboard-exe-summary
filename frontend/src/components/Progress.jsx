import { useState } from "react";
import BarChart from "./BarChart";
import { projectProgress } from "../data/index.js";
import { Container, Col, Row } from "react-bootstrap";

function Progress() {
  const handleBarClick = (event, barElement) => {
    if (barElement.length > 0) {
      const dataIndex = barElement[0].index;
      const label = projectData.labels[dataIndex];
      window.location.href = "/projectdetails?label=" + label;
    }
  };

  const options = {
    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
    },
    onClick: handleBarClick, // Attach the onClick event handler
  };

  const [projectData, setProjectData] = useState(() => {
    const labels = projectProgress.map((data) => data.project_name);
    const datasets = [
      {
        indexAxis: "y",
        label: "Project Progress",
        data: projectProgress.map((data) => data.progress.percentage),
        fill: false,
        backgroundColor: [
          "#2076BD",
        ],
        barThickness: 40,
      },
    ];

    return {
      labels: labels,
      datasets: datasets,
      options: options,
    };
  });

  return (
    <div className="Progress">
      <Container className="progress-box">
        <Row className="chart-info">
          <div className="title-count">Project Progress</div>
        </Row>
        <hr style={{ marginTop: '82px', height: '2px', background: 'black', border: 'none' }} />
        <Row>
          <div style={{ width: "100%", height: "100%" }}>
            <BarChart chartData={projectData} />
          </div>
        </Row>
      </Container>
    </div>
  );
}

export default Progress;
