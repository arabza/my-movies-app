import { useState, useEffect } from "react";
import { getTrendingPeople } from "@/services/tv/getTrendingPeople";
import { getOnTheAirTvShows } from "@/services/tv/getOnTheAirTvShows";
import { getPopularMovies } from "@/services/movies/getPopularMovies";
import { getComedyMovies } from "@/services/movies/getComedyMovies";
import { IMovieDetail } from "@/types/movie";

export const useMoviesData = () => {
  const [trendingPeople, setTrendingPeople] = useState<any[]>([]);
  const [currentlyAiringTvShows, setCurrentlyAiringTvShows] = useState<IMovieDetail[]>([]);
  const [trailers, setTrailers] = useState<IMovieDetail[]>([]);
  const [comedyMovies, setComedyMovies] = useState<IMovieDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [peopleRes, tvRes, movieRes, comedyRes] = await Promise.all([
        getTrendingPeople("week"),
        getOnTheAirTvShows(),
        getPopularMovies(1),
        getComedyMovies(),
      ]);

      setTrendingPeople(peopleRes.results.slice(0, 10));
      setCurrentlyAiringTvShows(tvRes.results.slice(0, 8));
      setTrailers(movieRes.results.slice(0, 8));
      setComedyMovies(comedyRes.results.slice(0, 10));

      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch homepage data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    trendingPeople,
    currentlyAiringTvShows,
    trailers,
    comedyMovies,
    loading,
    error,
  };
};
