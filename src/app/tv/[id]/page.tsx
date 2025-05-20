"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import Config from "@/config";
import { useGuestSession } from "@/providers/GuestSessionContext";
import { markAsFavorite } from "@/services/accounts/markAsFavorite";
import { getTvShowById } from "../../../services/tv/getTvShowById"; // debes crear este archivo
import { IMovieDetail } from "@/types/MovieDetail"; // usar mismo tipo
import RecommendedMovies from "@/components/RecommendedMovies/RecommendedMovies";

const TvShowDetailPage = () => {
  const { id } = useParams();
  const [tvShow, setTvShow] = useState<IMovieDetail | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const { guestSessionId } = useGuestSession();

  useEffect(() => {
    if (!id || typeof id !== "string") return;
    const fetchTvShow = async () => {
      setLoading(true);
      try {
        const data = await getTvShowById(id);
        setTvShow(data);
      } catch (err) {
        console.error("Error fetching TV show", err);
        setError("Could not load TV show.");
      } finally {
        setLoading(false);
      }
    };
    fetchTvShow();
  }, [id]);

  useEffect(() => {
    if (!id || typeof id !== "string") return;
    const storedFavorites = localStorage.getItem("favoriteTvIds");
    const favoriteIds = storedFavorites ? JSON.parse(storedFavorites) : [];
    setIsFavorite(favoriteIds.includes(Number(id)));
  }, [id]);

  const handleToggleFavorite = async () => {
    if (!guestSessionId || !tvShow) return;
    const newFavorite = !isFavorite;
    try {
      await markAsFavorite(tvShow.id, newFavorite, guestSessionId, 'tv');
      const stored = localStorage.getItem("favoriteTvIds");
      const ids = stored ? JSON.parse(stored) : [];
      const updated = newFavorite
        ? [...new Set([...ids, tvShow.id])]
        : ids.filter((x: number) => x !== tvShow.id);
      localStorage.setItem("favoriteTvIds", JSON.stringify(updated));
      setIsFavorite(newFavorite);
    } catch (err) {
      console.error("Failed to update favorite:", err);
    }
  };

  if (loading) return <div>Loading TV show...</div>;
  if (error) return <div>{error}</div>;
  if (!tvShow) return <div>No TV show found.</div>;

  const airDate = new Date(tvShow.first_air_date).toLocaleDateString();

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-shrink-0 w-full md:w-80">
          <Image
            src={`${Config.IMAGE_SOURCE}${tvShow.poster_path}`}
            alt={tvShow.name}
            className="rounded-lg w-full object-cover"
            width={400}
            height={600}
          />
        </div>

        <div className="flex-grow">
          <h1 className="text-4xl font-bold mb-2">{tvShow.name}</h1>

          {tvShow.tagline && (
            <p className="text-lg italic text-gray-500 mb-4">"{tvShow.tagline}"</p>
          )}

          <p className="text-lg mb-8">{tvShow.overview}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Details</h2>
              <div className="space-y-3">
                <div>
                  <span className="font-medium">First Air Date:</span> {airDate}
                </div>

                <div>
                  <span className="font-medium">Genres:</span> {tvShow.genres.map(g => g.name).join(', ')}
                </div>
                <div>
                  <span className="font-medium">Original Language:</span> {tvShow.spoken_languages.map(l => l.english_name).join(', ')}
                </div>
                <div>
                  <span className="font-medium">Status:</span> {tvShow.status}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Production</h2>
              <div className="space-y-3">
                <div>
                  <span className="font-medium">Production Companies:</span> {tvShow.production_companies.map(c => c.name).join(', ')}
                </div>
                <div>
                  <span className="font-medium">Production Countries:</span> {tvShow.production_countries.map(c => c.name).join(', ')}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center">
            <div className="bg-yellow-500 text-white text-2xl font-bold w-16 h-16 rounded-full flex items-center justify-center mr-4">
              {tvShow.vote_average.toFixed(1)}
            </div>
            <div>
              <p className="text-lg">User Rating</p>
              <p className="text-gray-500">{tvShow.vote_count} votes</p>
            </div>
          </div>

          <button
            onClick={handleToggleFavorite}
            className={`mt-6 px-6 py-3 rounded ${
              isFavorite
                ? "bg-red-500 hover:bg-red-600"
                : "bg-yellow-500 hover:bg-yellow-600"
            } text-white font-bold`}
          >
            {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          </button>
        </div>
      </div>
      {/* Puedes personalizar el componente recomendado si haces uno para series */}
      
    <RecommendedMovies movieId={tvShow.id} type="tv" />
    </div>
  );
};

export default TvShowDetailPage;
