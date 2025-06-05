import { GenreForm } from "@/components/genre-form";
import { useEffect } from "react";

export default function Genres() {
  // Update page title
  useEffect(() => {
    const header = document.querySelector("main h1");
    if (header) {
      header.textContent = "Genre Management";
    }
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-transparent">
          Genre Management
        </h1>
      </div>

      <GenreForm />
    </div>
  );
}
