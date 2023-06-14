import {Row, Col, Button, Container} from 'react-bootstrap'
import ProjectChart from '../components/ProjectChart'
// import ProjectChart from '../components/ProjectChart'
// import Progress from '../components/Progress'

const LandingPage = () => {
  return (
    <div className= "landingpage">
      <header className= "w=100 min-vh-100">
        <Row>
          <Col>
            <h1 style={{fontWeight:'bolder'}}>Dashboard</h1>
          </Col>
          <Col className="d-flex justify-content-end">
            <Button className='refresh-button'>Refresh</Button>
          </Col>
        </Row>
        <div className='date-updated'>
          Last Update: DD/MM/YY
        </div>
        <div>
          <h2 style={{fontWeight:'bolder'}}>Project</h2>
        </div>
        <div>
          <h3 style={{fontSize:"24px"}}>Overview</h3>
        </div>
        <Container>
          <Row>
            <Col> 
            <ProjectChart />
            </Col>
          </Row>
        </Container>
     </header>
    </div>
  )
}

export default LandingPage
