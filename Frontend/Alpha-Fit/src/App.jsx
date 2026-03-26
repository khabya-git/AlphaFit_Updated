import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useState } from "react";

import Home from "./pages/Auth/Home";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";

import MeasurementForm from "./pages/Measurement/MeasurementForm";
import UserDashboard from "./pages/user/UserDashboard";
import PoseDetectionPage from "./pages/user/PoseDetectionPage";
import WorkoutPage from "./pages/user/WorkoutPage";

import PrivateRoute from "./routes/PrivateRoute";
import { UserContext } from "./context/userContext";

export default function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const updateUser = (userData) => {
    setUser(userData);

    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      <Toaster position="top-right" />

      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/measurement-form" element={<MeasurementForm />} />
            <Route path="/user/pose-detection" element={<PoseDetectionPage />} />
            <Route path="/user/workout" element={<WorkoutPage />} />
          </Route>
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import { Toaster } from "react-hot-toast";
// import { useState } from "react";
// import Home from "./pages/Auth/Home";
// import Login from "./pages/Auth/Login";
// import SignUp from "./pages/Auth/SignUp";
// import MeasurementForm from "./pages/Measurement/MeasurementForm";
// import UserDashboard from "./pages/user/UserDashboard";
// import PoseDetectionPage from "./pages/user/PoseDetectionPage"; // ✅ new import
// import WorkoutPage from "./pages/user/WorkoutPage"; // ✅ new import
// import { UserContext } from "./context/userContext";

// export default function App() {
//   const [user, setUser] = useState(() => {
//     // ✅ Check if user is already logged in (token exists)
//     const storedUser = localStorage.getItem("user");
//     return storedUser ? JSON.parse(storedUser) : null;
//   });

//   const updateUser = (userData) => {
//     setUser(userData);
//     if (userData) {
//       localStorage.setItem("user", JSON.stringify(userData)); // ✅ persist login
//     } else {
//       localStorage.removeItem("user");
//       localStorage.removeItem("token"); // also clear token if logging out
//     }
//   };

//   return (
//     <UserContext.Provider value={{ user, updateUser }}>
//       <Toaster position="top-right" reverseOrder={false} />

//       <Router>
//         <Routes>
//           {/* Public routes */}
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<SignUp />} />

//           {/* Protected routes */}
//           <Route
//             path="/user/measurement-form"
//             element={user ? <MeasurementForm /> : <Navigate to="/login" />}
//           />
//           <Route
//             path="/user/dashboard"
//             element={user ? <UserDashboard /> : <Navigate to="/login" />}
//           />

//           {/* ✅ New: Pose Detection page */}
//           <Route
//             path="/user/pose-detection"
//             element={user ? <PoseDetectionPage /> : <Navigate to="/login" />}
//           />
//           <Route
//             path="/user/workout"
//             element={user ? <WorkoutPage /> : <Navigate to="/login" />}
//           />
//         </Routes>
//       </Router>
//     </UserContext.Provider>
//   );
// }

// function RootRedirect() {
//   const { user, loading } = useContext(UserContext);

//   // Avoid rendering Navigate until loading is resolved
//   const element = useMemo(() => {
//     if (loading) return <div>Loading...</div>;
//     // Use replace to avoid history growth and repeated push warnings
//     if (!user) return <Navigate to="/home" replace />; //if->else if
//     return <Navigate to="/user/dashboard" replace />;
//   }, [loading, user]);

//   return element;
// }


// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import { Toaster } from "react-hot-toast";
// import { useState } from "react";
// import Home from "./pages/Auth/Home";
// import Login from "./pages/Auth/Login";
// import SignUp from "./pages/Auth/SignUp";
// import MeasurementForm from "./pages/Measurement/MeasurementForm";
// import UserDashboard from "./pages/user/UserDashboard";
// import { UserContext } from "./context/userContext";

// export default function App() {
//   const [user, setUser] = useState(null);

//   const updateUser = (userData) => {
//     setUser(userData);
//   };

//   return (
//     <UserContext.Provider value={{ user, updateUser }}>
//       <Toaster position="top-right" reverseOrder={false} />

//       <Router>
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<SignUp />} />

//           {/* Protected routes */}
//           <Route
//             path="/user/measurement-form"
//             element={user ? <MeasurementForm /> : <Navigate to="/login" />}
//           />
//           <Route
//             path="/user/dashboard"
//             element={user ? <UserDashboard /> : <Navigate to="/login" />}
//           />
//         </Routes>
//       </Router>
//     </UserContext.Provider>
//   );
// }




// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { Toaster } from "react-hot-toast";
// import Home from "./pages/Auth/Home";
// import Login from "./pages/Auth/Login";
// import SignUp from "./pages/Auth/SignUp";
// import MeasurementForm from "./pages/Measurement/MeasurementForm"; // create this

// export default function App() {
//   return (
//     <>
//       {/* Toast container */}
//       <Toaster position="top-right" reverseOrder={false} />

//       <Router>
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<SignUp />} />
//           <Route path="/user/measurement-form" element={<MeasurementForm />} />
//         </Routes>
//       </Router>
//     </>
//   );
// }

