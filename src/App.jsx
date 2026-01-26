import './App.css';
import { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import PublicRoute from './components/PublicRoute.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import { setNavigate } from './navigation/NavigationService.js';
import { TenantRegister } from './pages/TenantRegister.jsx';
import TenantGuard from "./components/TenantGuard";

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
            {/* ---------- TENANT REGISTRATION (NO TENANT REQUIRED) ---------- */}
            <Route path="/register" element={<TenantRegister />} />

            {/* ---------- PUBLIC ROUTES (TENANT REQUIRED) ---------- */}
            <Route path="/:tenantSlug" element={<TenantGuard />}>
                <Route element={<PublicRoute />}>
                    <Route path="login" element={<Login />} />
                    <Route path="createUser" element={<CreateUser />} />
                </Route>

                {/* ---------- PROTECTED ROUTES ---------- */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<Layout />}>
                        <Route index element={<PatientRegistration />} />
                        <Route path="patients" element={<PatientList />} />
                        <Route path="patients/:patientId" element={<PatientDetail />} />
                        <Route path="doctor-screen" element={<DoctorScreen />} />
                        <Route path="visits" element={<VisitHistory />} />
                        <Route path="settings" element={<DataTableGuide />} />
                    </Route>
                </Route>
            </Route>

            {/* ---------- FALLBACK - Redirect to registration ---------- */}
            <Route path="*" element={<TenantRegister />} />
        </Routes>
    );
};

export default App;