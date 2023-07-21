import React, { useState, useEffect } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { Bar, Line } from "react-chartjs-2";
import Select from "react-select";
import axios from "axios";

function ProjectBar() {
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [lineChartData, setLineChartData] = useState(null);
  const [assigneeData, setAssigneeData] = useState(null);
  const [versionOptions, setVersionOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [filteredVersions, setFilteredVersions] = useState([]);
  const [selectedAssigneeDropdown, setSelectedAssigneeDropdown] = useState(null);


  async function fetchVersionOptions(selectedTypeValues) {
    try {
      // If "All Types" is selected or no types are selected, fetch all version options
      if (selectedTypeValues.length === 0 || selectedTypeValues.includes("all")) {
        const progressResponse = await axios.get(
          "https://sw.infoglobal.id/executive-summary-dashboard/get-progress-version"
        );
        const progressData = progressResponse.data;
  
        const labelParam = getLabelFromURL();
        const filteredProject = progressData.find(
          (project) => project.project_name === labelParam
        );
  
        if (filteredProject) {
          // Update the version options based on the fetched data
          const versionOptions = filteredProject.progress.map((data) => ({
            value: data.version_name,
            label: data.version_name,
          }));
  
          // Add "All Version" option
          versionOptions.unshift({
            value: "all",
            label: "All Versions",
          });
  
          setVersionOptions(versionOptions);
  
          // If "All Types" is selected or no types are selected, do not reset the selected version
          // Keep the current selected version if it exists in the versionOptions
          if (
            selectedVersion &&
            versionOptions.some((option) => option.value === selectedVersion.value)
          ) {
            setSelectedVersion(selectedVersion);
          }
        } else {
          // Reset the version options if the label doesn't match any project
          setVersionOptions([]);
          setSelectedVersion(null);
        }
      } else {
        // Fetch version options based on selected types
        const progressResponse = await axios.get(
          "https://sw.infoglobal.id/executive-summary-dashboard/get-progress-version",
          {
            params: {
              wp_types: selectedTypeValues.join(","),
            },
          }
        );
        const progressData = progressResponse.data;
  
        const labelParam = getLabelFromURL();
        const filteredProject = progressData.find(
          (project) => project.project_name === labelParam
        );
  
        if (filteredProject) {
          // Update the version options based on the fetched data
          const versionOptions = filteredProject.progress.map((data) => ({
            value: data.version_name,
            label: data.version_name,
          }));
  
          // Add "All Version" option
          versionOptions.unshift({
            value: "all",
            label: "All Versions",
          });
  
          setVersionOptions(versionOptions);
  
          // If the selected version is not in the filtered versions, reset the selection
          if (
            selectedVersion &&
            !versionOptions.some((option) => option.value === selectedVersion.value)
          ) {
            setSelectedVersion(null);
          }
  
          // Set the filtered versions state
          const filteredVersions = filteredProject.progress.map((data) => data.version_name);
          setFilteredVersions(filteredVersions);
        } else {
          // Reset the version options if the label doesn't match any project
          setVersionOptions([]);
          setSelectedVersion(null);
        }
      }
    } catch (error) {
      console.error("Error fetching version options:", error);
    }
  }
  


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
          // Set the type options for the dropdown
          const typeOptions = filteredProject.wp_types.map((type) => ({
            value: type,
            label: type,
          }));

          // Add "All Types" option
          typeOptions.unshift({
            value: "all",
            label: "All Types",
          });

          setTypeOptions(typeOptions);

          // Set the default selection to "All Types" if no types are selected
          setSelectedTypes([]);

          // Fetch version options based on all types (passing an empty array for wp_types)
          await fetchVersionOptions([]);
        } else {
          // Reset the data if the label doesn't match any project
          setSelectedVersion(null);
          setSelectedTypes([]);
          setLineChartData(null);
          setAssigneeData(null);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    // Check if "All Versions" is selected
    const isAllVersionsSelected = selectedVersion?.value === "all";

    // Check if "All Types" is selected
    const isAllTypesSelected = selectedTypes.some((option) => option.value === "all");

    if (isAllVersionsSelected || isAllTypesSelected) {
      // Fetch version options based on empty wp_types
      fetchVersionOptions([]);
    } else {
      // Fetch version options based on selected types
      fetchVersionOptions(selectedTypes.map((type) => type.value));
    }
  }, [selectedTypes, selectedVersion]);

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
    // Check if "All Types" is selected
    const isAllTypesSelected = selectedOptions.some((option) => option.value === "all");

    if (isAllTypesSelected) {
      // Set selected types to only "All Types"
      setSelectedTypes([{ value: "all", label: "All Types" }]);
      // Fetch version options based on empty wp_types (reset the selection)
      fetchVersionOptions([]);
    } else {
      // Exclude "All Types" from the selected options
      setSelectedTypes(selectedOptions.filter((option) => option.value !== "all"));
      // Fetch version options based on selected types
      fetchVersionOptions(selectedOptions.map((type) => type.value));
    }
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