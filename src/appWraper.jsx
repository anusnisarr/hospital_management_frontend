import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { setNavigate } from "./utils/navigation";
import App from "./App";

const AppWrapper = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  return <App />;
};

export default AppWrapper;
