import { useMemo } from "react";
import axios from "axios";

const useApi = () => {
  const api = useMemo(() => {
    return axios.create({
      baseURL:
      "http://localhost:3002/api",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }, []);

  return api;
};

export default useApi;
