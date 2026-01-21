import './App.css';
import { useEffect, useState } from 'react';
import {Routes, Route ,useNavigate } from 'react-router-dom';
import PublicRoute from './components/PublicRoute.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import BootstrapAuth from './components/BootstrapAuth.jsx';
import SplashScreen from './components/SplashScreen.jsx';
import { setNavigate } from './navigation/NavigationService.js';
import { TenantRegister } from './pages/TenantRegister.jsx';

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
                        <Route path="TenantRegister" element={<TenantRegister />} />
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
