import React, { useState } from 'react';
import { projectData } from '../data/index.js';
import { Dropdown, Table } from 'react-bootstrap';

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

  const getDates = (month) => {
    return granularity === 'weekly' ? month.weeks : month.dates;
  };

  const getBulletMark = (milestones, selectedYear, month, date) => {
    const milestone = milestones.find((milestone) => {
      const milestoneDate = new Date(milestone.date);
      const milestoneYear = milestoneDate.getFullYear();
      const milestoneMonth = milestoneDate.getMonth() + 1;
      const milestoneDay = milestoneDate.getDate();
  
      return (
        milestoneYear === selectedYear &&
        milestoneMonth === months.findIndex((m) => m.name === month) + 1 &&
        milestoneDay === date
      );
    });
  
    if (!milestone) return '';
  
    if (granularity === 'weekly') {
      const monthObj = months.find((m) => m.name === month);
      const firstWeekOfMonth = monthObj.weeks[0];
      const weekNumber = date <= firstWeekOfMonth ? 1 : Math.ceil((date - firstWeekOfMonth + 1) / 7);
  
      return `W${weekNumber} •`;
    }
  
    return '•';
  };
  
  

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <label htmlFor="year">Select Year:</label>
          <Dropdown>
            <Dropdown.Toggle variant="primary" id="year-dropdown">
              {selectedYear}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {yearOptions.map((year) => (
                <Dropdown.Item
                  key={year}
                  active={selectedYear === year}
                  onClick={() => setSelectedYear(year)}
                >
                  {year}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="col">
          <label htmlFor="month">Select Month:</label>
          <Dropdown>
            <Dropdown.Toggle variant="primary" id="month-dropdown">
              {selectedMonth ? selectedMonth : 'All Months'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item active={!selectedMonth} onClick={() => setSelectedMonth('')}>
                All Months
              </Dropdown.Item>
              {months.map((month) => (
                <Dropdown.Item
                  key={month.name}
                  active={selectedMonth === month.name}
                  onClick={() => setSelectedMonth(month.name)}
                >
                  {month.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="col">
          <label htmlFor="granularity">Select Granularity:</label>
          <select
            id="granularity"
            className="form-select"
            value={granularity}
            onChange={handleGranularityChange}
          >
            <option value="weekly">Weekly</option>
            <option value="daily">Daily</option>
          </select>
        </div>
      </div>
      <div className="table-responsive">
        <Table bordered>
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
                    <th key={date}>{granularity === 'weekly' ? `W${date}` : date}</th>
                  ));
                }
                return null;
              })}
            </tr>
          </thead>
          <tbody>
            {projectData.map((project) => (
              <tr key={project.id}>
                <td>{project.projectName}</td>
                {months.map((month) => {
                  if (selectedMonth === '' || selectedMonth === month.name) {
                    return getDates(month).map((date) => (
                      <td key={date}>
                        {getBulletMark(project.milestones, selectedYear, month.name, date)}
                      </td>
                    ));
                  }
                  return null;
                })}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default Ganttchart;
