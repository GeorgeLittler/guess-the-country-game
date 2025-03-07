import axiosInstance from "../axiosConfig";
import { API_ENDPOINTS } from "../constants/gameConstants";

export const fetchRandomCountry = async () => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.RANDOM_COUNTRY);
    return response.data;
  } catch (error) {
    console.error("Error fetching random country:", error);
    throw error;
  }
};

export const fetchClue = async (countryId, category) => {
  try {
    const response = await axiosInstance.get(
      API_ENDPOINTS.GET_CLUE(countryId),
      {
        params: { category },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching clue for country ${countryId}:`, error);
    throw error;
  }
};
