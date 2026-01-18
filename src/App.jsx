import './App.css';
import { useEffect, useState } from 'react';
import {Routes, Route ,useNavigate } from 'react-router-dom';
import { setNavigate } from './navigation/navigationService.js';
import PublicRoute from './components/publicRoute.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import BootstrapAuth from './components/bootstrapAuth.jsx';
import SplashScreen from './components/SplashScreen.jsx';

import Layout from './components/Layout';
import SignUp from './pages/SignUp';
import Login from './pages/login';
import PatientRegistration from './pages/PatientRegistration';
import DoctorScreen from './pages/Doctor';
import VisitHistory from './pages/VisitHistory';
import PatientList from './pages/PatientList';
import PatientDetail from './pages/PatientDetail';
import { DataTableGuide } from './pages/Guide';

const App = () => {

    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        setNavigate(navigate);
    }, [navigate]);

    useEffect(() => {
    BootstrapAuth().finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <SplashScreen />;
    }

    return (
        
                <Routes>
                    <Route element={<PublicRoute />}>
                        <Route path="Login" element={<Login />} />
                        <Route path="signup" element={<SignUp />} />
                    </Route>
                    <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<Layout />}>
                            <Route index element={<PatientRegistration />} />
                            <Route path="Patients" element={<PatientRegistration />} />
                            <Route path="DoctorScreen" element={<DoctorScreen />} />
                            <Route path="VisitHistory" element={<VisitHistory />} />
                            <Route path="PatientList" element={<PatientList />} />
                            <Route path="Guide" element={<DataTableGuide />} />
                            <Route path="patient/:patientId" element={<PatientDetail />} />

                        </Route>
                    </Route>
                </Routes>
    
    );
};

export default App;
