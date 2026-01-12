// hooks/useFavorites.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchFavorites, addFavorite, removeFavorite } from "@/services/favorites";

export function useFavorites() {
  const queryClient = useQueryClient();

  // Fetch all favorites
  const favoritesQuery = useQuery({
    queryKey: ["favorites"],
    queryFn: fetchFavorites,
  });

  // Add favorite
  const addMutation = useMutation({
    mutationFn: addFavorite,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorites"] }),
  });

  // Remove favorite
  const removeMutation = useMutation({
    mutationFn: removeFavorite,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorites"] }),
  });

  return { favoritesQuery, addMutation, removeMutation };
}
