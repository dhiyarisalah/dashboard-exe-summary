import React, { useState, useEffect } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import ProjectChart from '../components/ProjectChart';
import Progress from '../components/Progress';
import Ganttchart  from '../components/Ganttchart';
import UserProgress from '../components/UserProgress';
import BurndownChart from '../components/BurndownChart';

const LandingPage = () => {
  const [lastUpdate, setLastUpdate] = useState('');

  useEffect(() => {
    const storedLastUpdate = localStorage.getItem('lastUpdate');
    if (storedLastUpdate) {
      setLastUpdate(storedLastUpdate);
    }
  }, []);

  const handleRefresh = () => {
    const currentDate = new Date().toLocaleString();
    setLastUpdate(currentDate);
    localStorage.setItem('lastUpdate', currentDate);
    window.location.reload(); // Refresh the page
  };

  return (
    <div className="landingpage">
      <div>
        <Row className="page-text">
          <Col className="text">
            <h1 className="dashboard">Dashboard</h1>
            <div className="date-updated"> Last Update: {lastUpdate} </div>
          </Col>
          <Col className="text d-flex justify-content-end">
            <Button className="refresh-button" onClick={handleRefresh}>
              Refresh
            </Button>
          </Col>
        </Row>
      </div>
      <div>
        <div className="page-text" key="project-overview">
          <h2 className="judul">Project</h2>
          <h3 className="sub-judul">Overview</h3>
          <Row className="row">
            <Col className="container-chart">
              <ProjectChart />
            </Col>
            <Col className="container-chart">
              <Progress />
            </Col>
          </Row>
          <h3 className="sub-judul">Milestones</h3>
          <Row className="row">
            <Col className="container-chart">
              <BurndownChart />
            </Col>
          </Row>
          <Row className="row">
            <Col className="container-chart">
              <Ganttchart />
            </Col>
          </Row>
        </div>
      </div>
      <div>
        <div className="page-text" key="all-assignees">
          <h2 className="judul">All Assignees</h2>
          <h3 className="sub-judul">Work Packages</h3>
          <Row className="row">
            <Col className="container-chart">
              <UserProgress />
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
