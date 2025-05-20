"use client";

import React from "react";
import { useMoviesData } from "@/hooks/useMoviesData";
import MovieCarousel from "@/components/MovieCarousel/MovieCarousel";
import { Video, User, Film, Clapperboard, TrendingUp } from "lucide-react";

const Home = () => {
  const {
    trendingPeople,
    currentlyAiringTvShows,
    trailers,
    comedyMovies,
    loading,
    error,
  } = useMoviesData();

  if (loading)
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );

  return (
    <div className="bg-white text-gray-800">
      <div className="container mx-auto px-4 py-8 space-y-16">
        {/* Currently Airing TV Shows */}
        <MovieCarousel
          title="Currently Airing TV Shows"
          movies={currentlyAiringTvShows}
          icon={<Video className="text-green-600" size={24} />}
          type="tv"
        />

        {/* Trending People */}
        <section>
          <div className="flex items-center mb-4">
            <User className="text-purple-600 mr-2" size={24} />
            <h2 className="text-2xl font-bold text-gray-800">
              Trending People
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {trendingPeople.map((person) => (
              <div key={person.id} className="text-center">
                <div className="rounded-full overflow-hidden w-24 h-24 mx-auto border shadow-md">
                  <img
                    src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                    alt={person.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="mt-2 font-medium text-sm text-gray-700">
                  {person.name}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Movie Trailers */}
        <MovieCarousel
          title="Movie Trailers"
          movies={trailers}
          icon={<Film className="text-red-600" size={24} />}
          type="movie"
          showFutureIndicator={false}
        />

        {/* Comedy Movies */}
        <MovieCarousel
          title="Comedy Movies"
          movies={comedyMovies}
          icon={<Clapperboard className="text-yellow-500" size={24} />}
          type="movie"
        />
      </div>
    </div>
  );
};

export default Home;
