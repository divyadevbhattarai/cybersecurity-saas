import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ErrorBoundary from "./components/ErrorBoundary";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import IncidentList from "./pages/IncidentList";
import SecurityTraining from "./pages/SecurityTraining";

// PrivateRoute component to protect routes
const PrivateRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // Check localStorage as backup
  const token = localStorage.getItem("access_token");

  if (!isAuthenticated && !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const token = localStorage.getItem("access_token");
  const isLoggedIn = isAuthenticated || token;

  return (
    <div className="App">
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Landing />} />
          <Route path="/landing" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Landing />} />
          <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/register" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Register />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/incidents"
            element={
              <PrivateRoute>
                <IncidentList />
              </PrivateRoute>
            }
          />
          <Route
            path="/training"
            element={
              <PrivateRoute>
                <SecurityTraining />
              </PrivateRoute>
            }
          />
        </Routes>
      </ErrorBoundary>
    </div>
  );
}

export default App;
