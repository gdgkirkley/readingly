import React from "react";
import { MockedProvider } from "@apollo/client/testing";
import { render, screen, cleanup } from "@testing-library/react";
import HomeBanner from "../HomeBanner";
import { mockCurrentUserQuery } from "../../test/mocks";
import { CURRENT_USER_QUERY } from "../../graphql/user";

afterEach(() => {
  cleanup();
});

test("<HomeBanner /> renders", async () => {
  const mockedCurrentUser = await mockCurrentUserQuery();

  render(
    <MockedProvider mocks={[mockedCurrentUser]} addTypename={false}>
      <HomeBanner />
    </MockedProvider>
  );

  const headers = screen.getAllByRole("heading");
  screen.getByRole("img", { name: "Book Lover" });

  expect(headers[0]).toHaveTextContent(/welcome/i);
  expect(headers[1]).toHaveTextContent(/reading tracker/i);

  expect(
    screen.queryByRole("button", { name: /create an account/i })
  ).toBeFalsy();
});

test("<HomeBanner /> renders with create account link when no user", async () => {
  const mocks = [
    {
      request: { query: CURRENT_USER_QUERY },
      result: {
        data: {
          me: null,
        },
      },
    },
  ];

  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <HomeBanner />
    </MockedProvider>
  );

  const headers = screen.getAllByRole("heading");
  screen.getByRole("img", { name: "Book Lover" });
  const button = screen.getByRole("link", { name: /create an account/i });

  expect(headers[0]).toHaveTextContent(/welcome/i);
  expect(headers[1]).toHaveTextContent(/reading tracker/i);

  expect(button).toHaveAttribute("href", "/signup");
});
