import React, { useState, useEffect } from "react";
import BarChart from "./BarChart";
import LineChart from "./LineChart";
import { projectDetails, burndownData, assigneeProject } from "../data/index";
import { Container, Col, Row } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import Select from "react-select";

function ProjectBar() {
  const [selectedVersions, setSelectedVersions] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedDropdown, setSelectedDropdown] = useState("progress");
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const [lineChartData, setLineChartData] = useState(null);
  const [assigneeData, setAssigneeData] = useState(null);

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

  const handleVersionSelect = (selectedOptions) => {
    const selectedVersionNames = selectedOptions.map((option) => option.value);
    setSelectedVersions(selectedVersionNames);

    // Clear the selected version when selecting a new one
    setSelectedVersion(null);
  };

  const handleTypeSelect = (selectedOption) => {
    setSelectedType(selectedOption.value);
  };

  const handleAssigneeDropdownSelect = (eventKey) => {
    setSelectedDropdown(eventKey);
  };

  const handleVersionDropdownSelect = (eventKey) => {
    setSelectedVersion(eventKey);
  };

  return (
    <Container fluid className="project-components">
      <Row className="row">
        <Col className="button d-flex justify-content-end">
          <Select
            options={projectDetails.map((project) => ({
              value: project.version_name,
              label: project.version_name,
            }))}
            isMulti
            onChange={handleVersionSelect}
            value={selectedVersions.map((version) => ({
              value: version,
              label: version,
            }))}
            placeholder="Select Versions"
          />
        </Col>
        <Col className="button d-flex justify-content-end">
          <Select
              options={projectDetails.map((project) => ({
                value: project.version_name,
                label: project.version_name,
              }))}
              isMulti
              onChange={handleVersionSelect}
              value={selectedVersions.map((version) => ({
                value: version,
                label: version,
              }))}
              placeholder="Select Type"
          />
        </Col>
      </Row>

      <div>
        <h3 className="sub-judul-project">Progress</h3>
        <div className="projectProgress">
          {projectData && (
            <BarChart
              chartData={{
                labels: ["Project Progress"],
                datasets: [
                  {
                    label: "Done",
                    data: [projectData.percentage_done],
                    backgroundColor: "#327332",
                    barThickness: 40,
                  },
                  {
                    label: "Undone",
                    data: [projectData.percentage_undone],
                    backgroundColor: "#F6C600",
                    barThickness: 40,
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
                    display: false,
                    stacked: false,
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
              }}
              options={{
                plugins: {
                  legend: {
                    display: true,
                    position: "bottom",
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
              <Select
                options={[
                  { value: "progress", label: "Progress" },
                  { value: "storyPoints", label: "Story Points" },
                ]}
                onChange={handleAssigneeDropdownSelect}
                value={{ value: selectedDropdown, label: selectedDropdown }}
                placeholder="Select Data Type"
              />
            </Col>
          </Row>
          <hr
            style={{
              height: "2px",
              background: "black",
              border: "none",
              margin: "10px 0",
            }}
          />
          <div>
            {assigneeData && (
              <Bar
                data={{
                  labels: assigneeData.member_data.map((member) => member.member_name),
                  datasets: [
                    {
                      label:
                        selectedDropdown === "progress" ? "Progress" : "Story Points",
                      data: assigneeData.member_data.map((member) =>
                        selectedDropdown === "progress" ? member.progress : member.storyPoints
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
