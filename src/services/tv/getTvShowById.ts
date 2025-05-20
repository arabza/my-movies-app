import api from "../api";

export const getTvShowById = async (id: string) => {
  const { data } = await api.get(`/tv/${id}`);
  return data;
};
