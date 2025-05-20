import api from "../api";

export const getTrendingPeople = async (timeWindow: 'day' | 'week' = 'week') => {
  const response = await api.get(`/trending/person/${timeWindow}`, {
    params: {
      language: "en-US"
    }
  });
  return response.data;
};
