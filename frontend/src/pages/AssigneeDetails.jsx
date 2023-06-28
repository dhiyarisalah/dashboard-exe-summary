import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import UserChart from "../components/UserChart";


function AssigneeDetails() {
  // Get the total_project value from totalCount dataset
  const { label } = useParams();

  return (
    <div>
      <h1>{label}</h1>
      <h3 className='overview'>Overview</h3>
      <div>
        <UserChart />

      </div>
      <div>

      </div>

    </div>
  );
}

export default AssigneeDetails;

