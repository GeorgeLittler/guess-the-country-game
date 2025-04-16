import { useState } from "react";
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { login, logout, isLoggedIn } = useAuth();

  const navToLogin = () => {
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    console.log("Submitting registration form with:", username, password);
    setIsSubmitting(true);
    setError("");

    try {
      const response = await axiosInstance.post(API_ENDPOINTS.REGISTER, {
        username,
        password,
        confirm_password: confirmPassword,
      });

      console.log("Successfully registered");
      login(response.data.token); // Automatically log the user in
      navigate("/");

    } catch (error) {
      console.log("⚠️ Catch block triggered");

      if (error.response) {
        if (error.response.status === 429) {
          setError("Too many registration attempts. Please try again later.");
        } else if (error.response.data) {
          const data = error.response.data;
          const messages = [];

          try {
            for (const key in data) {
              if (Array.isArray(data[key])) {
                data[key].forEach((msg) => messages.push(`${msg}`));
              } else if (typeof data[key] === "string") {
                messages.push(data[key]);
              } else {
                messages.push(`${key}: ${JSON.stringify(data[key])}`);
              }
            }
          } catch (err) {
            console.error("Error processing error response:", err);
            messages.push("Something went wrong while processing the error.");
          }

          if (messages.length > 0) {
            setError(messages.join(" "));
          } else {
            setError("Unsuccessful registration. Please try again.");
          }

          console.log("Registration error details:", data);
        } else {
          setError("Unsuccessful registration. Please try again.");
        }
      } else if (error.request) {
        setError("No response received from the server. Please try again later.");
      } else {
        setError("An error occurred. Please try again.");
      }

      console.error("Registration error:", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} logout={logout} />
      <form onSubmit={handleSubmit} className="register-form" autoComplete="off">
        <input
          autoFocus
          autoComplete="new-username"
          className="register-input"
          id="register-username"
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
          required
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          autoComplete="new-password"
          className="register-input"
          id="register-confirm-password"
          required
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {error && (
          <div style={{ color: 'red', marginTop: '10px', border: '1px solid red', padding: '8px' }}>
            {error}
          </div>
        )}
        <button type="submit" disabled={isSubmitting} className="register-btn">
          Register
        </button>
      </form>
      <button onClick={navToLogin} className="nav-login-btn">
        Already have an account?
      </button>
    </>
  );
};

export default Register;
