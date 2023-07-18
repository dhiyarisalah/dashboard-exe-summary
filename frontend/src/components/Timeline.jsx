import React, { useState, useEffect } from 'react';
import { Chart } from 'react-google-charts';
import { Button } from 'react-bootstrap';
import axios from 'axios';

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

  const getTooltipContent = (view) => {
    if (view === 'Phase') {
      return `$start (Phase)<br>Project: $name<br>Phase: $phase<br>Start: $start<br>End: $end`;
    } else {
      return `$start (Milestone)<br>Project: $name<br>Milestone: $wpName<br>Date: $start`;
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
      <div style={{ position: 'relative' }}>
        {/* Transparent overlay to disable hover */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
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
              trigger: '',
              isHtml: true,
              ignoreBounds: true,
              textStyle: {
                color: '#444',
                fontSize: 12,
              },
              html: getTooltipContent(selectedView),
            },
          }}
          width='100%'
          height='300px'
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
