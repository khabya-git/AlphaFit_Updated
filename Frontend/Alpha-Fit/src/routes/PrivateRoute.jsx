// import React from 'react'
// import { Outlet } from 'react-router-dom'

// const PrivateRoute = ({allowedRoles}) => {
//   return <Outlet />
// }

// export default PrivateRoute



// src/routes/PrivateRoute.jsx
// import React from 'react'
// import { Navigate, Outlet, useLocation } from 'react-router-dom'
// import { UserContext } from '../context/userContext'

// const PrivateRoute = ({ allowedRoles = [] }) => {
//   const { user, loading } = React.useContext(UserContext)
//   const location = useLocation()

//   // Avoid rendering children while auth is resolving
//   if (loading) {
//     return <div /> // or a spinner component
//   }

//   // Not authenticated -> send to login, remember where they tried to go
//   if (!user) {
//     return <Navigate to="/login" replace state={{ from: location }} />
//   }

//   // Optional role-based access control
//   if (allowedRoles.length > 0) {
//     const rolesArray = Array.isArray(user.roles) ? user.roles : [user.role].filter(Boolean)
//     const hasAccess = rolesArray.some(r => allowedRoles.includes(r))
//     if (!hasAccess) {
//       return <Navigate to="/home" replace />  //Navigate / to /home
//     }
//   }

//   // Authorized -> render nested routes
//   return <Outlet />
// }

// export default PrivateRoute


import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/userContext";

const PrivateRoute = ({ allowedRoles = [] }) => {
  const { user } = useContext(UserContext);
  const location = useLocation();

  // Not authenticated → redirect to login
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Optional role-based access control (future-proof)
  if (allowedRoles.length > 0) {
    const userRoles = Array.isArray(user.roles)
      ? user.roles
      : user.role
      ? [user.role]
      : [];

    const hasAccess = userRoles.some((role) =>
      allowedRoles.includes(role)
    );

    if (!hasAccess) {
      return <Navigate to="/" replace />;
    }
  }

  // Authorized → render nested routes
  return <Outlet />;
};

export default PrivateRoute;

