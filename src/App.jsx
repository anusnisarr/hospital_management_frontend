import './App.css';
import { useEffect } from 'react';
import {Routes, Route ,useNavigate } from 'react-router-dom';
import { setNavigate } from './navigationService';
import ProtectedRoute from './components/ProtectedRoute';

import Layout from './components/Layout';
import SignUp from './pages/SignUp';
import Login from './pages/login';
import PatientRegistration from './pages/PatientRegistration';
import DoctorScreen from './pages/Doctor';
import VisitHistory from './pages/VisitHistory';
import PatientList from './pages/PatientList';
import { DataTableGuide } from './pages/Guide';


const App = () => {

    const navigate = useNavigate();

    useEffect(() => {
        setNavigate(navigate);
    }, [navigate]);

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
