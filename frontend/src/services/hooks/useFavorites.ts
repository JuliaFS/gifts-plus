// hooks/useFavorites.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchFavorites, addFavorite, removeFavorite } from "@/services/favorites";

export function useFavorites(fetchOnClick: boolean = false) {
  const queryClient = useQueryClient();

  const favoritesQuery = useQuery({
    queryKey: ["favorites"],
    queryFn: fetchFavorites,
    enabled: fetchOnClick, // only fetch when modal is opened
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  const addMutation = useMutation({
    mutationFn: addFavorite,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorites"] }),
  });

  const removeMutation = useMutation({
    mutationFn: removeFavorite,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorites"] }),
  });

  return { favoritesQuery, addMutation, removeMutation };
}



