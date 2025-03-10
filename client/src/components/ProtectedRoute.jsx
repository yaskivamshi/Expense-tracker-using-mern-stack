import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { username } = useContext(AuthContext);
  return username ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
