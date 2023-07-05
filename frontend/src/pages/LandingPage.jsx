import {Row, Col, Button, Container} from 'react-bootstrap'
import ProjectChart from '../components/ProjectChart'
import Progress from '../components/Progress'
import { useState, useEffect} from 'react'
import Ganttchart from '../components/Ganttchart'
import UserProgress from '../components/UserProgress'

const LandingPage = () => {
  const [lastUpdate, setLastUpdate] = useState("");

  useEffect(() => {
    const storedLastUpdate = localStorage.getItem ('lastUpdate');
    if (storedLastUpdate) {
      setLastUpdate(storedLastUpdate);
    }
  }, [])

  const handleRefresh = () => {
    const currentDate = new Date().toLocaleString();
    setLastUpdate(currentDate);
    localStorage.setItem('lastUpdate', currentDate);
  }
  return (
    <div className= "landingpage">
      <div>
        <Row className='page-text'>
          <Col className='text'>
            <h1 className='dashboard'>Dashboard</h1> 
            <text className='date-updated'> Last Update: {lastUpdate} </text>
          </Col>
          <Col className="text d-flex justify-content-end">
            <Button className='refresh-button' onClick={handleRefresh} >
              Refresh</Button>
          </Col>
        </Row>
      </div>
      <div> 
        <div className='page-text'>
          <h2 className='judul'>Project</h2>
          <h3 className='sub-judul'>Overview</h3>
          <Row className='row w=200 min-vh-200'>
            <Col className= 'container-chart'>
              <ProjectChart />
            </Col>
            <Col className= 'container-chart'>
              <Progress />
            </Col>
          </Row>
          <h3 className='sub-judul'>Milestones</h3>
          <Row className="row w=100 min-vh-100">
            <Col className="container-chart"> 
              <Ganttchart />
            </Col>
          </Row>
        </div>
      </div>
      <div>
        <div className='page-text'>
          <h2 className='judul'>All Assignees</h2>
          <h3 className='sub-judul'>Work Packages</h3>
          <Row className= "row w=100 min-vh-100">
            <Col className='container-chart'>
              <UserProgress />
            </Col>
          </Row>  
        </div>
     </div>
  </div> 
  )
}

export default LandingPage
