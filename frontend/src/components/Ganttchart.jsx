import { useState } from "react";
import BarChart from "./BarChart";
import { projectProgress } from "../data/index.js";
import {Container, Row} from "react-bootstrap"

  function Ganttchart() {
    const [projectData, setProjectData] = useState(() => {
      const labels = projectProgress.map((data) => data.project_name);
      const datasets = [
        {
          indexAxis: "y",
          label: "Project Progress",
          data: projectProgress.map((data) => data.progress.percentage),
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
      ]
      const options = {

      }
      return {
        labels: labels,
        datasets: datasets,
        options: options
      };
    });
  
    return (
      <div className="Progress">
        <Container className="progress-box">
          <Row>
            <div className="title-count">
              Total Project
            </div>
          </Row>
          <Row>
            <div style={{ width: "100%", height: "100%" }}>
              <BarChart chartData={projectData} />
            </div>
          </Row>
        </Container>

      </div>
    );
  }
  
export default Ganttchart;
