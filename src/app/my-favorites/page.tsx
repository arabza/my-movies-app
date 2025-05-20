"use client";

import React, { useEffect, useState } from "react";
import api from "@/services/api";
import MovieCard from "@/components/MovieCard/MovieCard";
import Link from "next/link";

interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  vote_average: number;
  poster_path: string;
  release_date?: string;
  first_air_date?: string;
  overview: string;
  media_type: "movie" | "tv";
}

const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocalFavorites = async () => {
      setLoading(true);
      const movieIds = JSON.parse(localStorage.getItem("favoriteMovieIds") || "[]");
      const tvIds = JSON.parse(localStorage.getItem("favoriteTvIds") || "[]");

      try {
        const moviePromises = movieIds.map((id: number) =>
          api.get(`/movie/${id}`).then((res) => ({
            ...res.data,
            media_type: "movie",
          }))
        );

        const tvPromises = tvIds.map((id: number) =>
          api.get(`/tv/${id}`).then((res) => ({
            ...res.data,
            media_type: "tv",
          }))
        );

        const [movies, tvShows] = await Promise.all([
          Promise.all(moviePromises),
          Promise.all(tvPromises),
        ]);

        setFavorites([...movies, ...tvShows]);
      } catch (err) {
        console.error("Error loading favorites", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocalFavorites();
  }, []);

  const handleRemoveFavorite = (item: MediaItem) => {
    const storageKey =
      item.media_type === "movie" ? "favoriteMovieIds" : "favoriteTvIds";
    const stored = JSON.parse(localStorage.getItem(storageKey) || "[]");
    const updated = stored.filter((id: number) => id !== item.id);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setFavorites((prev) => prev.filter((f) => f.id !== item.id));
  };

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-8">My Favorites</h1>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-8">My Favorites</h1>
        <div className="text-center p-8 bg-gray-100 rounded-lg">
          <p className="text-xl mb-4">You don’t have any favorite movies or shows yet.</p>
          <Link href="/popular" className="text-blue-600 hover:text-blue-800 font-semibold">
            Explore popular titles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">My Favorites</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {favorites.map((item) => {
          const title = item.title || item.name;
          const year =
            item.release_date || item.first_air_date
              ? new Date(item.release_date || item.first_air_date).getFullYear()
              : "N/A";

          return (
            <div key={`${item.media_type}-${item.id}`} className="relative">
              <Link href={`/${item.media_type}/${item.id}`} className="block h-full">
                <MovieCard
                  title={title}
                  voteAverage={item.vote_average}
                  posterPath={item.poster_path}
                  releaseYear={year}
                  description={item.overview}
                />
              </Link>
              <button
                onClick={() => handleRemoveFavorite(item)}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 focus:outline-none"
                aria-label="Remove from favorites"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FavoritesPage;
