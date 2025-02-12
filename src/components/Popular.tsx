import React, { useEffect, useState } from "react";
import axios from "axios";
import { Movie } from "@/types/movie-types";
import { Star } from "lucide-react";

const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
const TMDB_API_TOKEN = process.env.TMDB_API_TOKEN;

const Popular = () => {
  const [, setIsLoading] = useState(false);
  const [, setErrorMessage] = useState("");
  const [popularMovieData, setPopularMovieData] = useState<Movie[]>([]);

  const getMovieData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${TMDB_BASE_URL}/movie/popular?language=en-US&page=1`,
        {
          headers: {
            Authorization: `Bearer ${TMDB_API_TOKEN}`,
          },
        }
      );
      setPopularMovieData(response.data.results.slice(0, 10));
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      if (axios.isAxiosError(err)) {
        setErrorMessage(err.response?.data.status_message || "Unknown error");
      }
      console.log(err);
    }
  };

  useEffect(() => {
    getMovieData();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="space-y-8 w-full max-w-screen-xl px-5 lg:px-0">
        <div className="flex items-center justify-between">
          <h3 className="text-foreground text-2xl font-semibold">Popular</h3>
        </div>

        <div className="flex flex-wrap gap-5 lg:gap-8 justify-center">
          {popularMovieData.map((movie) => (
            <div
              key={movie.id}
              className="group w-[157.5px] overflow-hidden rounded-lg bg-secondary space-y-1 lg:w-[230px] cursor-pointer"
            >
              <div
                className="overflow-hidden relative w-[157.5px] h-[234px] lg:w-[230px] lg:h-[340px]"
                style={{
                  backgroundImage: `url(https://image.tmdb.org/t/p/original/${movie.poster_path})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>
              <div className="p-2">
                <div className="flex flex-row w-auto h-auto justify-between lg:flex-col lg:gap-[8px]">
                  <div>
                    <div className="flex items-center gap-x-1">
                      <Star className="text-yellow-300 fill-current h-4 w-4" />
                      <p className="text-foreground text-sm">
                        {movie.vote_average}
                      </p>
                      <p className="text-muted-foreground text-xs">/10</p>
                    </div>

                    <p className="h-14 overflow-hidden text-ellipsis line-clamp-2 text-lg text-foreground">
                      {movie.original_title}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Popular;
