import React, { useState } from 'react';
import { projectData } from '../data/index.js';

const Ganttchart = () => {
  const [view, setView] = useState('weekly'); // State variable for selected view
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // State variable for selected year
  const [selectedMonth, setSelectedMonth] = useState(''); // State variable for selected month

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
  ];

  // Year options
  const currentYear = new Date().getFullYear();
  const yearsToShow = 5;
  const startYear = currentYear;
  const endYear = startYear + yearsToShow - 1;
  const yearOptions = Array.from({ length: yearsToShow }, (_, i) => startYear + i);

  // Event handlers
  const handleViewChange = (event) => {
    setView(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value));
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  // Helper function to get the relevant dates based on the selected view
  const getDates = (month) => {
    return view === 'weekly' ? [1, 8, 15, 22, 29] : month.dates;
  };

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

    // Check the selected view and date range to determine whether to display a bullet mark
    if (view === 'daily') {
      return '•';
    } else if (view === 'weekly') {
      const currentDate = new Date(selectedYear, months.findIndex((m) => m.name === month), date);
      const startDate = new Date(currentDate);
      startDate.setDate(startDate.getDate() - ((currentDate.getDay() - 1 + 7) % 7)); // Start from the first day of the week
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6); // End on the seventh day of the week

      if (currentDate >= startDate && currentDate <= endDate) {
        return '•';
      } else {
        return '';
      }
    }

    return '';
  };

  return (
    <div className="landingpage">
      <div className="second-row">
        <div>
          <label>
            <input type="radio" value="weekly" checked={view === 'weekly'} onChange={handleViewChange} />
            Weekly
          </label>
          <label>
            <input type="radio" value="daily" checked={view === 'daily'} onChange={handleViewChange} />
            Daily
          </label>
        </div>
        {view === 'daily' && (
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
          </div>
        )}
        <div className="table-container">
          <table>
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
                    return getDates(month).map((date) => (
                      <th key={`${month.name}-${date}`}>{date}</th>
                    ));
                  }
                  return null;
                })}
              </tr>
            </thead>
            <tbody>
              {projectData.map((project) => (
                <tr key={project.projectName}>
                  <td>{project.projectName}</td>
                  {months.map((month) => {
                    if (selectedMonth === '' || selectedMonth === month.name) {
                      return getDates(month).map((date) => (
                        <td key={`${project.projectName}-${month.name}-${date}`}>
                          {getBulletMark(project.milestones, selectedYear, month.name, date)}
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
