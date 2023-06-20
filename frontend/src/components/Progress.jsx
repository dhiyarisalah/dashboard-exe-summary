import { useState } from "react";
import BarChart from "./BarChart";
import { projectProgress } from "../data/index.js";

function Progress() {
  const [projectData, setProjectData] = useState({
    labels: projectProgress.map((data) => data.project_name),
    datasets: [
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
      },
    ],
  });
  
  return (
    <div className="Progress">
      <div style={{ width: 700, height: 400, overflow: "auto"}}>
        <BarChart chartData={projectData} />
      </div>
    </div>
  );
}

export default Progress;
