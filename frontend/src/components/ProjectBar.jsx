import React, { useState, useEffect } from "react";
import BarChart from "./BarChart";
import LineChart from "./LineChart";
import { projectDetails, burdownData } from "../data/index.js";
import { Container, Col, Row, Dropdown } from "react-bootstrap";
import { useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function ProjectBar() {
  const query = useQuery();
  const labelParam = query.get("label");

  const [selectedVersion, setSelectedVersion] = useState("Select Version");
  const [projectData, setProjectData] = useState([]);
  const [lineChartData, setLineChartData] = useState(null);

  useEffect(() => {
    if (labelParam) {
      const project = projectDetails.find(
        (project) => project.project_name === labelParam
      );

      if (project) {
        const versions = project.progress.map((version) => version.version_name);

        setSelectedVersion("Select Version");

        const filteredData = project.progress.find(
          (version) => version.version_name === versions[0]
        );

        setProjectData([
          {
            project_name: project.project_name,
            percentage_done: filteredData ? filteredData.percentage_done : 0,
            percentage_undone: filteredData ? filteredData.percentage_undone : 0,
          },
        ]);

        const burndownProject = burdownData.find(
          (burndownProject) => burndownProject.project_name === labelParam
        );

        if (burndownProject) {
          const burndownVersion = burndownProject.versions.find(
            (version) => version.version_name === versions[0]
          );

          setLineChartData(burndownVersion ? burndownVersion.progress : null);
        }
      }
    } else {
      setSelectedVersion("Select Version");
      setProjectData([]);
      setLineChartData(null);
    }
  }, [labelParam]);

  const handleVersionSelect = (eventKey) => {
    setSelectedVersion(eventKey);

    const project = projectDetails.find(
      (project) => project.project_name === labelParam
    );

    if (project) {
      const filteredData = project.progress.find(
        (version) => version.version_name === eventKey
      );

      setProjectData([
        {
          project_name: project.project_name,
          percentage_done: filteredData ? filteredData.percentage_done : 0,
          percentage_undone: filteredData ? filteredData.percentage_undone : 0,
        },
      ]);

      const burndownProject = burdownData.find(
        (burndownProject) => burndownProject.project_name === labelParam
      );

      if (burndownProject) {
        const burndownVersion = burndownProject.versions.find(
          (version) => version.version_name === eventKey
        );

        setLineChartData(burndownVersion ? burndownVersion.progress : null);
      }
    }
  };

  const getDropdownItems = () => {
    const project = projectDetails.find(
      (project) => project.project_name === labelParam
    );

    if (project) {
      const versions = project.progress.map((version) => version.version_name);

      return (
        <>
          <Dropdown.Item disabled>Select Version</Dropdown.Item>
          {versions.map((version) => (
            <Dropdown.Item key={version} eventKey={version}>
              {version}
            </Dropdown.Item>
          ))}
        </>
      );
    }

    return null;
  };

  return (
    <div className="Progress">
      <Container className="progress-box">
        <Row>
          <Col>
            <Dropdown onSelect={handleVersionSelect}>
              <Dropdown.Toggle variant="primary" id="dropdown-basic">
                {selectedVersion}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {getDropdownItems()}
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
        <Row>
          <div style={{ width: "100%", height: "100%" }}>
            <BarChart
              chartData={{
                labels: projectData.map((data) => data.project_name),
                datasets: [
                  {
                    label: "Project Progress",
                    data: [projectData[0]?.percentage_done || 0],
                    backgroundColor: ["rgba(75,192,192,1)"],
                    barThickness: 30,
                  },
                  {
                    label: "Project Progress",
                    data: [projectData[0]?.percentage_undone || 0],
                    backgroundColor: ["#ecf0f1"],
                    barThickness: 30,
                  }
                ],
                options: {
                  indexAxis: "y",
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    x: {
                      display: false,
                      stacked: true,
                      beginAtZero: true,
                      grid: {
                        display: false,
                      },
                    },
                    y: {
                      display: false,
                      stacked: true,
                      beginAtZero: true,
                      grid: {
                        display: false,
                      },
                    },
                  },
                },
              }}
            />
            {lineChartData && (
              <LineChart
                chartData={{
                  labels: lineChartData.map((data) => data.month),
                  datasets: [
                    {
                      label: "WP Done",
                      data: lineChartData.map((data) => data.wp_done),
                      borderColor: "rgba(75,192,192,1)",
                      borderWidth: 2,
                      fill: false,
                    },
                    {
                      label: "WP On Going",
                      data: lineChartData.map((data) => data.wp_on_going),
                      borderColor: "#ecf0f1",
                      borderWidth: 2,
                      fill: false,
                    },
                  ],
                  options: {
                    plugins: {
                      legend: {
                        display: true,
                      },
                    },
                    scales: {
                      x: {
                        beginAtZero: true,
                        grid: {
                          display: true,
                        },
                      },
                      y: {
                        beginAtZero: true,
                        grid: {
                          display: true,
                        },
                      },
                    },
                  },
                }}
              />
            )}
          </div>
        </Row>
      </Container>
    </div>
  );
}

export default ProjectBar;
