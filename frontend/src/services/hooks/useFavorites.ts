import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchFavorites,
  addFavorite,
  removeFavorite,
} from "@/services/favorites";
import { Favorite } from "../types";

export function useFavorites(fetchOnClick: boolean = false) {
  const queryClient = useQueryClient();

  // ✅ Query
  const favoritesQuery = useQuery<Favorite[]>({
    queryKey: ["favorites"],
    queryFn: fetchFavorites,
    enabled: fetchOnClick, // fetch only when needed (ex: modal opened)
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // ✅ Add favorite
  const addMutation = useMutation({
    mutationFn: addFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  // ✅ Remove favorite
  const removeMutation = useMutation({
    mutationFn: removeFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  // 🚀 IMPORTANT: you MUST return this object
  return {
    favoritesQuery,
    addMutation,
    removeMutation,
  };
}
