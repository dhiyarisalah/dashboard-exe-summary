import React from 'react';
import { Chart } from 'react-google-charts';
import { phaseTimeline } from '../data/index.js';

const colorArray = [
  '#FF5733',
  '#33FF57',
  '#5733FF',
  '#FF33C4',
  '#33C4FF',
  // Add more colors here if needed...
];

const Timeline = () => {
  // Generate the project timeline data
  const projectTimelineData = phaseTimeline.flatMap((project, projectIndex) => {
    const projectName = project.projectName;
    return project.phase.map((phase, phaseIndex) => {
      const colorIndex = phaseIndex % colorArray.length; // To cycle through colors if there are more phases than colors

      // Calculate the range of months for the phase
      const startYear = new Date(phase.start_date).getFullYear();
      const endYear = new Date(phase.end_date).getFullYear();
      const startMonth = new Date(phase.start_date).getMonth();
      const endMonth = new Date(phase.end_date).getMonth();

      const startDate = new Date(startYear, startMonth, 1); // First day of the start month
      const endDate = new Date(endYear, endMonth + 1, 0); // Last day of the end month

      return [
        projectName, // Project ID
        phase.phase, // Phase Name
        startDate,
        endDate,
        undefined, // Use undefined to specify custom color for each phase
        colorArray[colorIndex], // Assign a color from the colorArray based on the phaseIndex
      ];
    });
  });

  // Create a phaseColorMap to store the colors for each phase
  const phaseColorMap = projectTimelineData.reduce((map, [, phaseName, , , , color]) => {
    if (!map[phaseName]) {
      map[phaseName] = color;
    }
    return map;
  }, {});

  // Generate an array for each month of the year
  const currentYear = new Date().getFullYear();
  const monthsData = Array.from({ length: 12 }, (_, monthIndex) => {
    const startDate = new Date(currentYear, monthIndex, 1);
    const endDate = new Date(currentYear, monthIndex + 1, 0);
    return [
      '', // Empty string for Project ID
      '', // Empty string for Phase Name
      startDate,
      endDate,
      undefined,
      colorArray[0],
    ];
  });

  // Combine project timeline data and months data
  const fullTimelineData = [...projectTimelineData, ...monthsData];

  // Filter out rows with an empty Project ID
  const filteredTimelineData = fullTimelineData.filter(([projectID]) => projectID !== '');

  return (
    <div style={{ overflowX: 'auto' }}>
      <Chart
        chartType="Timeline"
        data={[
          ['Project ID', 'Phase Name', 'Start Date', 'End Date', { type: 'string', role: 'style' }, { id: 'style', type: 'string', role: 'style' }],
          ...filteredTimelineData,
        ]}
        options={{
          timeline: {
            groupByRowLabel: true,
            showBarLabels: false, // Hide the phase names at the top of each timeline
          },
          colors: Object.values(phaseColorMap), // Set the colors for the timeline from the phaseColorMap
          legend: { position: 'bottom' }, // Show the legend at the bottom
        }}
        width="100%"
        height="300px"
      />
      <div style={{ textAlign: 'center' }}>
        {Object.entries(phaseColorMap).map(([phaseName, color], index) => (
          <span key={index} style={{ margin: '0 10px' }}>
            <div style={{ backgroundColor: color, width: '10px', height: '10px', display: 'inline-block' }}></div>
            <span style={{ paddingLeft: '5px' }}>{phaseName}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
