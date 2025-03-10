import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosConfig";
import { API_ENDPOINTS } from "../../constants/gameConstants";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../hooks/useAuth";
import "./Register.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const navToIntro = () => {
    navigate("/");
  };

  const navToLogin = () => {
    navigate("/login");
  };

  const validatePassword = (password) => {
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>[\]-]/.test(password);

    return hasLowerCase && hasUpperCase && hasDigit && hasSpecialChar;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "Password must contain at least one lowercase letter, one uppercase letter, one special character, and one number."
      );
      return;
    }

    try {
      const response = await axiosInstance.post(API_ENDPOINTS.REGISTER, {
        username,
        password,
        confirm_password: confirmPassword,
      });
      console.log("Successfully registered");
      login(response.data.token);
      navToIntro();
    } catch (error) {
      if (error.response) {
        if (error.response.status === 429) {
          setError("Too many registration attempts. Please try again later.");
        } else if (error.response.data) {
          if (typeof error.response.data === "object") {
            const errorMessages = Object.values(error.response.data).flat();
            setError(errorMessages.join(" "));
          } else {
            setError(error.response.data);
          }
        } else {
          setError("Unsuccessful registration. Please try again.");
        }
      } else if (error.request) {
        setError(
          "No response received from the server. Please try again later."
        );
      } else {
        setError("An error occurred. Please try again.");
      }
      console.error("Registration error:", error.message);
    }
  };

  useEffect(() => {
    document.getElementById("register-username").value = "";
    document.getElementById("register-password").value = "";
    document.getElementById("confirm-password").value = "";
  }, []);

  return (
    <>
      <Navbar isLoggedIn={false} />
      <form
        onSubmit={handleSubmit}
        className="register-form"
        autoComplete="off"
      >
        <input
          autoComplete="new-username"
          autoFocus
          className="register-input"
          id="register-username"
          minLength={5}
          maxLength={15}
          required
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          autoComplete="new-password"
          className="register-input"
          id="register-password"
          minLength={8}
          maxLength={20}
          required
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          title="Password must contain at least one lowercase letter, one uppercase letter, one special character, and one number."
        />
        <input
          autoComplete="new-password"
          className="register-input"
          id="confirm-password"
          minLength={8}
          maxLength={20}
          required
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="register-btn">
          Register
        </button>
      </form>
      <button onClick={navToLogin} className="nav-login-btn">
        Already got an account?
      </button>
    </>
  );
};

export default Register;
