"use client"
import React, { useState, useEffect } from "react";
import { Film, Search, Moon, Sun, X, ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
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
  const [movies, setMovies] = useState<{ id: number; title: string }[]>([]);
  const [showStatusBar, setShowStatusBar] = useState(true);
  const [showActivityBar, setShowActivityBar] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const router = useRouter();

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
         `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(searchValue)}`,
         {
          headers: { Authorization: `Bearer ${TMDB_API_KEY}` },
        }
        );
        const data = await response.json();
        setMovies(data.results || []);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };
    

    const timeoutId = setTimeout(fetchMovies, 300); // Debounce effect

    return () => clearTimeout(timeoutId);
  }, [searchValue]);

  

  const push = (url: string) => {
    router.push(url);
  };
  return (
    <div className="fixed top-0 inset-x-0 z-20 h-[59px] bg-background flex items-center justify-center">
      <div className="flex items-center justify-between w-full max-w-screen-xl px-5 lg:px-0">
        <div onClick={goHome} className="flex items-center gap-x-2 text-indigo-700">
          <Film />
          <p className="font-bold italic">Movie Z</p>
        </div>
        <div className="relative hidden lg:flex items-center gap-x-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="relative border rounded-md border-gray-100 ">
                <Button variant="outline" className="flex items-center justify-between px-3 ">
                  <ChevronDown className=" w-5 h-5" />
                  <p>Genre</p>
                </Button>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel className="space-y-1">
                <h3 className="text-2xl font-semibold">Genres</h3>
                <p className="text-sm font-normal">See lists of movies by genre</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked={showStatusBar} onCheckedChange={setShowStatusBar}>
                Status Bar
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={showActivityBar} onCheckedChange={setShowActivityBar}>
                Activity Bar
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={showPanel} onCheckedChange={setShowPanel}>
                Panel
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="relative hidden lg:flex items-center gap-x-3">
            <Input
              placeholder="Search"
              className="hidden md:block pl-10 pr-4 border border-gray-300 rounded-md focus:ring focus:ring-indigo-300 h-10 w-96"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 hidden md:block" />
            {movies.length > 0 && (
              <div className="absolute left-0 w-full bg-white border border-gray-300 rounded-md z-10 shadow-lg">
                {movies.map((movie) => (
                  <div 
                    key={movie.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => push(`/detail/${movie.id}`)}
                  >
                    {movie.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-x-3">
          {!showSearch && (
            <Button variant="outline" className="w-9 h-9 md:hidden" onClick={() => setShowSearch(true)}>
              <Search />
              {movies.length > 0 && (
              <div className="absolute left-0 w-full bg-white border border-gray-300 rounded-md z-10 shadow-lg">
                {movies.map((movie) => (
                  <div 
                    key={movie.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => push(`/detail/${movie.id}`)}
                  >
                    {movie.title}
                  </div>
                ))}
              </div>
            )}
            </Button>
          )}
          {showSearch && (
            <div className="absolute inset-x-0 top-0 flex items-center px-5 h-[59px] bg-background w-full md:hidden gap-x-3">
              <div className="relative w-full">
                <Input
                  placeholder="Search..."
                  className="pl-10 pr-4 w-full border border-gray-300 rounded-md focus:ring focus:ring-indigo-300"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
              <Button variant="ghost" className="ml-2" onClick={() => setShowSearch(false)}>
                <X />
              </Button>
            </div>
          )}
          <Button variant="outline" className="w-9 h-9" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun /> : <Moon />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;
