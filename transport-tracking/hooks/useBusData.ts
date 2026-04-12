import { useEffect, useState } from "react";
import { getBuses } from "@/services/api";

export function useBusData() {
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    getBuses().then((res) => setBuses(res.data));
  }, []);

  return buses;
}
