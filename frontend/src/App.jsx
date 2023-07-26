import {Routes, Route} from 'react-router-dom'
import LandingPage from './pages/LandingPage';
import NavbarComponents from './components/NavbarComponents';
import ProjectDetails from './pages/ProjectDetails';
import AssigneeDetails from './pages/AssigneeDetails';
function App() {
  return (
    <div>
      <NavbarComponents />
      <Routes>
        <Route path="/nirmala" Component={LandingPage} />
        <Route path="/nirmala/projectdetails/:label" Component={ProjectDetails} />
        <Route path="/nirmala/assigneedetails/:label" Component={AssigneeDetails}/>
      </Routes>
    </div>
  );
}

export default App
