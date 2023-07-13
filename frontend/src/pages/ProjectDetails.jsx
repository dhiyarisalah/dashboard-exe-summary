import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import ProjectBar from "../components/ProjectBar";


function ProjectDetails() {
  // Get the total_project value from totalCount dataset
  const { label } = useParams();

  return (
    <div className="projectdetailspage">
      <h2 className="projectName">{label}</h2>
        <ProjectBar />
    </div>
  );
}

export default ProjectDetails;
