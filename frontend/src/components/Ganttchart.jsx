import React, { useState } from 'react';
import { projectData } from '../data/index.js';

const Ganttchart = () => {
  const [view, setView] = useState('weekly'); // State variable for selected view
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // State variable for selected year

  // Generate an array of month names with all the dates
  const months = [
    { name: 'January', dates: Array.from({ length: 31 }, (_, i) => i + 1) },
    { name: 'February', dates: Array.from({ length: 28 }, (_, i) => i + 1) },
    { name: 'March', dates: Array.from({ length: 31 }, (_, i) => i + 1) },
    { name: 'April', dates: Array.from({ length: 30 }, (_, i) => i + 1) },
    { name: 'May', dates: Array.from({ length: 31 }, (_, i) => i + 1) },
    { name: 'June', dates: Array.from({ length: 30 }, (_, i) => i + 1) },
    { name: 'July', dates: Array.from({ length: 31 }, (_, i) => i + 1) },
    { name: 'August', dates: Array.from({ length: 31 }, (_, i) => i + 1) },
    { name: 'September', dates: Array.from({ length: 30 }, (_, i) => i + 1) },
    { name: 'October', dates: Array.from({ length: 31 }, (_, i) => i + 1) },
    { name: 'November', dates: Array.from({ length: 30 }, (_, i) => i + 1) },
    { name: 'December', dates: Array.from({ length: 31 }, (_, i) => i + 1) },
    // Add more months with their corresponding dates as needed
  ];

  const currentYear = new Date().getFullYear();
  const yearsToShow = 5;
  const startYear = currentYear + 1;
  const yearOptions = Array.from({ length: yearsToShow }, (_, i) => startYear + i);

  const handleViewChange = (event) => {
    setView(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value));
  };

  const getDates = (month) => {
    if (view === 'weekly') {
      return month.dates.filter((date) => date % 7 === 1);
    } else {
      return month.dates;
    }
  };

  return (
    <div>
      <div>
        <label>
          <input
            type="radio"
            value="weekly"
            checked={view === 'weekly'}
            onChange={handleViewChange}
          />
          Weekly
        </label>
        <label>
          <input
            type="radio"
            value="daily"
            checked={view === 'daily'}
            onChange={handleViewChange}
          />
          Daily
        </label>
      </div>
      <div>
        <label htmlFor="year">Select Year:</label>
        <select id="year" value={selectedYear} onChange={handleYearChange}>
          {yearOptions.map((year) => (
            <option value={year} key={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th colSpan={months.reduce((acc, month) => acc + getDates(month).length, 0) + 1}>
              Year {selectedYear}
            </th>
          </tr>
          <tr>
            <th rowSpan="2">Projects</th>
            {months.map((month) => (
              <th colSpan={getDates(month).length} key={month.name}>
                {month.name}
              </th>
            ))}
          </tr>
          <tr>
            {months.map((month) =>
              getDates(month).map((date) => (
                <th key={`${month.name}-${date}`}>{date}</th>
              ))
            )}
          </tr>
        </thead>
        <tbody>
          {projectData.map((project) => (
            <tr key={project.projectName}>
              <td>{project.projectName}</td>
              {months.map((month) =>
                getDates(month).map((date) => (
                  <td key={`${project.projectName}-${month.name}-${date}`}>
                    {project.milestones.find(
                      (milestone) =>
                        milestone.date ===
                        `${selectedYear}-${months.findIndex((m) => m.name === month.name) + 1}-${date}`
                    )?.wpName || ''}
                  </td>
                ))
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <style>
        {`
          table {
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid black;
            padding: 8px;
          }
          th[colSpan="4"] {
            text-align: center;
          }
        `}
      </style>
    </div>
  );
};

export default Ganttchart;
