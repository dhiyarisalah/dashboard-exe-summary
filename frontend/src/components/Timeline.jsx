import React, { useState, useEffect } from 'react';
import { Chart } from 'react-google-charts';
import { Button } from 'react-bootstrap';
import axios from 'axios';

const colorArray = [
  '#33FF57',
  '#194375',
  '#FF5733',
  '#F6C600',
  // Add more colors here if needed...
];

const Timeline = () => {
  const [selectedView, setSelectedView] = useState('Phase');
  const [timelineData, setTimelineData] = useState([]);
  const [phaseColorMap, setPhaseColorMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData(selectedView);
  }, [selectedView]);

  async function fetchData(view) {
    setLoading(true);
    try {
      const url =
        view === 'Phase'
          ? 'https://sw.infoglobal.id/executive-summary-dashboard/get-phase-by-project'
          : 'https://sw.infoglobal.id/executive-summary-dashboard/get-miles-by-project';

      const response = await axios.get(url);
      const data = response.data;
      console.log('Data fetched successfully:', data);

      if (view === 'Phase') {
        const projectTimelineData = data.flatMap((project, projectIndex) => {
          const projectName = project.projectName;
          return project.phase.map((phase, phaseIndex) => {
            const colorIndex = phaseIndex % colorArray.length;

            const startYear = new Date(phase.start_date).getFullYear();
            const endYear = new Date(phase.end_date).getFullYear();
            const startMonth = new Date(phase.start_date).getMonth();
            const endMonth = new Date(phase.end_date).getMonth();

            const startDate = new Date(startYear, startMonth, 1);
            const endDate = new Date(endYear, endMonth + 1, 0);

            return [
              projectName,
              phase.phase,
              startDate,
              endDate,
              undefined,
              colorArray[colorIndex],
            ];
          });
        });

        const phaseColors = projectTimelineData.reduce((map, [, phaseName, , , , color]) => {
          if (!map[phaseName]) {
            map[phaseName] = color;
          }
          return map;
        }, {});

        setPhaseColorMap(phaseColors);
        setTimelineData(projectTimelineData);
      } else {
        const milestoneTimelineData = data.flatMap((project, projectIndex) => {
          const projectName = project.projectName;
          return project.milestones.map((milestone, milestoneIndex) => {
            const colorIndex = milestoneIndex % colorArray.length;

            const milestoneDate = new Date(milestone.date);
            const startDate = new Date(milestoneDate.getFullYear(), milestoneDate.getMonth(), milestoneDate.getDate());
            const endDate = new Date(milestoneDate.getFullYear(), milestoneDate.getMonth(), milestoneDate.getDate());

            return [
              projectName,
              milestone.wpName,
              startDate,
              endDate,
              undefined,
              colorArray[colorIndex],
            ];
          });
        });

        const milestoneColors = milestoneTimelineData.reduce((map, [, milestoneName, , , , color]) => {
          if (!map[milestoneName]) {
            map[milestoneName] = color;
          }
          return map;
        }, {});

        setPhaseColorMap(milestoneColors);
        setTimelineData(milestoneTimelineData);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  }

  const getTooltipContent = (view, row, column) => {
    if (view === 'Phase') {
      const data = timelineData[row];
      const projectName = data[0];
      const phaseName = data[1];
      const start = data[2];
      const end = data[3];
      return `${start} (Phase)<br>Project: ${projectName}<br>Phase: ${phaseName}<br>Start: ${start}<br>End: ${end}`;
    } else {
      const data = timelineData[row];
      const projectName = data[0];
      const milestoneName = data[1];
      const start = data[2];
      return `${start} (Milestone)<br>Project: ${projectName}<br>Milestone: ${milestoneName}<br>Date: ${start}`;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }


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
      {selectedView === 'Phase' && (
        <div style={{ position: 'relative' }}>
          <Chart
            chartType='Timeline'
            data={[
              ['Project ID', 'Phase Name', 'Start Date', 'End Date', { type: 'string', role: 'style' }, { id: 'style', type: 'string', role: 'style' }],
              ...timelineData,
            ]}
            options={{
              timeline: {
                groupByRowLabel: true,
                showBarLabels: false,
              },
              colors: Object.values(phaseColorMap),
              legend: selectedView === 'Phase' ? { position: 'bottom' } : 'none',
              tooltip: {
                trigger: 'focus', // or 'selection'
                isHtml: true,
                ignoreBounds: true,
                textStyle: {
                  color: '#444',
                  fontSize: 12,
                },
                // Set the tooltip content as a function
                html: ({ row, column }) => getTooltipContent(selectedView, row, column),
              },
            }}
            width='100%'
            height='300px'
          />
        </div>
      )}
      {selectedView === 'Milestone' && (
        <Chart
          chartType='Timeline'
          data={[
            ['Project ID', 'Milestone Name', 'Start Date', 'End Date', { type: 'string', role: 'style' }, { id: 'style', type: 'string', role: 'style' }],
            ...timelineData,
          ]}
          options={{
            timeline: {
              groupByRowLabel: true,
              showBarLabels: false,
            },
            colors: Object.values(phaseColorMap),
            legend: 'none',
            tooltip: {
              trigger: 'focus', // or 'selection'
              isHtml: true,
              ignoreBounds: true,
              textStyle: {
                color: '#444',
                fontSize: 12,
              },
              // Set the tooltip content as a function
              format: 'MMM dd, yyyy',
            },
          }}
          width='100%'
          height='300px'
        />
      )}
      <div style={{ textAlign: 'center' }}>
        {selectedView === 'Phase' &&
          Object.entries(phaseColorMap).map(([phaseName, color], index) => (
            <span key={index} style={{ margin: '0 10px' }}>
              <div style={{ backgroundColor: color, width: '10px', height: '10px', display: 'inline-block' }}></div>
              <span style={{ paddingLeft: '5px' }}>{phaseName}</span>
            </span>
          ))}
      </div>
    </div>
  );
}

export default Timeline;

