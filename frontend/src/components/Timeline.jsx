import React, { useState } from 'react';
import { Chart } from 'react-google-charts';
import { phaseTimeline, milestoneData } from '../data/index.js';
import { Button } from 'react-bootstrap';

const colorArray = [
  '#FF5733',
  '#33FF57',
  '#5733FF',
  '#FF33C4',
  '#33C4FF',
  // Add more colors here if needed...
];

const Timeline = () => {
  const [selectedView, setSelectedView] = useState('Phase');

  // Generate the project timeline data for "Phase" view
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

  // Generate the project timeline data for "Milestone" view
  const milestoneTimelineData = milestoneData.flatMap((project, projectIndex) => {
    const projectName = project.projectName;
    return project.milestones.map((milestone, milestoneIndex) => {
      const colorIndex = milestoneIndex % colorArray.length; // To cycle through colors if there are more milestones than colors

      // Calculate the date for the milestone
      const milestoneDate = new Date(milestone.date);
      const startDate = new Date(milestoneDate.getFullYear(), milestoneDate.getMonth(), milestoneDate.getDate()); // First day of the milestone date
      const endDate = new Date(milestoneDate.getFullYear(), milestoneDate.getMonth(), milestoneDate.getDate()); // Same as start date

      return [
        projectName, // Project ID
        milestone.wpName, // Milestone Name
        startDate,
        endDate,
        undefined, // Use undefined to specify custom color for each milestone
        colorArray[colorIndex], // Assign a color from the colorArray based on the milestoneIndex
      ];
    });
  });

  // Create a phaseColorMap to store the colors for each phase/milestone
  const phaseColorMap = selectedView === 'Phase'
    ? projectTimelineData.reduce((map, [, phaseName, , , , color]) => {
        if (!map[phaseName]) {
          map[phaseName] = color;
        }
        return map;
      }, {})
    : milestoneTimelineData.reduce((map, [, milestoneName, , , , color]) => {
        if (!map[milestoneName]) {
          map[milestoneName] = color;
        }
        return map;
      }, {});

  // Customize the tooltip content based on the selected view
  const getTooltipContent = (view) => {
    if (view === 'Phase') {
      return `$start (Phase)<br>Project: $name<br>Phase: $phase<br>Start: $start<br>End: $end`;
    } else {
      return `$start (Milestone)<br>Project: $name<br>Milestone: $wpName<br>Date: $start`;
    }
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ marginBottom: '10px', textAlign: 'center' }}>
        <Button
          className='refresh-button'
          variant={selectedView === 'Phase' ? 'primary' : 'secondary'}
          style={{ marginRight: '10px', fontWeight: selectedView === 'Phase' ? 'normal' : 'normal' }}
          onClick={() => setSelectedView('Phase')}
        >
          Phase
        </Button>
        <Button
          className='refresh-button'
          variant={selectedView === 'Milestone' ? 'primary' : 'secondary'}
          style={{ fontWeight: selectedView === 'Milestone' ? 'normal' : 'normal' }}
          onClick={() => setSelectedView('Milestone')}
        >
          Milestone
        </Button>
      </div>
      <div style={{ position: 'relative' }}>
        {/* Transparent overlay to disable hover */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none', // This makes the overlay not intercept hover events
            zIndex: 1, // Make sure the overlay is above the chart
          }}
        />
        <Chart
          chartType="Timeline"
          data={[
            ['Project ID', 'Phase Name', 'Start Date', 'End Date', { type: 'string', role: 'style' }, { id: 'style', type: 'string', role: 'style' }],
            ...(selectedView === 'Phase' ? projectTimelineData : milestoneTimelineData),
          ]}
          options={{
            timeline: {
              groupByRowLabel: true,
              showBarLabels: false,
            },
            colors: Object.values(phaseColorMap),
            // Conditionally hide the legend when the selectedView is "Milestone"
            legend: selectedView === 'Phase' ? { position: 'bottom' } : 'none',
            // Customize the tooltip content based on the selected view
            tooltip: {
              trigger: '',
              isHtml: true,
              ignoreBounds: true,
              textStyle: {
                color: '#444',
                fontSize: 12,
              },
              html: getTooltipContent(selectedView), // Call the function to get the tooltip content
            },
          }}
          width="100%"
          height="300px"
        />
      </div>
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
