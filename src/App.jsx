import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Appointments from './pages/Appointments';
import Calendar from './pages/Calendar';
import AddTreatment from './pages/AddTreatment';
import ViewTreatments from './pages/ViewTreatments';
import BookAppointment from './pages/BookAppointment';
import MyAppointments from './pages/MyAppointments';
import ProtectedRoute from './routes/ProtectedRoute';
import Layout from './components/Layout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* Both roles */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Admin-only routes */}
        <Route path="/patients" element={<ProtectedRoute role="Admin"><Patients /></ProtectedRoute>} />
        <Route path="/appointments" element={<ProtectedRoute role="Admin"><Appointments /></ProtectedRoute>} />
        <Route path="/calendar" element={<ProtectedRoute role="Admin"><Calendar /></ProtectedRoute>} />
        <Route path="/add-treatment" element={<ProtectedRoute role="Admin"><AddTreatment /></ProtectedRoute>} />
        <Route path="/view-treatments" element={<ProtectedRoute role="Admin"><ViewTreatments /></ProtectedRoute>} />

        {/* Patient-only routes */}
        <Route path="/book-appointment" element={<ProtectedRoute role="Patient"><BookAppointment /></ProtectedRoute>} />
        <Route path="/my-data" element={<ProtectedRoute role="Patient"><MyAppointments /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}

export default App;
