import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosConfig";
import "./UserAddClues.css";
import { API_ENDPOINTS } from "../../constants/gameConstants";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../hooks/useAuth";

const UserAddClues = () => {
  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("");
  const [category, setCategory] = useState("");
  const [clueText, setClueText] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const { isLoggedIn, logout } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  const navToIntro = () => {
    navigate("/");
  };

  useEffect(() => {
    if (isLoggedIn) {
      // Fetch clue categories from the backend
      axiosInstance
        .get(API_ENDPOINTS.CLUE_CATEGORY)
        .then((response) => {
          const categoriesWithIds = response.data.map((name, index) => ({
            id: index + 1,
            name: name,
          }));
          setCategories(categoriesWithIds);
        })
        .catch((error) => {
          console.error("Error fetching categories:", error);
        });

      // Fetch countries from the backend
      axiosInstance
        .get(API_ENDPOINTS.COUNTRY)
        .then((response) => {
          const countriesWithIds = response.data.map((name, index) => ({
            id: index + 1,
            name: name,
          }));
          setCountries(countriesWithIds);
        })
        .catch((error) => {
          console.error("Error fetching countries:", error);
        });
    }
  }, [isLoggedIn]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    axiosInstance
      .post(API_ENDPOINTS.SUBMIT_CLUE, {
        country,
        category,
        text: clueText,
      })
      .then(() => {
        setSuccess("Clue submitted successfully!");
        setCountry("");
        setCategory("");
        setClueText("");
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          if (typeof error.response.data === "string") {
            setError(error.response.data);
          } else if (typeof error.response.data === "object") {
            const errorMessages = Object.values(error.response.data).flat();
            setError(errorMessages.join(" "));
          }
        } else {
          setError("Error submitting clue. Please try again.");
        }
        console.error("Error submitting clue:", error);
      });
  };

  if (!isLoggedIn) {
    return null; // or a loading spinner
  }

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} logout={logout} />
      <div className="user-add-clues-container">
        <h1>Submit a New Clue</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="country">Country:</label>
            <select
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            >
              <option value="">Select a country</option>
              {countries.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="category">Category:</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="clueText">Clue:</label>
            <textarea
              id="clueText"
              value={clueText}
              onChange={(e) => setClueText(e.target.value)}
              required
            ></textarea>
            <p>{clueText.length} characters</p>
          </div>
          <button type="submit">Submit Clue</button>
        </form>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <button type="button" onClick={navToIntro}>
          Back
        </button>
      </div>
    </>
  );
};

export default UserAddClues;
