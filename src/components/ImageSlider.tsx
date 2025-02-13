import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import axios from "axios";
import { Star, Play, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
const TMDB_API_TOKEN = process.env.TMDB_API_TOKEN;
const TMDB_API_KEY = process.env.TMDB_API_KEY;
interface Genre {
  id: number;
  name: string;
}
interface Movie {
  id: number;
  poster_path: string;
  title: string;
  original_title: string;
  vote_average: number;
  overview: string;
  backdrop_path: string;
  release_date: string;
  genres: Genre[];
  runtime: number;
}
interface Video {
  type: string;
  site: string;
  key: string;
}
export const ImageSlider = () => {
  const [, setIsLoading] = useState(false);
  const [, setErrorMessage] = useState("");
  const [popularMovieData, setPopularMovieData] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  const getMovieData = async () => {
    console.log("token is here", TMDB_API_TOKEN);

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
      fetchTrailer(response.data.results[0].id); 
    } catch (err) {
      setIsLoading(false);
      if (axios.isAxiosError(err)) {
        setErrorMessage(err.response?.data.status_message || "Unknown error");
      }
      console.log(err);
    }
  };
  const handleWatchTrailer = async () => {
      if (currentMovie) {
        await fetchTrailer(currentMovie.id);
        setIsTrailerOpen(true);
      }
      
    };
  const fetchTrailer = async (id: number) => {
    try {
      const response = await axios.get(
        `${TMDB_BASE_URL}/movie/${id}/videos?language=en-US`,
        {
          headers: { Authorization: `Bearer ${TMDB_API_TOKEN}` },
        }
      );
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
  
  useEffect(() => {
    getMovieData();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsTrailerOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
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
          title="Previous Movie"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={goToNextMovie}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full text-white"
          title="Next Movie"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Movie Information */}
      <div className="static text-foreground lg:absolute lg:top-1/2 lg:left-[140px] lg:-translate-y-1/2 lg:text-white z-10 ">
        <div className="p-5 space-y-4 lg:p-0">
          <div className="flex flex-col justify-between">
            <div>
              <h4 className="text-sm">Now Playing:</h4>
              <p className="text-3xl font-semibold truncate w-56">
                {currentMovie?.original_title}
              </p>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <Star className="text-yellow-300 h-4 w-4  " fill="currentColor"  />
              <p className="text-sm font-semibold">
                {currentMovie?.vote_average}
              </p>
              <p className="text-sm">/10</p>
            </div>
          </div>
          <div >
          <p className=" mt-2 w-[302px] text-sm line-clamp-5 ">{currentMovie?.overview}</p>
          <div className="mt-4">
            <Button
              variant="outline"
              className="flex items-center gap-2 shadow-sm h-9 px-4 py-2 text-foreground"
              onClick={handleWatchTrailer}
            >
              <Play className="h-4 w-4" />
              Watch Trailer
            </Button>
          </div>
          </div>

        </div>
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
  );
};
