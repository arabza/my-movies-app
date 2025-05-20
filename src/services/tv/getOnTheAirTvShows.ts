import api from "../api";

export const getOnTheAirTvShows = async (page = 1) => {
  const response = await api.get('/tv/on_the_air', {
    params: {
      language: "en-US",
      page
    }
  });
  return response.data;
};
