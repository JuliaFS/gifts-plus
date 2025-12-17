import { useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { fetchCurrentUser } from "../auth";
import { User } from "../types";

// Define the User type


export function useCurrentUser(): UseQueryResult<User | null> {
  const queryClient = useQueryClient();

  // Check if user is already cached
  const cachedUser = queryClient.getQueryData<User>(["currentUser"]);

  return useQuery<User | null>({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
    staleTime: 0,
    retry: false,
    refetchOnWindowFocus: false,
    enabled: cachedUser === undefined, // fetch only if not cached
    //enabled: cachedUser !== null && cachedUser !== undefined ? false : true,
    initialData: cachedUser,
  });
}


// import { useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
// import { fetchCurrentUser } from "../auth";
// import { User } from "../types";

// export function useCurrentUser():UseQueryResult<User | undefined> {
//   const queryClient = useQueryClient();

//   // Check if user is already cached
//   const cachedUser = queryClient.getQueryData(["currentUser"]);

//   return useQuery({
//     queryKey: ["currentUser"],
//     queryFn: fetchCurrentUser,
//     staleTime: 0,
//     retry: false,
//     refetchOnWindowFocus: false,
//     enabled: cachedUser !== null && cachedUser !== undefined ? false : true,
//     initialData: cachedUser ?? undefined,
//   });
// }

