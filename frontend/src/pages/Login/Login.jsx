import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosConfig";
import { API_ENDPOINTS } from "../../constants/gameConstants";
import Navbar from "../../components/Navbar";
import { useAuth } from '../../hooks/useAuth';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { isLoggedIn, login, logout } = useAuth();

  const navToRegister = () => {
    navigate("/register");
  };

  const navToIntro = () => {
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
  
    setIsSubmitting(true);
    setError(""); // Clear any previous error messages
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.LOGIN, {
        username,
        password,
      });
      console.log("Successful login");
      login(response.data.token); // Use the login function from useAuth
      navToIntro();
    } catch (error) {
      console.log("Unsuccessful login");
      console.error(error);
      if (error.response && error.response.status === 429) {
        setError("Too many login attempts. Please try again later.");
      } else {
        setError("Invalid username or password. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    document.getElementById('login-username').value = '';
    document.getElementById('login-password').value = '';
  }, []);

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} logout={logout} />
      <form onSubmit={handleSubmit} className="login-form" autoComplete="off">
        <input
          autoFocus
          autoComplete="new-username"
          className="login-input"
          id="login-username"
          required
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          autoComplete="new-password"
          className="login-input"
          id="login-password"
          required
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <div className="login-error-message">{error}</div>}
        <button type="submit" disabled={isSubmitting} className="login-btn">
          Login
        </button>
      </form>
      <button onClick={navToRegister} className="nav-register-btn">Haven't registered an account?</button>
    </>
  );
};

export default Login;