// import React, { useContext ,useMemo} from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";

// // Auth pages
// import Home from "./pages/HomePage/Home";
// import SignUp from "./pages/Auth/SignUp";
// import Login from "./pages/Auth/Login";

// // User feature pages
// import UserDashboard from "./pages/user/UserDashboard";
// import MeasurementForm from "./pages/Measurement/MeasurementForm";
// // import CurrentProgress from "./pages/user/CurrentProgress";
// // import Gamification from "./pages/user/Gamification";
// // import PoseDetection from "./pages/user/Posedetection";
// // import FoodCalorieMeter from "./pages/user/Foodcaloriemeter";

// // Routing and context
// import PrivateRoute from "./routes/PrivateRoute";
// import UserProvider, { UserContext } from "./context/userContext";

// // UI
// import { Toaster } from "react-hot-toast";

// const App = () => {
//   return (
//     <UserProvider>
//       <Router>
//         <Routes>
//           {/* Root route with auth-based redirect */}
//           <Route path="/" element={<RootRedirect />} />

//           {/* Public routes */}
//           <Route path="/home" element={<Home />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<SignUp />} />

//           {/* Private user area */}
//           <Route element={<PrivateRoute allowedRoles={["user"]} />}>
//             <Route path="/user/measurement-form" element={<MeasurementForm />} />   //changed from /MeasurementForm to /measurement-form
//             <Route path="/user/dashboard" element={<UserDashboard />} />
//             {/* <Route path="/user/gamification" element={<Gamification />} />
//             <Route path="/user/current-progress" element={<CurrentProgress />}/>
//             <Route path="/user/pose-detection" element={<PoseDetection />} />
//             <Route path="/user/food-calorie-meter" element={<FoodCalorieMeter />}/> */}
//           </Route>

//           {/* Fallback route */}
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </Router>

//       <Toaster
//         toastOptions={{
//           className: "",
//           style: { fontSize: "13px" },
//         }}
//       />
//     </UserProvider>
//   );
// };

// export default App;

// // Root redirect based on auth state
// function RootRedirect() {
//   const { user, loading } = useContext(UserContext);
//   if (loading) return <div>Loading...</div>; // Optional: spinner component
//   if (!user) return <Navigate to="/home" />;
//   return <Navigate to="/user/dashboard" />;
// }

// 6-9-25 11:39 PM update
// Root redirect based on auth state
// function RootRedirect() {
//   const { user, loading } = useContext(UserContext);

//   // Avoid rendering Navigate until loading is resolved
//   const element = useMemo(() => {
//     if (loading) return <div>Loading...</div>;
//     // Use replace to avoid history growth and repeated push warnings
//     if (!user) return <Navigate to="/home" replace />; //if->else if
//     return <Navigate to="/user/dashboard" replace />;
//   }, [loading, user]);

//   return element;
// }

// import React, { useContext } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";

// // Auth pages
// import Home from "./pages/HomePage/Home";
// import SignUp from "./pages/Auth/SignUp";
// import Login from "./pages/Auth/Login";

// // User feature pages
// import UserDashboard from "./pages/user/UserDashboard";
// import MeasurementForm from "./pages/Measurement/MeasurementForm";
// // import CurrentProgress from "./pages/user/CurrentProgress";
// // import Gamification from "./pages/user/Gamification";
// // import PoseDetection from "./pages/user/Posedetection";
// // import FoodCalorieMeter from "./pages/user/Foodcaloriemeter";

// // // Routing and context
// import PrivateRoute from "./routes/PrivateRoute";
// import UserProvider, { UserContext } from "./context/userContext";

// // UI
// import { Toaster } from "react-hot-toast";
// import { FaRegFilePowerpoint } from "react-icons/fa6";

// const App = () => {
//   return (
//     <UserProvider>
//       <Router>
//         <Routes>
//           {/* Public */}
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<SignUp />} />
//           {/* Private user area */}
//           <Route element={<PrivateRoute allowedRoles={["user"]} />}>
//             <Route path="/user/MeasurementForm" element={<MeasurementForm />} />
//             <Route path="/user/dashboard" element={<UserDashboard />} />
//             {/* <Route path="/user/gamification" element={<Gamification />} />
//             <Route path="/user/current-progress" element={<CurrentProgress />}/>
//             <Route path="/user/pose-detection" element={<PoseDetection />} />
//             <Route path="/user/food-calorie-meter" element={<FoodCalorieMeter />}/> */}
//           </Route>

//           {/* Root + fallback */}
//           <Route path="/" element={<RootRedirect />} />
//           {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
//         </Routes>
//       </Router>

//       <Toaster
//         toastOptions={{
//           className: "",
//           style: { fontSize: "13px" },
//         }}
//       />
//     </UserProvider>
//   );
// };

// export default App;

// // Root redirect based on auth state
// function RootRedirect() {
//   const { user, loading } = useContext(UserContext);
//   if (loading) return <div />; // Optional: spinner component
//   if (!user) return <Navigate to="/login" />;
//   // if (!user) return <Home />;
//   return <Navigate to="/user/dashboard" />;
// }

// another code reference

