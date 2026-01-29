import { useMemo } from "react";
import axios from "axios";

const useApi = () => {
  const api = useMemo(() => {
    return axios.create({
      baseURL:
      "https://kilario-clients-backend.vercel.app/api",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }, []);

  return api;
};

export default useApi;
