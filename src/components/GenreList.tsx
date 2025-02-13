"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
const TMDB_API_TOKEN = process.env.TMDB_API_TOKEN;

interface Genre {
  id: number;
  name: string;
}

const GenreList = () => {
  const { push } = useRouter();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchGenres = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${TMDB_BASE_URL}/genre/movie/list?language=en`,
        {
          headers: { Authorization: `Bearer ${TMDB_API_TOKEN}` },
        }
      );
      setGenres(response.data.genres);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setErrorMessage("Failed to load genres");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  return (
    <div className="p-5">
      {isLoading && <p>Loading genres...</p>}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <div className="flex flex-wrap gap-3 text-foreground">
        {genres.map((genre) => (
          <button
            key={genre.id}
            className="flex items-center gap-2 px-2 rounded-lg hover:bg-primary/80 transition text-foreground border border-gray-500"
            onClick={() => push(`/genres?genreIds=${genre.id}`)} 
          >
            <span className="text-sm">{genre.name}</span>
            <ChevronRight className="h-4 w-4"/>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GenreList;

