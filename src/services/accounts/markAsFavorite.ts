import api from "../api";

export const markAsFavorite = async (
  mediaId: number,
  isFavorite: boolean,
  guestSessionId: string,
  mediaType: 'movie' | 'tv' = 'movie'
) => {
  try {
    const { data } = await api.post(
      `/account/0/favorite`, 
      {
        media_type: mediaType,
        media_id: mediaId,
        favorite: isFavorite
      },
      {
        params: {
          guest_session_id: guestSessionId 
        }
      }
    );

    return data;
  } catch (error) {
    console.error("Error marking as favorite:", error);
    throw error;
  }
};
