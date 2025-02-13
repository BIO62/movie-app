"use client";

import React, { useState, useEffect, useRef } from "react";
import { Film, Search, Moon, Sun, ChevronDown, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import GenreList from "../GenreList";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

const Header = () => {
  const { setTheme, theme } = useTheme();
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [movies, setMovies] = useState<
    {
      id: number;
      title: string;
      poster_path: string | null;
      release_date: string;
    }[]
  >([]);
  const router = useRouter();

  const searchRef = useRef(null);

  const goHome = () => {
    router.push("/");
  };

  useEffect(() => {
    if (!searchValue.trim()) {
      setMovies([]);
      return;
    }

    const fetchMovies = async () => {
      try {
        const response = await fetch(
          `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
            searchValue
          )}`,
          {
            headers: { Authorization: `Bearer ${TMDB_API_KEY}` },
          }
        );
        const data = await response.json();
        setMovies(data.results.slice(0, 5) || []);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    const timeoutId = setTimeout(fetchMovies, 300);

    return () => clearTimeout(timeoutId);
  }, [searchValue]);

  const push = (url: string) => {
    router.push(url);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearch(false);
        setSearchValue("");
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed top-0 inset-x-0 z-20 h-[59px] bg-background flex items-center justify-center">
      <div className="flex items-center justify-between w-full max-w-screen-xl px-5 lg:px-0">
        <div
          onClick={goHome}
          className="flex items-center gap-x-2 text-indigo-700 dark:text-indigo-300"
        >
          <Film />
          <p className="font-bold italic">Movie Z</p>
        </div>

        <div className="relative hidden lg:flex items-center gap-x-3 ">
          <DropdownMenu >
            <DropdownMenuTrigger asChild>
              <div className="relative border rounded-md border-gray-100 dark:border-gray-700 ">
                <Button
                  variant="outline"
                  className="flex items-center justify-between px-3"
                >
                  <ChevronDown className="w-5 h-5" />
                  <p>Genre</p>
                </Button>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[335px] sm:w-[577px] bg-white dark:bg-gray-800 text-black dark:text-white border dark:border-gray-600">
              <DropdownMenuLabel className="space-y-1">
                <h3 className="text-2xl font-semibold">Genres</h3>
                <p className="text-sm font-normal">
                  See lists of movies by genre
                </p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <GenreList />
            </DropdownMenuContent>
          </DropdownMenu>

          <div
            className="relative hidden lg:flex items-center gap-x-3"
            ref={searchRef}
          >
            <Input
              placeholder="Search"
              className="hidden md:block pl-10 pr-4 border border-gray-300 dark:border-gray-600 rounded-md focus:ring focus:ring-indigo-300 dark:focus:ring-indigo-700 h-10 w-96 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300 w-5 h-5 hidden md:block" />

            {movies.length > 0 && (
              <div className="absolute top-10 z-10 mt-2 rounded-xl border bg-card text-card-foreground shadow search-result p-3 h-[720px] w-[577px] lg:h-auto overflow-y-auto">
                {movies.map((movie) => (
                  <div
                    key={movie.id}
                    className="p-2 flex items-center gap-x-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer relative"
                  >
                    {movie.poster_path && (
                      <img
                        src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                        alt={movie.title}
                        className="relative overflow-hidden w-[67px] h-[100px] rounded-md"
                      />
                    )}
                    <div>
                      <span className="block font-bold">{movie.title}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {movie.release_date
                          ? movie.release_date.split("-")[0]
                          : "Unknown"}
                      </span>
                    </div>
                    <Button
                      variant="link"
                      className="absolute bottom-2 right-2 text-foreground font-bold h-9 px-4 py-2"
                      onClick={() => push(`/detail/${movie.id}`)}
                    >
                      See more
                      <ArrowRight />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-x-3">
          <Button
            variant="outline"
            className="w-9 h-9 md:hidden"
            onClick={() => {
              console.log("Button clicked"); // Debug log
              setShowSearch((prev) => !prev);
            }}
          >
            <Search />
          </Button>

          <Button
            variant="outline"
            className="w-9 h-9"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="text-white" />
            ) : (
              <Moon className="text-gray-800" />
            )}
          </Button>

          {showSearch && (
            <div className="relative md:hidden">
              {" "}
              <Input
                placeholder="Search"
                className="pl-10 pr-4 border border-gray-300 dark:border-gray-600 rounded-md focus:ring focus:ring-indigo-300 dark:focus:ring-indigo-700 h-10 w-64 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300 w-5 h-5" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
