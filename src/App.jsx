import './App.css';
import {Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import PatientRegistration from './pages/PatientRegistration';
import DoctorScreen from './pages/Doctor';
import VisitHistory from './pages/VisitHistory';
import PatientList from './pages/PatientList';
import Login from './pages/login';
import SignUp from './pages/SignUp';
import { DataTableGuide } from './pages/Guide';
import ProtectedRoute from './components/ProtectedRoute';



const App = () => {
    return (
        
                <Routes>
                        <Route path="Login" element={<Login />} />
                        <Route path="signup" element={<SignUp />} />
                    <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<Layout />}>
                            <Route index element={<PatientRegistration />} />
                            <Route path="Patients" element={<PatientRegistration />} />
                            <Route path="DoctorScreen" element={<DoctorScreen />} />
                            <Route path="VisitHistory" element={<VisitHistory />} />
                            <Route path="PatientList" element={<PatientList />} />
                            <Route path="Guide" element={<DataTableGuide />} />
                        </Route>
                    </Route>
                </Routes>
    
    );
};

export default App;
