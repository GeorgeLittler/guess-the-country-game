import { useNavigate } from "react-router-dom";

const IntroScript = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/main-content");
  };

  return { handleClick };
};

export default IntroScript;
