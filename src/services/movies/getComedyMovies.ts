import api from "@/services/api";

export const getComedyMovies = async () => {
  const response = await api.get("/discover/movie", {
    params: {
      with_genres: "35", // ID de comedia
      language: "en-US",
      sort_by: "popularity.desc",
      page: 1,
    },
  });
  return response.data;
};
