"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Movie } from "@/types/movie-types";
import { Star, ChevronRight } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
const TMDB_API_TOKEN = process.env.TMDB_API_TOKEN;

const MoreLikeThis = () => {
  const { push } = useRouter();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [popularMovieData, setPopularMovieData] = useState<Movie[]>([]);

  const getMovieData = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${TMDB_BASE_URL}/movie/${id}/similar?language=en-US&page=1`,
        {
          headers: {
            Authorization: `Bearer ${TMDB_API_TOKEN}`,
          },
        }
      );
      setPopularMovieData(response.data.results.slice(0, 5));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setErrorMessage(err.response?.data.status_message || "Unknown error");
      }
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getMovieData();
  }, [id]);

  return (
    <div className="flex items-center justify-center">
      <div className="space-y-8 w-full max-w-screen-xl px-5 lg:px-0">
        <div className="flex items-center justify-between">
          <h3 className="text-foreground text-2xl font-semibold">More like this</h3>
          <p
            onClick={() => push(`/src/components/GenreList.tsx`)}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary underline-offset-4 hover:underline h-9 px-4 py-2"
          >
            See more
            <ChevronRight className="h-6 w-6" />
          </p>
        </div>

        <div className="flex flex-wrap gap-5 lg:gap-8 justify-center">
          {isLoading ? (
            <p className="text-foreground">Loading...</p>
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            popularMovieData.map((movie) => (
              <div
                key={movie.id}
                className="group w-[157.5px] overflow-hidden rounded-lg bg-secondary space-y-1 lg:w-[190px]"
                onClick={() => push(`/detail/${movie.id}`)}
              >
                <div
                  className="overflow-hidden relative w-[157.5px] h-[234px] lg:w-[190px] lg:h-[281px]"
                  style={{
                    backgroundImage: `url(https://image.tmdb.org/t/p/original/${movie.poster_path})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
                <div className="p-2">
                  <div className="flex flex-row w-auto h-auto justify-between lg:flex-col lg:gap-[8px]">
                    <div>
                      <div className="flex items-center gap-x-1 font-bold">
                        <Star className="text-yellow-300 fill-current h-4 w-4" />
                        <p className="text-foreground text-sm">{movie.vote_average}</p>
                        <p className="text-muted-foreground text-xs">/10</p>
                      </div>
                      <p className="h-14 overflow-hidden text-ellipsis line-clamp-2 text-[20px] font-bold text-foreground">
                        {movie.original_title}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MoreLikeThis;
