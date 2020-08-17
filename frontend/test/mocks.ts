import { CURRENT_USER_QUERY } from "../graphql/user";
import { buildUser } from "./generate";

export const mockCurrentUserQuery = async (
  { user: { ...overrides } } = { user: {} }
) => {
  const user = await buildUser({ ...overrides });
  return {
    request: {
      query: CURRENT_USER_QUERY,
    },
    result: {
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    },
  };
};
