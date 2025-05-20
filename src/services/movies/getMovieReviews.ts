import api from "../api";

export const getMovieReviews = async (movieId: number) => {
  const response = await api.get(`/movie/${movieId}/reviews`, {
    params: {
      language: "en-US",
      page: 1,
    },
  });
  return response.data.results;
};
