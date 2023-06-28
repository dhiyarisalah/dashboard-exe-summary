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
        <Route path="/" Component={LandingPage} />
        <Route path="/projectdetails" Component={ProjectDetails} />
        <Route path="/assigneedetails/:label" Component={AssigneeDetails}/>
      </Routes>
    </div>
  );
}

export default App
