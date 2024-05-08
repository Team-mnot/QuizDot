import { useQueryClient } from "@tanstack/react-query";

export function useEnterRoomMutation() {
    const client = useQueryClient();

   return useMutation{(
        mutationFn: (postId) => Enter(postId),
    )};
};
