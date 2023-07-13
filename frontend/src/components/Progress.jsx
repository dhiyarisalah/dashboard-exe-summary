import { useState } from "react";
import BarChart from "./BarChart";
import { projectProgress } from "../data/index.js";
import { Container, Row } from "react-bootstrap";

function Progress() {
  const handleBarClick = (event, elements) => {
    if (elements.length > 0) {
      const clickedIndex = elements[0].index;
      const clickedLabel = projectData.labels[clickedIndex];
      window.location.href = `/projectdetails/${clickedLabel}`;
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
