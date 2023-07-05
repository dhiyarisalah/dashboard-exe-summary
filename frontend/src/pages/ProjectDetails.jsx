import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ProjectBar from "../components/ProjectBar";


function ProjectDetails() {
  const location = useLocation();
  const [label, setLabel] = useState("");

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const label = queryParams.get("label");
    setLabel(label || "Project Details");
  }, [location]);

  return (
    <div className="projectdetailspage">
      <h2 className="projectName">{label}</h2>
        <ProjectBar />
    </div>
  );
}

export default ProjectDetails;
