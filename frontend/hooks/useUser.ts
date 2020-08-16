import { useQuery } from "@apollo/client";
import { CURRENT_USER_QUERY, UserData } from "../graphql/user";

export function useUser() {
  const { data, loading, error } = useQuery<UserData>(CURRENT_USER_QUERY);
  if (data) {
    return data.me;
  }
}