// src/App.jsx
// import React, { useContext } from 'react'
// import { BrowserRouter as Router, Routes,Route, Navigate } from 'react-router-dom'

// Context
// import UserProvider, { UserContext } from './context/userContext'

// Guards
// import PrivateRoute from './routes/PrivateRoute.jsx'

// Layouts
// import PublicLayout from './layout/PublicLayout.jsx'
// import DashboardLayout from './layout/DashboardLayout.jsx'

// Public pages
// import Home from './pages/HomePage/Home'
// import Login from './pages/Auth/Login'
// import SignUp from './pages/Auth/SignUp'

// Post-signup flow
// import MeasurementPage from './pages/Measurement/MeasurementPage.jsx'

// User feature pages
// import UserDashboard from './pages/user/UserDashboard'
// import FitnessProfile from './pages/FitnessProfile'

// Optionally add later
// import CurrentProgress from './pages/user/CurrentProgress'
// import Gamification from './pages/user/Gamification'
// import PoseDetection from './pages/user/Posedetection'
// import FoodCalorieMeter from './pages/user/Foodcaloriemeter'

// UI
// import { Toaster } from 'react-hot-toast'

// export default function App() {
//   return (
//     <UserProvider>
//       <AppRoutes />
//       <Toaster toastOptions={{ className: '', style: { fontSize: '13px' } }} />
//     </UserProvider>
//   )
// }

// function AppRoutes() {
//   return (
//     <Routes>
//       {/* Public area */}
//       <Route element={<PublicLayout />}>
//         {/* Root decides based on auth whether to show Home or route to dashboard */}
//         <Route path="/" element={<RootDecider />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<SignUp />} />
//       </Route>

//       {/* Protected area (role: user) */}
//       <Route element={<PrivateRoute allowedRoles={['user']} />}>
//         {/* Measurement after signup, then dashboard */}
//         <Route element={<DashboardLayout />}>
//           <Route path="/measurement" element={<MeasurementPage />} />

//           {/* Dashboard and nested user features */}
//           <Route path="/user/userdashboard" element={<UserDashboard />} />
//           <Route path="/user/fitness-profile" element={<FitnessProfile />} />
//           {/* <Route path="/user/current-progress" element={<CurrentProgress />} /> */}
//           {/* <Route path="/user/gamification" element={<Gamification />} /> */}
//           {/* <Route path="/user/pose-detection" element={<PoseDetection />} /> */}
//           {/* <Route path="/user/food-calorie-meter" element={<FoodCalorieMeter />} /> */}
//         </Route>
//       </Route>

//       {/* Fallback */}
//       <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>
//   )
// }

// // Root redirect/decider based on auth state
// function RootDecider() {
//   const { user, loading } = useContext(UserContext)
//   if (loading) return <div /> // could render a spinner
//   if (!user) return <Home />
//   return <Navigate to="/user/userdashboard" replace />
// }

// another code reference
// src/App.jsx
// import React from 'react'
// import { Routes, Route, Navigate } from 'react-router-dom'
// import ProtectedRoute from './routes/ProtectedRoute.jsx'
// import PublicLayout from './layout/PublicLayout.jsx'
// import DashboardLayout from './layout/DashboardLayout.jsx'

// // Pages
// import HomePage from './pages/Home/HomePage.jsx'
// import LoginPage from './pages/Auth/LoginPage.jsx'
// import SignupPage from './pages/Auth/SignupPage.jsx'
// import MeasurementPage from './pages/Measurement/MeasurementPage.jsx'
// import UserDashboardPage from './pages/Dashboard/UserDashboardPage.jsx'
// import ProfilePage from './pages/Profile/ProfilePage.jsx'
// import ProgressPage from './pages/Progress/ProgressPage.jsx'
// import FoodTrackerPage from './pages/FoodTracker/FoodTrackerPage.jsx'
// import GamificationPage from './pages/Gamification/GamificationPage.jsx'
// import WorkoutPage from './pages/Workout/WorkoutPage.jsx'
// import PoseDetectionPage from './pages/PoseDetection/PoseDetectionPage.jsx'

// export default function App() {
//   return (
//     <Routes>
//       {/* Public area */}
//       <Route element={<PublicLayout />}>
//         <Route path="/" element={<HomePage />} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/signup" element={<SignupPage />} />
//       </Route>

//       {/* Auth-required area */}
//       <Route element={<ProtectedRoute />}>
//         {/* Post-signup flow: measurement, then dashboard */}
//         <Route path="/measurement" element={<DashboardLayout />}>
//           <Route index element={<MeasurementPage />} />
//         </Route>

//         <Route path="/dashboard" element={<DashboardLayout />}>
//           <Route index element={<UserDashboardPage />} />
//           <Route path="profile" element={<ProfilePage />} />
//           <Route path="progress" element={<ProgressPage />} />
//           <Route path="food" element={<FoodTrackerPage />} />
//           <Route path="gamification" element={<GamificationPage />} />
//           <Route path="workout" element={<WorkoutPage />} />
//           <Route path="pose" element={<PoseDetectionPage />} />
//         </Route>
//       </Route>

//       {/* Fallback */}
//       <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>
//   )
// }
