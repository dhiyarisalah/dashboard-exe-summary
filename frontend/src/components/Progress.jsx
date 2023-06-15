import { useState } from "react";
import BarChart from "./BarChart";
import { UserData } from "../data/index.js";

function Progress() {
  const [userData, setUserData] = useState({
    labels: UserData.map((data) => data.year),
    datasets: [
      {
        indexAxis: "y",
        label: "Users Gained",
        data: UserData.map((data) => data.userGain),
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
      <div style={{ width: 700 }}>
        <BarChart chartData={userData} />
    </div>
    </div>
  );
}

export default Progress;
