"use client";
import { useEffect } from "react";

export default function MapView() {
  useEffect(() => {
    console.log("Map initialized");
  }, []);

  return (
    <div className="h-[400px] bg-gray-300 mt-4 flex items-center justify-center">
      Map will render here
    </div>
  );
}
