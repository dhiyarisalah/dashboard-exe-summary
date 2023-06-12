import {Routes, Route} from 'react-router-dom'
import LandingPage from './pages/LandingPage';
import NavbarComponents from './components/NavbarComponents';
import AssigneeDetails from './pages/AssigneeDetails';
import ProjectDetails from './pages/ProjectDetails';
function App() {
  return (
    <div>
      <NavbarComponents />
      <Routes>
        <Route path="/" Component={LandingPage} />
        <Route path="/assigneedetails" Component={AssigneeDetails} />
        <Route path="/projectdetails" Component={ProjectDetails} />
      </Routes>
    </div>
  );
}

export default App
