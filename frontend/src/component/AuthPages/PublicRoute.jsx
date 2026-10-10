import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
// import { AuthContext } from "../../context/authContext";

export default function PublicRoute() {
  const { token } = useContext(AuthContext);
  return token ? <Navigate to="/" replace /> : <Outlet />;
}