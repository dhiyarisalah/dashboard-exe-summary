import {Container, Row, Col, Button} from 'react-bootstrap'
import ProjectChart from '../components/ProjectChart'
import Progress from '../components/Progress'

const LandingPage = () => {
  return (
    <div className= "landingpage">
     <header className= "w=100 min-vh-100">
      <Row>
        <Col>
        <h1>Dashboard</h1>
        </Col>
        <Col className="d-flex justify-content-end">
          <Button className='refresh-button'>Refresh</Button>

        </Col>
      </Row>

      <div className='date-updated'>
        Last Update: DD/MM/YY
      </div>
      <h2>Project</h2>
      <h3>Overview</h3>
      <Container>
        <Row>
          <Col>
          <ProjectChart />
          </Col>
          <Col>
          <Progress />
          </Col>
        </Row>
        <Row>
          DRG
        </Row>
        <Row>
          DRG
        </Row>
      </Container>
    
     </header>
     <div className= "w=100 min-vh-100">  </div>
    </div>
  )
}

export default LandingPage