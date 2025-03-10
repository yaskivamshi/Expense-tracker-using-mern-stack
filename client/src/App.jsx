
import { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import PasswordReset from "./pages/PasswordReset";
import NotFound from "./pages/NotFound";
import { Fab, Tooltip } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { motion } from "framer-motion"; // ✅ Smooth Animations
import ProtectedRoute from "./components/ProtectedRoute";

function AppContent() {
  const { username, logout } = useContext(AuthContext);
  
  return (
    <Router>
      
      {username && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="fixed top-9 left-9 bg-blue-500 text-white px-6 py-3 rounded-xl shadow-md hover:scale-105 transform transition-all cursor-pointer"
        >
          👋 Hello, {username}!  
        </motion.div>
      )}

      
      {username && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="fixed top-7 right-5 md:top-5 md:right-10"
        >
          <Tooltip title="Logout" arrow>
            <Fab 
              variant="extended" 
              color="error" 
              onClick={logout} 
              className="shadow-md px-4 py-2 rounded-lg hover:scale-105 transform transition-all"
            >
              <LogoutIcon className="mr-1" /> Logout
            </Fab>
          </Tooltip>
        </motion.div>
      )}

      <Routes>
        
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forgot-password" element={<PasswordReset />} />
        <Route path="/reset-password/:token" element={<PasswordReset />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}





