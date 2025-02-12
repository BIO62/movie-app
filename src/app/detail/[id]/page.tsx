"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { Play, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
const TMDB_API_TOKEN = process.env.TMDB_API_TOKEN;

interface Genre {
  id: number;
  name: string;
}

interface Movie {
  poster_path: string;
  title: string;
  vote_average: number;
  overview: string;
  backdrop_path: string;
  release_date: string;
  genres: Genre[];
  runtime: number;
}

const MovieDetailPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [director, setDirector] = useState("Unknown");
  const [writers, setWriters] = useState("Unknown");
  const [stars, setStars] = useState("Unknown");
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(
          `${TMDB_BASE_URL}/movie/${id}?language=en-US`,
          {
            headers: {
              Authorization: `Bearer ${TMDB_API_TOKEN}`,
            },
          }
        );
        setMovie(response.data);
        fetchMovieCredits(); 
        fetchTrailer(); 
      } catch (error) {
        setError("Failed to load movie details.");
        console.error("Error fetching movie details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchMovieCredits = async () => {
      try {
        const response = await axios.get(
          `${TMDB_BASE_URL}/movie/${id}/credits`,
          {
            headers: {
              Authorization: `Bearer ${TMDB_API_TOKEN}`,
            },
          }
        );

        const crew = response.data.crew;
        const cast = response.data.cast;

        const directorData: { name: string } | undefined = crew.find((person: { job: string }) => person.job === "Director");
        setDirector(directorData ? directorData.name : "Unknown");

        const writerNames: string[] = crew
          .filter(
            (person: { job: string }) => person.job === "Writer" || person.job === "Screenplay"
          )
          .map((writer: { name: string }) => writer.name);
        setWriters(writerNames.length > 0 ? writerNames.join(", ") : "Unknown");

        const topStars: string = cast
          .slice(0, 2)
          .map((actor: { name: string }) => actor.name)
          .join(", ");
        setStars(topStars.length > 0 ? topStars : "Unknown");
      } catch (error) {
        console.error("Error fetching movie credits:", error);
      }
    };

    const fetchTrailer = async () => {
      try {
        const response = await axios.get(
          `${TMDB_BASE_URL}/movie/${id}/videos?language=en-US`,
          {
            headers: { Authorization: `Bearer ${TMDB_API_TOKEN}` },
          }
        );

        interface Video {
          type: string;
          site: string;
          key: string;
        }

        const trailer = response.data.results.find(
          (video: Video) => video.type === "Trailer" && video.site === "YouTube"
        );

        if (trailer) {
          setTrailerUrl(`https://www.youtube.com/watch?v=${trailer.key}`);
        }
      } catch (error) {
        console.error("Error fetching trailer:", error);
      }
    };

    if (id) {
      fetchMovieDetails();
    }
  }, [id]);
  
  const formatRuntime = (minutes: number): string => {
    const hours: number = Math.floor(minutes / 60);
    const mins: number = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  

  if (isLoading)
    return <p className="text-center mt-10">Loading movie details...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!movie)
    return <p className="text-center mt-10 text-red-500">Movie not found.</p>;

  return (
    <div className="py-10 pt-[59px] px-4 max-w-[1150px] mx-auto">
      <div className="flex justify-between mt-8 mb-4 px-5">
        <div>
          <h1 className="text-2xl font-bold w-52 lg:w-fit lg:text-4xl">
            {movie.title}
          </h1>
          <span className="text-sm lg:text-lg">{movie.release_date}</span>
          <span className="text-sm lg:text-lg"> • {formatRuntime(movie.runtime)} </span>
        </div>
        <div className="text-gray-500 text-sm flex">
          <Star className="w-6 h-6 text-yellow-400" fill="currentColor" />
          <div className="text-black">{movie.vote_average.toFixed(1)}</div> / 10
        </div>
      </div>

      <div className="flex gap-x-8 mb-8 px-5">
        <div>
          {" "}
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
            alt={movie.title}
            width={288}
            height={428}
            className="object-cover hidden lg:block rounded"
          />
        </div>
        <div className="relative">
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            width={760}
            height={375}
            className="rounded"
          />
          <div className="absolute left-0 top-0 w-full h-full  bg-black opacity-30 rounded" />
          <div className="absolute left-6 bottom-6 z-20 flex items-center gap-2">
            <Button
              onClick={() => setIsTrailerOpen(true)}
              className="bg-white text-black p-3 rounded-full shadow"
            >
              <Play className="w-5 h-5" />
            </Button>
            <a className="text-white">Play Trailer</a>
          </div>
        </div>
      </div>

      <div className="flex gap-x-[34px] px-5 pt-8">
        <div className="flex-shrink-0 lg:hidden">
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
            width={100}
            height={148}
            alt={movie.title}
            className="object-cover block lg:hidden rounded"
          />
        </div>

        <div>
          <div className="text-gray-500 flex flex-wrap gap-3">
            {movie.genres.length > 0 ? (
              movie.genres.map((genre) => (
                <span key={genre.id} className="font-medium">
                  <Badge variant="outline">{genre.name}</Badge>
                </span>
              ))
            ) : (
              <span className="font-medium">No genres available</span>
            )}
          </div>
          <p className="text-gray-700 mt-5">{movie.overview}</p>
          <div className="space-y-5 text-foreground mb-8 px-5 mt-4">
            <div className="space-y-1">
              <div className="flex pb-1">
                <div className="font-bold w-20">Director:</div>
                <div>{director}</div>
              </div>
            </div>
            <div className="shrink-0 bg-border h-[1px] w-full my-1"></div>
            <div className="space-y-1">
              <div className="flex pb-1 ">
                <div className="font-bold w-20 pr-8">Writers:</div>
                <div>{writers}</div>
              </div>
            </div>
            <div className="shrink-0 bg-border h-[1px] w-full my-1"></div>
            <div className="space-y-1">
              <div className="flex pb-1 ">
                <div className="font-bold w-20 pr-14">Stars:</div>
                <div>{stars}</div>
              </div>
            </div>
            <div className="shrink-0 bg-border h-[1px] w-full my-1"></div>
          </div>

          {isTrailerOpen && trailerUrl && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
              <div className="relative bg-black p-4 rounded-lg max-w-2xl w-full">
                <button
                  onClick={() => setIsTrailerOpen(false)}
                  className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-md"
                >
                  ✖
                </button>
                <iframe
                  className="w-full h-64 md:h-96"
                  src={trailerUrl.replace("watch?v=", "embed/")}
                  title="Movie Trailer"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
