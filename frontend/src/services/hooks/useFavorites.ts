import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchFavorites,
  addFavorite,
  removeFavorite,
} from "@/services/favorites";
import { Favorite } from "../types";

export function useFavorites(fetchOnClick: boolean = false) {
  const queryClient = useQueryClient();

  const favoritesQuery = useQuery<Favorite[]>({
    queryKey: ["favorites"],
    queryFn: fetchFavorites,
    enabled: fetchOnClick,
    staleTime: 1000 * 60 * 5,
  });

  const addMutation = useMutation({
    mutationFn: addFavorite,

    // 🔥 OPTIMISTIC ADD
    onMutate: async (productId: string) => {
      await queryClient.cancelQueries({ queryKey: ["favorites"] });

      const previousFavorites =
        queryClient.getQueryData<Favorite[]>(["favorites"]);

      queryClient.setQueryData<Favorite[]>(["favorites"], (old = []) => [
        ...old,
        { product_id: productId } as Favorite,
      ]);

      return { previousFavorites };
    },

    onError: (_err, _productId, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(["favorites"], context.previousFavorites);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeFavorite,

    // 🔥 OPTIMISTIC REMOVE
    onMutate: async (productId: string) => {
      await queryClient.cancelQueries({ queryKey: ["favorites"] });

      const previousFavorites =
        queryClient.getQueryData<Favorite[]>(["favorites"]);

      queryClient.setQueryData<Favorite[]>(["favorites"], (old = []) =>
        old.filter((f) => f.product_id !== productId)
      );

      return { previousFavorites };
    },

    onError: (_err, _productId, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(["favorites"], context.previousFavorites);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  return { favoritesQuery, addMutation, removeMutation };
}


// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import {
//   fetchFavorites,
//   addFavorite,
//   removeFavorite,
// } from "@/services/favorites";
// import { Favorite } from "../types";



// export function useFavorites(fetchOnClick: boolean = false) {
//   const queryClient = useQueryClient();

//   const favoritesQuery = useQuery<Favorite[]>({
//     queryKey: ["favorites"],
//     queryFn: fetchFavorites,
//     enabled: fetchOnClick, // only fetch when modal is opened
//     staleTime: 1000 * 60 * 5, // 5 minutes cache
//   });

//   const addMutation = useMutation({
//     mutationFn: addFavorite,
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorites"] }),
//   });

//   const removeMutation = useMutation({
//     mutationFn: removeFavorite,
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorites"] }),
//   });

//   return { favoritesQuery, addMutation, removeMutation };
// }
