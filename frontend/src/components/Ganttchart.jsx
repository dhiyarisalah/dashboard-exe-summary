import React, { useState } from 'react';
import { projectData } from '../data/index.js';

const Ganttchart = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // State variable for selected year
  const [selectedMonth, setSelectedMonth] = useState(''); // State variable for selected month
  const [granularity, setGranularity] = useState('weekly'); // State variable for selected granularity (weekly or daily)

  const months = [
    { name: 'January', weeks: [1, 2, 3, 4, 5], dates: Array.from({ length: 31 }, (_, i) => i + 1) },
    { name: 'February', weeks: [1, 2, 3, 4], dates: Array.from({ length: 28 }, (_, i) => i + 1) },
    { name: 'March', weeks: [1, 2, 3, 4, 5], dates: Array.from({ length: 31 }, (_, i) => i + 1) },
    { name: 'April', weeks: [1, 2, 3, 4], dates: Array.from({ length: 30 }, (_, i) => i + 1) },
    { name: 'May', weeks: [1, 2, 3, 4, 5], dates: Array.from({ length: 31 }, (_, i) => i + 1) },
    { name: 'June', weeks: [1, 2, 3, 4], dates: Array.from({ length: 30 }, (_, i) => i + 1) },
    { name: 'July', weeks: [1, 2, 3, 4, 5], dates: Array.from({ length: 31 }, (_, i) => i + 1) },
    { name: 'August', weeks: [1, 2, 3, 4, 5], dates: Array.from({ length: 31 }, (_, i) => i + 1) },
    { name: 'September', weeks: [1, 2, 3, 4], dates: Array.from({ length: 30 }, (_, i) => i + 1) },
    { name: 'October', weeks: [1, 2, 3, 4, 5], dates: Array.from({ length: 31 }, (_, i) => i + 1) },
    { name: 'November', weeks: [1, 2, 3, 4], dates: Array.from({ length: 30 }, (_, i) => i + 1) },
    { name: 'December', weeks: [1, 2, 3, 4, 5], dates: Array.from({ length: 31 }, (_, i) => i + 1) },
  ];

  // Year options
  const currentYear = new Date().getFullYear();
  const yearsToShow = 5;
  const startYear = currentYear;
  const endYear = startYear + yearsToShow - 1;
  const yearOptions = Array.from({ length: yearsToShow }, (_, i) => startYear + i);

  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value));
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleGranularityChange = (event) => {
    setGranularity(event.target.value);
  };

  // Helper function to get the relevant dates based on the selected view
  const getDates = (month) => {
    return granularity === 'weekly' ? month.weeks : month.dates;
  };

  // Helper function to get the bullet mark for a specific milestone
// Helper function to get the bullet mark for a specific milestone
// Helper function to get the bullet mark for a specific milestone
const getBulletMark = (milestones, selectedYear, month, date) => {
  // Find the milestone with the matching date
  const milestone = milestones.find((milestone) => {
    const milestoneDate = new Date(milestone.date);
    const milestoneYear = milestoneDate.getFullYear();
    const milestoneMonth = milestoneDate.getMonth() + 1; // Month value is zero-based
    const milestoneDay = milestoneDate.getDate();

    return (
      milestoneYear === selectedYear &&
      milestoneMonth === months.findIndex((m) => m.name === month) + 1 &&
      milestoneDay === date
    );
  });

  // If no milestone found, return an empty string
  if (!milestone) return '';

  if (granularity === 'weekly') {
    // Find the first day of the week for the selected date
    const firstDayOfMonth = new Date(selectedYear, months.findIndex((m) => m.name === month), 1);
    const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 (Sunday) to 6 (Saturday)
    
    // Calculate the week number
    const weekNumber = Math.ceil((date + firstDayOfWeek) / 7);
    
    return `Week ${weekNumber} •`;
  }

  return '•';
};



  return (
    <div className="landingpage">
      <div className="second-row">
        <div>
          <label htmlFor="year">Select Year:</label>
          <select id="year" value={selectedYear} onChange={handleYearChange}>
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <label htmlFor="month">Select Month:</label>
          <select id="month" value={selectedMonth} onChange={handleMonthChange}>
            <option value="">All Months</option>
            {months.map((month) => (
              <option key={month.name} value={month.name}>
                {month.name}
              </option>
            ))}
          </select>
          <label htmlFor="granularity">Select Granularity:</label>
          <select id="granularity" value={granularity} onChange={handleGranularityChange}>
            <option value="weekly">Weekly</option>
            <option value="daily">Daily</option>
          </select>
        </div>
        <div className="table-container">
          <table>
            {/* Table header */}
            <thead>
              <tr>
                <th colSpan={months.reduce((acc, month) => acc + getDates(month).length, 0) + 1}>
                  Year {selectedYear}
                </th>
              </tr>
              <tr>
                <th rowSpan="2">Projects</th>
                {months.map((month) => {
                  if (selectedMonth === '' || selectedMonth === month.name) {
                    return (
                      <th colSpan={getDates(month).length} key={month.name}>
                        {month.name}
                      </th>
                    );
                  }
                  return null;
                })}
              </tr>
              <tr>
                {months.map((month) => {
                  if (selectedMonth === '' || selectedMonth === month.name) {
                    return getDates(month).map((item) => (
                      <th key={`${month.name}-${item}`}>{granularity === 'weekly' ? `Week ${item}` : item}</th>
                    ));
                  }
                  return null;
                })}
              </tr>
            </thead>
            {/* Table body */}
            <tbody>
              {projectData.map((project) => (
                <tr key={project.projectName}>
                  <td>{project.projectName}</td>
                  {months.map((month) => {
                    if (selectedMonth === '' || selectedMonth === month.name) {
                      return getDates(month).map((item) => (
                        <td key={`${project.projectName}-${month.name}-${item}`}>
                          {getBulletMark(project.milestones, selectedYear, month.name, item)}
                        </td>
                      ));
                    }
                    return null;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <style>
        {`
          table {
            border-collapse: collapse;
          }
          th,
          td {
            border: 1px solid black;
            padding: 8px;
          }
          th[colSpan="4"] {
            text-align: center;
          }
          .table-container {
            max-height: 400px;
            overflow: auto;
          }
        `}
      </style>
    </div>
  );
};

export default Ganttchart;
