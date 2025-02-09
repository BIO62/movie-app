"use client";
import React from "react";
import { Movie } from "@/types/movie-types";
import Image from "next/image";

type MovieProps = {
  movie: Movie;
};

const MovieComponent: React.FC<MovieProps> = ({ movie }) => {
  if (!movie) return null; // Handle missing movie data

  return (
    <div className="movie-detail text-foreground">
      <h2 className="text-2xl font-bold">{movie.title}</h2>
      <p className="text-muted-foreground">{movie.overview}</p>
      <Image
        src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
        alt={movie.title}
        className="w-64 mt-4 rounded-lg"
      />
      <p className="mt-2">⭐ {movie.vote_average} / 10</p>
      <p>🎬 Release Date: {movie.release_date}</p>
    </div>
  );
};

export default MovieComponent;
