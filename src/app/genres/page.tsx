"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react"; // Added useMemo
import axios from "axios";
import { Movie } from "@/types/movie-types";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import GenreList from "@/components/GenreList";


const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
const TMDB_API_TOKEN = process.env.TMDB_API_TOKEN;

const GenresPage = () => {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "1";


  const genreIds = useMemo(
    () => searchParams.getAll("genreIds"),
    [searchParams]
  );

  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");


  useEffect(() => {
    const fetchMovies = async () => {
      if (!genreIds.length) return; 

      try {
        setIsLoading(true);
        const response = await axios.get(
          `${TMDB_BASE_URL}/discover/movie?language=en-US&page=${page}&with_genres=${genreIds.join(
            ","
          )}`,
          {
            headers: {
              Authorization: `Bearer ${TMDB_API_TOKEN}`,
            },
          }
        );
        setMovies(response.data.results.slice(0, 20));
      } catch (error) {
        setErrorMessage("Failed to fetch movies");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [page, genreIds]); 

  return (
    <section className="page-primary pt-[59px] mx-[61px]">
      <div className="py-8 lg:pt-[52px]">
        <h2 className="mb-8 text-2xl font-semibold text-foreground lg:text-3xl">
          Search filter
        </h2>
        <div className="flex flex-col lg:flex-row space-y-8 lg:space-y-0">
          <div className="static h-fit w-full lg:sticky lg:top-[111px] lg:w-[387px]">
            <div className="space-y-5">
              <div className="text-foreground space-y-1">
                <h3 className="text-2xl font-semibold">Genres</h3>
                <p className="text-base">See lists of movies by genre</p>
              </div>
              <div className="flex flex-wrap gap-4">
                <GenreList />
              </div>
            </div>
          </div>
          <div
            data-orientation="vertical"
            role="none"
            className="shrink-0 bg-border w-[1px] hidden lg:block border h-screen mx-4"
          ></div>
          <div className="flex-1 space-y-8 lg:pr-12">
            <h4 className="text-xl text-foreground font-semibold">kino too oruulna</h4>

            {isLoading ? (
              <p className="text-foreground">Loading...</p>
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : (
              <div className="flex flex-wrap gap-5 lg:gap-x-12 lg:gap-y-8">
                {movies.map((movie) => (
                  <div
                    key={movie.id}
                    className="group w-[157.5px] overflow-hidden rounded-lg bg-secondary space-y-1 lg:w-[165px]"
                    onClick={() => push(`/detail/${movie.id}`)}
                  >
                    <div
                      className="overflow-hidden relative w-[157.5px] h-[234px] lg:w-[165px] lg:h-[244px]"
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
                            <p className="text-foreground text-sm">
                              {movie.vote_average}
                            </p>
                            <p className="text-muted-foreground text-xs">/10</p>
                          </div>
                          <p className="h-14 overflow-hidden text-ellipsis line-clamp-2 text-[20px] font-bold text-foreground">
                            {movie.original_title}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
       </div>
        </div>
      </div>
    </section>
  );
};

export default GenresPage;
