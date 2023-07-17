import BarChart from "./BarChart";
import { projectProgress } from "../data/index.js";
import { Container, Row } from "react-bootstrap";

function Progress() {
  const handleBarClick = (event, elements) => {
    if (elements.length > 0) {
      const clickedIndex = elements[0].index;
      const clickedLabel = projectProgress[clickedIndex].project_name;
      window.location.href = `/projectdetails/${clickedLabel}`;
    }
  };

  const options = {
    indexAxis: "y",
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        
      },
    },
    scales: {
      x: {
        min: 0,
        max: 100,
        stepSize: 20,
      },
    },
    onClick: handleBarClick,
  };

  const labels = projectProgress.map((data) => data.project_name);
  const datasets = [
    {
      label: "Project Progress",
      data: projectProgress.map((data) => data.progress.percentage),
      fill: false,
      backgroundColor: ["#2076BD"],

    },
  ];


  return (
    <div className="Progress">
      <Container className="progress-box">
        <Row className="chart-info">
          <div className="title-count">Project Progress</div>
        </Row>
        <hr
          style={{
            marginTop: "82px",
            height: "2px",
            background: "black",
            border: "none",
          }}
        />
        <Row>
          <div>
            <BarChart 
              chartData={{ labels, datasets }}
              options={{
                ...options,
              }}
            />
          </div>
        </Row>
      </Container>
    </div>
  );
}

export default Progress;
