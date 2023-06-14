import {Routes, Route} from 'react-router-dom'
import LandingPage from './pages/LandingPage';
import NavbarComponents from './components/NavbarComponents';
// import AssigneeDetails from './pages/AssigneeDetails';
// import ProjectDetails from './pages/ProjectDetails';
function App() {
  return (
    <div>
      <NavbarComponents />
      <Routes>
        <Route path="/" Component={LandingPage} />
      </Routes>
    </div>
  );
}

export default App
