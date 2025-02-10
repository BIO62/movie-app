import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import axios from "axios";
import { Movie } from "@/types/movie-types";
import { Star, Play, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
const TMDB_API_TOKEN = process.env.TMDB_API_TOKEN;
const TMDB_API_KEY = process.env.TMDB_API_KEY;

export const ImageSlider = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [popularMovieData, setPopularMovieData] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const getMovieData = async () => {
    console.log("token", TMDB_API_TOKEN);
    
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`,
        {
          headers: { Authorization: `Bearer ${TMDB_API_TOKEN}` },
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === 9 ? 0 : prevIndex + 1));
    }, 9000); 

    return () => clearInterval(interval);
  }, [popularMovieData]);

  const currentMovie = popularMovieData[currentIndex];

  const goToNextMovie = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 9 ? 0 : prevIndex + 1));
  };

  const goToPreviousMovie = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? 9 : prevIndex - 1));
  };

  return (
    <div className="w-full h-auto flex flex-col lg:relative mt-[84px]">
      {/* Slider Container */}
      <div className="relative w-full h-[246px] lg:h-[600px] flex justify-center items-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/original/${currentMovie?.backdrop_path})`,
              backgroundSize: "cover", // 
              backgroundPosition: "center",
            }}
          ></motion.div>
        </AnimatePresence>

        <button
          onClick={goToPreviousMovie}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full text-white"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <button
          onClick={goToNextMovie}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full text-white"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Movie Information */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-6 lg:px-12 w-full max-w-4xl z-10 text-white">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <div>
              <p className="text-lg">Now Playing:</p>
              <p className="text-3xl font-semibold truncate w-56">
                {currentMovie?.original_title}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Star className="text-yellow-300 h-7 w-7" />
              <p className="text-xl font-semibold">
                {currentMovie?.vote_average}
              </p>
              <p>/10</p>
            </div>
          </div>

          <p className="text-sm mt-2">{currentMovie?.overview}</p>

          <div className="mt-4">
            <Button
              variant="outline"
              className="flex items-center gap-2 shadow-sm hover:bg-secondary/80 h-9 px-4 py-2"
            >
              <Play className="h-4 w-4" />
              Watch Trailer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
