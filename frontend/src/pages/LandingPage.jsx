import {Row, Col, Button, Container} from 'react-bootstrap'
import ProjectChart from '../components/ProjectChart'
import Progress from '../components/Progress'
import { useState, useEffect} from 'react'

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
      <header className= "w=100 min-vh-100">
        <Row>
          <Col>
            <h1 className='dashboard'>Dashboard</h1>
          </Col>
          <Col className="d-flex justify-content-end">
            <Button className='refresh-button' onClick={handleRefresh} >
              Refresh</Button>
          </Col>
        </Row>
        <div className='date-updated'>
          Last Update: {lastUpdate}
        </div>
        <div>
          <h2 className='project'>Project</h2>
        </div>
        <div>
          <h3 className='overview'>Overview</h3>
        </div>
        <Container>
          <Row>
            <Col>
              <ProjectChart />
            </Col>
            <Col>
              <Progress />
            </Col>
          </Row>

        </Container>
     </header>
    </div>
  )
}

export default LandingPage
