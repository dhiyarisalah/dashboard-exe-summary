import { Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import ProjectDetails from './ProjectDetails';
import AssigneeDetails from './AssigneeDetails';

function App() {
  return (
    <div>
      <NavbarComponents />
      <Routes>
        <Route path="/nirmala/" element={<LandingPage />} />
        <Route path="/nirmala/projectdetails/:label" element={<ProjectDetails />} />
        <Route path="/nirmala/assigneedetails/:label" element={<AssigneeDetails />} />
      </Routes>
    </div>
  );
}


export default App
