import React from "react";
import "./App.css"; // Import the updated CSS file
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AdminPage from "./pages/AdminPage";
import UserPage from "./pages/UserPage";
import NotFoundPage from "./pages/NotFoundPage"; // Optional: A 404 Page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/user" />} />{" "}
        {/* Default to UserPage */}
        <Route path="/user" element={<UserPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<NotFoundPage />} />{" "}
        {/* Catch-all for unknown routes */}
      </Routes>
    </Router>
  );
}

export default App;
