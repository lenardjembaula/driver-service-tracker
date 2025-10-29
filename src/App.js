import { BrowserRouter } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import { NavBar } from './components/layout/NavBar';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import AddDriver from './components/driver/AddDriver';
import CreateService from './components/driver-service/CreateService';
import UpdateDriver from './components/driver/UpdateDriver';
import DriverIndex from './components/driver/Index';
import { Footer } from './components/layout/Footer';
import './components/layout/layout.css';
import ServiceIndex from './components/driver-service/Index';
import UpdateService from './components/driver-service/UpdateService';
import AddDepartment from './components/department/AddDepartment';
import DepartmentIndex from './components/department/Index';
import EditDepartment from './components/department/EditDepartment';
import AddNewService from './components/driver-service/AddNewService';

function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
        <NavBar />
        <main className="">
          <Routes>
            {/* Home Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />

            {/* Dashboard Folder Pages */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Not Found Page */}
            <Route path="*" element={<NotFound />} />

            {/* Driver Folder Pages */}
            <Route path="/driver/index" element={<DriverIndex />} />
            <Route path="/driver/adddriver" element={<AddDriver />} />
            <Route path="/driver/updatedriver/:id" element={<UpdateDriver />} />

            {/* Driver Service Folder Pages */}
            <Route path="/driver-service/index" element={<ServiceIndex />} />
            <Route path="/driver-service/create" element={<CreateService />} />
            <Route path="/driver-service/update/:id" element={<UpdateService />} />

            {/* Department Folder Pages */}
            <Route path="/department/create" element={<AddDepartment />} />
            <Route path="/department/index" element={<DepartmentIndex />} />
            <Route path="/department/update/:id" element={<EditDepartment />} />

            {/* Global Create Page ng Service */}
            <Route path="/driver-service/add-new-service-global" element={<AddNewService />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
