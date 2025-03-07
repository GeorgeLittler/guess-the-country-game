import { useAuth } from "./useAuth";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const logoutAndNavigate = () => {
    logout();
    navigate("/");
  };

  return logoutAndNavigate;
};
