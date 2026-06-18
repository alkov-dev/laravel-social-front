import { useQuery } from "@tanstack/react-query"
import { currentUserRequest } from "../requests/user-request"


export const useCurrentUser = () => {
    return useQuery({
        queryKey: ['current-user'],
        queryFn: () => currentUserRequest(),
    })
}
