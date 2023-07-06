import React, { useState, useEffect } from "react";
import BarChart from "./BarChart";
import LineChart from "./LineChart";
import { projectDetails, burndownData, projectAssignee } from "../data/index.js";
import { Container, Col, Row, Dropdown, Table } from "react-bootstrap";
import { useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function ProjectBar() {
  const query = useQuery();
  const labelParam = query.get("label");

  const [selectedVersion, setSelectedVersion] = useState(null);
  const [isVersionSelected, setIsVersionSelected] = useState(false);
  const [projectData, setProjectData] = useState([]);
  const [lineChartData, setLineChartData] = useState(null);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (labelParam) {
      const project = projectDetails.find(
        (project) => project.project_name === labelParam
      );

      if (project) {
        const versions = project.progress.map((version) => version.version_name);

        if (!isVersionSelected) {
          setSelectedVersion(versions[0]);
        }

        const filteredData = project.progress.find(
          (version) => version.version_name === selectedVersion
        );

        setProjectData([
          {
            project_name: project.project_name,
            percentage_done: filteredData ? filteredData.percentage_done : 0,
            percentage_undone: filteredData ? filteredData.percentage_undone : 0,
          },
        ]);

        const burndownProject = burndownData.find(
          (burndownProject) => burndownProject.project_name === labelParam
        );

        if (burndownProject) {
          const burndownVersion = burndownProject.versions.find(
            (version) => version.version_name === selectedVersion
          );

          setLineChartData(burndownVersion ? burndownVersion.progress : null);
        }

        const assigneeData = projectAssignee.find(
          (project) => project.hasOwnProperty(labelParam)
        );

        if (assigneeData) {
          const assigneeVersionData = assigneeData[labelParam][0][selectedVersion];

          if (assigneeVersionData) {
            setTableData([...assigneeVersionData]);
          } else {
            setTableData([]);
          }
        } else {
          setTableData([]);
        }
      }
    } else {
      setSelectedVersion(null);
      setIsVersionSelected(false);
      setProjectData([]);
      setLineChartData(null);
      setTableData([]);
    }
  }, [labelParam, selectedVersion, isVersionSelected]);

  const handleVersionSelect = (eventKey) => {
    setSelectedVersion(eventKey);
    setIsVersionSelected(true);

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

      const burndownProject = burndownData.find(
        (burndownProject) => burndownProject.project_name === labelParam
      );

      if (burndownProject) {
        const burndownVersion = burndownProject.versions.find(
          (version) => version.version_name === eventKey
        );

        setLineChartData(burndownVersion ? burndownVersion.progress : null);
      }

      const assigneeData = projectAssignee.find(
        (project) => project.hasOwnProperty(labelParam)
      );

      if (assigneeData) {
        const assigneeVersionData = assigneeData[labelParam][0][eventKey];

        if (assigneeVersionData) {
          setTableData([...assigneeVersionData]);
        } else {
          setTableData([]);
        }
      } else {
        setTableData([]);
      }
    }
  };

  const getDropdownItems = () => {
    const project = projectDetails.find(
      (project) => project.project_name === labelParam
    );

    if (project) {
      return project.progress.map((version) => (
        <Dropdown.Item key={version.version_name} eventKey={version.version_name}>
          {version.version_name}
        </Dropdown.Item>
      ));
    }

    return null;
  };

  return (
    <Container fluid className="project-components">
      <div>
        <Col className="button d-flex justify-content-end">
          <Dropdown onSelect={handleVersionSelect}>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              {selectedVersion}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {getDropdownItems()}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </div>
      
      <div>
        <h3 className="sub-judul-project">Progress</h3>
        <div className="projectProgress">
          <BarChart 
            chartData={{
              labels: projectData.map((data) => data.project_name),
              datasets: [
                {
                  label: "Done",
                  data: [projectData[0]?.percentage_done || 0],
                  backgroundColor: ["#327332"],
                  barThickness: 50,
                },
                {
                  label: "Undone",
                  data: [projectData[0]?.percentage_undone || 0],
                  backgroundColor: ["#F6C600"],
                  barThickness: 50,
                },
              ],
              options: {
                maintainAspectRatio: false,
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
          </div>
      </div>

      <div> 
        <h3 className="sub-judul-project">Burndown Chart</h3>
        <div className="container-chart">
          {lineChartData && (
            <LineChart
              chartData={{
                labels: lineChartData.map((data) => data.month),
                datasets: [
                  {
                    label: "Done",
                    data: lineChartData.map((data) => data.wp_done),
                    fill: false,
                    backgroundColor: "#165BAA"
                  },
                  {
                    label: "Added",
                    data: lineChartData.map((data) => data.wp_on_going),
                    fill: false,
                    backgroundColor: "#A155B9"
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
        </div>
        <div>
          <h3 className="sub-judul-project">Assignees</h3>
          <div className="container-chart">
            <Table striped bordered>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Member Name</th>
                  <th>Progress (%)</th>
                  <th>Story Points</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((data, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{data.member_name}</td>
                    <td>{data.progress}</td>
                    <td>{data.storyPoints}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
        </div>
      </div>
    </Container>
  );
}

export default ProjectBar;
