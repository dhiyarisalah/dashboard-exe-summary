import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function ProjectDetails() {
  const location = useLocation();
  const [label, setLabel] = useState("");

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const label = queryParams.get("label");
    setLabel(label || "Project Details");
  }, [location]);

  return (
    <div>
      <h1>{label}</h1>
      {/* Rest of the component */}
    </div>
  );
}

export default ProjectDetails;
