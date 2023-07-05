import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import UserChart from "../components/UserChart";


function AssigneeDetails() {
  // Get the total_project value from totalCount dataset
  const { label } = useParams();

  return (
    <div className="assigneedetailspage">
      <h2 className="assigneeName">{label}</h2>
      <UserChart />
    </div>
  );
}

export default AssigneeDetails;

