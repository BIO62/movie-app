"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Movie } from "@/types/movie-types";
import Image from "next/image";
import { Star } from "lucide-react";

const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
const TMDB_API_TOKEN = process.env.TMDB_API_TOKEN;

const MovieDetailPage = () => {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [movieDetail, setMovieDetail] = useState<Movie | null>(null);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [credits, setCredits] = useState<any>(null);

  const getMovieData = async () => {
    if (!params.id) return;

    try {
      setIsLoading(true);

      const movieResponse = await axios.get(
        `${TMDB_BASE_URL}/movie/${params.id}?language=en-US`,
        {
          headers: {
            Authorization: `Bearer ${TMDB_API_TOKEN}`,
          },
        }
      );
      const creditsResponse = await axios.get(
        `${TMDB_BASE_URL}/movie/${params.id}/credits?language=en-US`,
        {
          headers: {
            Authorization: `Bearer ${TMDB_API_TOKEN}`,
          },
        }
      );
      const videosResponse = await axios.get(
        `${TMDB_BASE_URL}/movie/${params.id}/videos?language=en-US`,
        {
          headers: {
            Authorization: `Bearer ${TMDB_API_TOKEN}`,
          },
        }
      );
      const trailer = videosResponse.data.results.find(
        (video: any) => video.type === "Trailer" && video.site === "YouTube"
      );

      setMovieDetail(movieResponse.data);
      setTrailerKey(trailer ? trailer.key : null);
      

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      if (axios.isAxiosError(err)) {
        setErrorMessage(err.response?.data.status_message || "Unknown error");
      }
      console.error(err);
    
  };

  useEffect(() => {
    getMovieData();
  }, [params.id]);

  return (
    <div className="page-detail text-foreground mt-20">
      {isLoading && <p>Loading...</p>}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {movieDetail && (
        <>
          <div className="mt-8 mb-4 px-5 flex justify-between lg:mt-[52px] lg:mb-6 lg:px-0">
            <div className="space-y-1">
              <h1 className="break-words text-2xl font-bold w-52 lg:w-fit lg:text-4xl">
                {movieDetail.title}
              </h1>
              <p className="text-sm lg:text-lg">{movieDetail.release_date}</p>
            </div>
            <div className="text-xs">
              <h5 className="hidden lg:block">Rating</h5>
              <div className="flex items-center py-[2px] gap-x-1">
                <Star className="h-7 w-7 text-yellow-300 fill-current" />
                <div>
                  <div className="flex items-center gap-x-1">
                    <div className="font-medium">
                      <span className="text-foreground text-sm">
                        {movieDetail.vote_average}
                      </span>
                      <span className="text-muted-foreground text-xs">/10</span>
                    </div>
                  </div>
                  <span className="text-muted-foreground">
                    {movieDetail.vote_count}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-x-8 mb-8">
            <div className="relative">
              {trailerKey ? (
                <iframe
                  className="relative overflow-hidden w-[375px] lg:w-[760px] h-[211px] lg:h-[428px] lg:rounded"
                  src={`https://www.youtube.com/embed/${trailerKey}`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <p className="text-gray-500">No trailer available</p>
              )}
            </div>
          </div>
          <div className="px-5 lg:px-0">
            <div className="flex gap-x-[34px] lg:block">
              <div>
                <Image
                  className="relative overflow-hidden block rounded shrink-0 lg:hidden"
                  src={`https://image.tmdb.org/t/p/w500/${movieDetail.poster_path}`}
                  alt="movie poster path"
                  width={100}
                  height={148}
                />
              </div>
              <div className="space-y-5 mb-5">
                <div className="flex flex-wrap gap-3">
                  {/* genre orj irne */}
                </div>

                <p className="text-base">{movieDetail.overview}</p>
              </div>
            </div>
            <div className="space-y-5 text-foreground mb-8">
              <div className="space-y-1 ">
                <div className="flex pb-1">{movieDetail.popularity}</div>
                <h4 className="font-bold w-16 mr-13">Director</h4>
              </div>
              <div></div>
              <div></div>
            </div>
            <div></div>
          </div>
        </>
      )}
    </div>
  );
};

export default MovieDetailPage;
