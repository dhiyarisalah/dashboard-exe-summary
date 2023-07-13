import React from 'react';
import { Chart } from 'react-google-charts';

const Ganttchart = () => {
  const ganttChartData = [
    [
      'Task ID',
      'Task Name',
      'Start Date',
      'End Date',
      'Duration',
      'Percent Complete',
      'Dependencies',
    ],
    [
      'Task 1',
      'Task 1',
      new Date(2023, 6, 1),
      new Date(2023, 6, 7),
      new Date(2023, 6, 7).getTime() - new Date(2023, 6, 1).getTime(),
      100,
      null,
    ],
    [
      'Task 1',
      'Task 1',
      new Date(2023, 6, 1),
      new Date(2023, 6, 7),
      new Date(2023, 6, 7).getTime() - new Date(2023, 6, 1).getTime(),
      100,
      null,
    ],
    [
      'Task 1',
      'Task 1',
      new Date(2023, 6, 8),
      new Date(2023, 6, 14),
      new Date(2023, 6, 14).getTime() - new Date(2023, 6, 8).getTime(),
      75,
      null,
    ],
    [
      'Task 4',
      'Task 4',
      new Date(2023, 6, 8),
      new Date(2023, 6, 14),
      new Date(2023, 6, 14).getTime() - new Date(2023, 6, 8).getTime(),
      75,
      'Task 3',
    ],
  ];

  return (
    <Chart
      chartType="Gantt"
      data={ganttChartData}
      width="100%"
      height="400px"
    />
  );
};

export default Ganttchart;
