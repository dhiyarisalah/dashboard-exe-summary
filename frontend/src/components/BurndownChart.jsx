import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Dropdown, Row, Col } from "react-bootstrap";

function BurndownChart() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleYearChange = (eventKey) => {
    setSelectedYear(parseInt(eventKey));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://sw.infoglobal.id/executive-summary-dashboard/get-burndown-chart-overview");
        const data = await response.json();
        console.log("API Data:", data);
    
        const selectedYearData = data.find((item) => item.year === selectedYear.toString());
        console.log("Selected Year:", selectedYear);
        console.log("Selected Year Data:", selectedYearData);
    
        if (selectedYearData && selectedYearData.progress) {
          const months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ];

          const doneData = months.map(() => 0);
          const addedData = months.map(() => 0);

          selectedYearData.progress.forEach((item) => {
            const index = months.indexOf(item.month);
            if (index !== -1) {
              doneData[index] = item.wp_done;
              addedData[index] = item.wp_on_going;
            }
          });

          setChartData({
            labels: months,
            datasets: [
              {
                label: "Done",
                data: doneData,
                borderColor: "#165BAA",
                borderWidth: 5
              },
              {
                label: "Added",
                data: addedData,
                borderColor: "#A155B9",
                borderWidth: 5
              },
            ],
            options: {
              plugins: {
                legend: {
                  display: true,
                  position: "bottom",
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
              aspectRatio: 3,
            },
          });

          setLoading(false);
        } else {
          // Set chartData to null to indicate no data for the selected year
          setChartData(null);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedYear]);

  return (
    <div className="BurdownAll">
      <div className="burdownall-box">
        <Row className="chart-info">
          <Col className="d-flex justify-content-end">
            <Dropdown className="dropdown-custom" onSelect={handleYearChange}>
              <Dropdown.Toggle variant="secondary" id="yearSelect">
                {selectedYear}
              </Dropdown.Toggle>
              <Dropdown.Menu>
              <Dropdown.Item disabled>Select Year</Dropdown.Item>
                {[0, 1, 2, 3, 4].map((index) => (
                  <Dropdown.Item key={index} eventKey={currentYear + index}>
                    {currentYear + index}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
        <hr style={{ marginTop: "0px", height: "2px", background: "black", border: "none" }} />
        <div style={{ height: "300px" }}>
          {loading ? (
            <div>Loading...</div>
          ) : (
            chartData ? <Line data={chartData} options={chartData.options} /> : <div>No data available for the selected year.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BurndownChart;
