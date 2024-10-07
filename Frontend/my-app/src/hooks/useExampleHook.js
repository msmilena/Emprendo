import { useState, useEffect } from "react";

const useExampleHook = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Lógica para obtener datos
  }, []);

  return data;
};

export default useExampleHook;
