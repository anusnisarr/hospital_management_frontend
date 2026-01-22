import './App.css';
import { useEffect, useState } from 'react';
import {Routes, Route ,useNavigate } from 'react-router-dom';
import PublicRoute from './components/PublicRoute.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import { setNavigate } from './navigation/NavigationService.js';
import { TenantRegister } from './pages/TenantRegister.jsx';

import Layout from './components/Layout';
import CreateUser from './pages/CreateUser';
import Login from './pages/login';
import PatientRegistration from './pages/PatientRegistration';
import DoctorScreen from './pages/Doctor';
import VisitHistory from './pages/VisitHistory';
import PatientList from './pages/PatientList';
import PatientDetail from './pages/PatientDetail';
import { DataTableGuide } from './pages/Guide';

const App = () => {

    const navigate = useNavigate();

    useEffect(() => {
        setNavigate(navigate);
    }, [navigate]);

    return (
                <Routes>
                    <Route element={<PublicRoute />}>
                        <Route path="TenantRegister" element={<TenantRegister />} />
                        <Route path="Login" element={<Login />} />
                        <Route path="createUser" element={<CreateUser />} />
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
