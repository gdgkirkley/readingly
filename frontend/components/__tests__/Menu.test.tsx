import React from "react";
import { MockedProvider } from "@apollo/client/testing";
import { render, cleanup, screen, waitFor } from "@testing-library/react";
import { CURRENT_USER_QUERY } from "../../graphql/user";
import Menu from "../Menu";
import { buildUser } from "../../test/generate";
import MockRouter, { mockRouter } from "../../test/mockRouter";

afterEach(() => {
  cleanup();
});

// See Header.test.tsx for related tests
test("<Menu /> renders a header with user links when user present", async () => {
  const onClick = jest.fn();
  const user = await buildUser();

  const mocks = [
    {
      request: {
        query: CURRENT_USER_QUERY,
      },
      result: {
        data: {
          me: { id: user.id, email: user.email, username: user.username },
        },
      },
    },
  ];

  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <MockRouter>
        <Menu onClick={onClick} />
      </MockRouter>
    </MockedProvider>
  );

  let menuLinks;

  await waitFor(() => {
    menuLinks = screen.getAllByRole("link");

    expect(menuLinks).toHaveLength(4);
  });

  expect(menuLinks[0]).toHaveTextContent(/search/i);
  expect(menuLinks[0]).toHaveAttribute("href", "/search");

  expect(menuLinks[1]).toHaveTextContent(/bookshelves/i);
  expect(menuLinks[1]).toHaveAttribute("href", "/mybookshelves");

  expect(menuLinks[2]).toHaveTextContent(/account/i);
  expect(menuLinks[2]).toHaveAttribute("href", "/myaccount");

  // See tests in Signout.test.tsx
  expect(menuLinks[3]).toHaveTextContent(/sign out/i);
});

test("<Menu /> renders header without user links when no user", async () => {
  const onClick = jest.fn();
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
      <MockRouter>
        <Menu onClick={onClick} />
      </MockRouter>
    </MockedProvider>
  );

  await waitFor(() => {
    const menuLinks = screen.getAllByRole("link");

    expect(menuLinks).toHaveLength(2);

    expect(menuLinks[0]).toHaveTextContent(/search/i);
    expect(menuLinks[0]).toHaveAttribute("href", "/search");

    expect(menuLinks[1]).toHaveTextContent(/sign in/i);
  });
});
