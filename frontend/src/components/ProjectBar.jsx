import React, { useState, useEffect } from "react";
import BarChart from "./BarChart";
import LineChart from "./LineChart";
import { projectDetails, burndownData, assigneeProject } from "../data/index";
import { Container, Col, Dropdown, Row } from "react-bootstrap";
import { Bar } from "react-chartjs-2";

function ProjectBar() {
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const [lineChartData, setLineChartData] = useState(null);
  const [assigneeData, setAssigneeData] = useState(null);
  const [selectedDropdown, setSelectedDropdown] = useState("progress");

  function getLabelFromURL() {
    const url = window.location.href;
    const parts = url.split("/");
    const label = parts[parts.length - 1];
    return decodeURIComponent(label);
  }
  
  const labelParam = getLabelFromURL();

  useEffect(() => {
    if (labelParam) {
      const project = projectDetails.find(
        (project) => project.project_name === labelParam
      );

      if (project) {
        const versions = project.progress.map(
          (version) => version.version_name
        );

        const latestVersion = versions[versions.length - 1];
        setSelectedVersion(latestVersion);

        const filteredData = project.progress.find(
          (version) => version.version_name === latestVersion
        );

        setProjectData({
          project_name: project.project_name,
          percentage_done: filteredData ? filteredData.percentage_done : 0,
          percentage_undone: filteredData ? filteredData.percentage_undone : 0,
        });

        const burndownProject = burndownData.find(
          (burndownProject) => burndownProject.project_name === labelParam
        );

        const burndownVersion = burndownProject?.versions.find(
          (version) => version.version_name === latestVersion
        );

        setLineChartData(burndownVersion?.progress || null);

        const assigneeData = assigneeProject.find(
          (project) => project.project_name === labelParam
        );

        const assigneeVersionData = assigneeData?.versions.find(
          (version) => version.version_name === latestVersion
        );

        setAssigneeData(assigneeVersionData || null);
      } else {
        setSelectedVersion(null);
        setProjectData(null);
        setLineChartData(null);
        setAssigneeData(null);
      }
    }
  }, [labelParam]);

  const handleVersionSelect = (eventKey) => {
    setSelectedVersion(eventKey);
    setSelectedDropdown("progress");

    const filteredData = projectDetails.find(
      (project) => project.project_name === labelParam
    )?.progress.find((version) => version.version_name === eventKey);

    setProjectData({
      project_name: labelParam,
      percentage_done: filteredData ? filteredData.percentage_done : 0,
      percentage_undone: filteredData ? filteredData.percentage_undone : 0,
    });

    const burndownVersion = burndownData
      .find((burndownProject) => burndownProject.project_name === labelParam)
      ?.versions.find((version) => version.version_name === eventKey);

    setLineChartData(burndownVersion?.progress || null);

    const assigneeVersionData = assigneeProject
      .find((project) => project.project_name === labelParam)
      ?.versions.find((version) => version.version_name === eventKey);

    setAssigneeData(assigneeVersionData || null);
  };

  const handleDropdownSelect = (eventKey) => {
    setSelectedDropdown(eventKey);
  };

  const getDropdownItems = () => {
    const project = projectDetails.find(
      (project) => project.project_name === labelParam
    );
  
    if (project) {
      const dropdownItems = project.progress.map((version) => (
        <Dropdown.Item
          key={version.version_name}
          eventKey={version.version_name}
        >
          {version.version_name}
        </Dropdown.Item>
      ));
  
      // Add "All Version" dropdown item
      dropdownItems.unshift(
        <Dropdown.Item key="All Version" eventKey="All Version">
          All Version
        </Dropdown.Item>
      );
  
      return dropdownItems;
    }
  
    return null;
  };
  

  return (
    <Container fluid className="project-components">
      <Col className="button d-flex justify-content-end">
        <Dropdown className="dropdown-custom" onSelect={handleVersionSelect}>
          <Dropdown.Toggle variant="secondary" id="dropdown-basic">
            {selectedVersion}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item disabled>Select Version</Dropdown.Item>
            {getDropdownItems()}
          </Dropdown.Menu>
        </Dropdown>
      </Col>

      <div>
        <h3 className="sub-judul-project">Progress</h3>
        <div className="projectProgress">
          {projectData && (
            <BarChart
              chartData={{
                labels: [projectData.project_name],
                datasets: [
                  {
                    label: "Done",
                    data: [projectData.percentage_done],
                    backgroundColor: ["#327332"],
                    barThickness: 50,
                  },
                  {
                    label: "Undone",
                    data: [projectData.percentage_undone],
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
          )}
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
                    backgroundColor: "#165BAA",
                    borderColor: "#165BAA",
                  },
                  {
                    label: "Added",
                    data: lineChartData.map((data) => data.wp_on_going),
                    fill: false,
                    backgroundColor: "#A155B9",
                    borderColor: "#A155B9",
                  },
                ],
                options: {
                  plugins: {
                    legend: {
                      display: true,
                      position: "bottom",
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
          <Row className="row">
            <Col className="button d-flex justify-content-end">
              <Dropdown
                onSelect={handleDropdownSelect}
                className="dropdown-custom .btn-secondary"
              >
                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                  {selectedDropdown === "progress" ? "Progress" : "Story Points"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item eventKey="progress">Progress</Dropdown.Item>
                  <Dropdown.Item eventKey="storyPoints">
                    Story Points
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>
          <hr style={{ height: "2px", background: "black", border: "none" }} />
          <div>
            {assigneeData && (
              <Bar
                data={{
                  labels: assigneeData.member_data.map(
                    (member) => member.member_name
                  ),
                  datasets: [
                    {
                      label:
                        selectedDropdown === "progress"
                          ? "Progress"
                          : "Story Points",
                      data: assigneeData.member_data.map((member) =>
                        selectedDropdown === "progress"
                          ? member.progress
                          : member.storyPoints
                      ),
                      backgroundColor: "#2076BD",
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                  indexAxis: "y",
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    x: {
                      beginAtZero: true,
                      grid: {
                        display: false,
                      },
                    },
                    y: {
                      grid: {
                        display: false,
                      },
                    },
                  },
                }}
              />
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}

export default ProjectBar;
