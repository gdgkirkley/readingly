import { useQuery } from "@apollo/client";
import { CURRENT_USER_QUERY } from "../graphql/queries/user";

export function useUser() {
  const { data, loading, error } = useQuery(CURRENT_USER_QUERY);
  if (data) {
    return data.me;
  }
}
