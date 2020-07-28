import React from "react";
import { MockedProvider } from "@apollo/client/testing";
import { render, cleanup, screen, waitFor } from "@testing-library/react";
import { CURRENT_USER_QUERY } from "../../graphql/user";
import Header from "../Header";

afterEach(() => {
  cleanup();
});

// See Menu.test.tsx for related tests
test("<Header /> renders a header", async () => {
  // Mocked for <Menu /> which relies on the current user query
  const mocks = [
    {
      request: {
        query: CURRENT_USER_QUERY,
      },
      result: {
        data: {
          me: null,
        },
      },
    },
  ];

  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <Header />
    </MockedProvider>
  );

  await waitFor(() => {
    expect(screen.getByRole("heading")).toHaveTextContent("Readingly");
  });
});
