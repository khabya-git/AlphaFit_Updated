import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useContext } from "react";

import Home from "./pages/Auth/Home";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";

import MeasurementForm from "./pages/Measurement/MeasurementForm";
import UserDashboard from "./pages/user/UserDashboard";
import PoseDetectionPage from "./pages/user/PoseDetectionPage";
import WorkoutPage from "./pages/user/WorkoutPage";

import PrivateRoute from "./routes/PrivateRoute";
import UserProvider, { UserContext } from "./context/userContext";

// Prevents authenticated users from accessing login/signup pages again
function PublicRoute({ children }) {
  const { user, loading } = useContext(UserContext);
  
  if (loading) return null; // Prevents generic flicker 
  return user ? <Navigate to="/user/dashboard" replace /> : children;
}

export default function App() {
  return (
    <UserProvider>
      <Toaster position="top-right" />

      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />

          {/* Unrestricted Route: Landing Page */}
          <Route path="/" element={<Home />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/measurement-form" element={<MeasurementForm />} />
            <Route path="/user/pose-detection" element={<PoseDetectionPage />} />
            <Route path="/user/workout" element={<WorkoutPage />} />
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
}
