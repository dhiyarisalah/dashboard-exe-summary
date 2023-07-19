import React, { useState, useEffect } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { Bar, Line } from "react-chartjs-2";
import Select from "react-select";
import axios from "axios";

function ProjectBar() {
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [projectData, setProjectData] = useState(null);
  const [lineChartData, setLineChartData] = useState(null);
  const [assigneeData, setAssigneeData] = useState(null);
  const [versionOptions, setVersionOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [selectedAssigneeDropdown, setSelectedAssigneeDropdown] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch project details
        const projectDetailsResponse = await axios.get(
          "https://sw.infoglobal.id/executive-summary-dashboard/get-progress-project"
        );
        const projectDetails = projectDetailsResponse.data;

        // Check if the label matches any project name
        const labelParam = getLabelFromURL();
        const filteredProject = projectDetails.find(
          (project) => project.project_name === labelParam
        );

        if (filteredProject) {
          // Fetch project versions
          const projectVersionsResponse = await axios.get(
            "https://sw.infoglobal.id/executive-summary-dashboard/get-all-version"
          );
          const projectVersions = projectVersionsResponse.data;

          // Filter project versions based on selected project
          const filteredVersions = projectVersions.filter(
            (version) => version.at_project === filteredProject.project_name
          );

          // Set the version options for the dropdown
          const versionOptions = filteredVersions.map((version) => ({
            value: version.version_name,
            label: version.version_name,
          }));
          setVersionOptions(versionOptions);

          // Set the type options for the dropdown
          const typeOptions = filteredProject.wp_types.map((type) => ({
            value: type,
            label: type,
          }));
          setTypeOptions(typeOptions);

          // Fetch burndown data based on selected types
          const burndownDataResponse = await axios.get(
            "https://sw.infoglobal.id/executive-summary-dashboard/get-burndown-chart-project",
            {
              params: {
                types: selectedTypes.map((type) => type.value).join(","),
              },
            }
          );
          const burndownData = burndownDataResponse.data;

          // Fetch assignee data based on selected types
          const assigneeDataResponse = await axios.get(
            "https://sw.infoglobal.id/executive-summary-dashboard/get-progress-assignee-version",
            {
              params: {
                types: selectedTypes.map((type) => type.value).join(","),
              },
            }
          );
          const assigneeData = assigneeDataResponse.data;

          // Set the fetched data to state variables
          setProjectData(filteredProject);
          setLineChartData(burndownData);
          setAssigneeData(assigneeData);
        } else {
          // Reset the data if the label doesn't match any project
          setSelectedVersion(null);
          setSelectedTypes([]);
          setProjectData(null);
          setLineChartData(null);
          setAssigneeData(null);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [selectedTypes, selectedVersion, selectedAssigneeDropdown]);

  function getLabelFromURL() {
    const url = window.location.href;
    const parts = url.split("/");
    const label = parts[parts.length - 1];
    return decodeURIComponent(label);
  }

  const handleVersionSelect = (selectedOption) => {
    setSelectedVersion(selectedOption);
  };

  const handleTypeSelect = (selectedOptions) => {
    setSelectedTypes(selectedOptions);
  };

  const handleAssigneeDropdownSelect = (selectedOption) => {
    setSelectedAssigneeDropdown(selectedOption);
  };

  return (
    <Container fluid className="project-components">
      <Row className="row">
        <Col className="button d-flex justify-content-end">
          <Select
            options={typeOptions}
            isMulti
            onChange={handleTypeSelect}
            value={selectedTypes}
            placeholder="Select Type"
          />
        </Col>
        <Col className="button d-flex justify-content-end">
          <Select
            options={versionOptions}
            isClearable
            isSearchable
            onChange={handleVersionSelect}
            value={selectedVersion}
            placeholder="Select Version"
          />
        </Col>
      </Row>

      <div>
        <h3 className="sub-judul-project">Progress</h3>
        <div className="projectProgress">
          {projectData && (
            <Bar
              data={{
                labels: ["Project Progress"],
                datasets: [
                  {
                    label: "Done",
                    data: [projectData.progress.progress_by_wp],
                    backgroundColor: "#327332",
                    barThickness: 40,
                  },
                  {
                    label: "Undone",
                    data: [100 - projectData.progress.progress_by_wp],
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
            <Line
              data={{
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
                    label: "On-going",
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
                value={selectedAssigneeDropdown}
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
                  labels: assigneeData[0]?.versions[0]?.progress.map(
                    (member) => member.member_name
                  ),
                  datasets: [
                    {
                      label:
                        selectedAssigneeDropdown?.value === "progress"
                          ? "Progress"
                          : "Story Points",
                      data: assigneeData[0]?.versions[0]?.progress.map((member) =>
                        selectedAssigneeDropdown?.value === "progress"
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
