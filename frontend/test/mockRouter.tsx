import React from "react";
import { NextRouter } from "next/router";
import { RouterContext } from "next/dist/next-server/lib/router-context";

// Mocked Next Router
// To assert on the router object, make sure to import mockRouter as well

const MockRouter: React.FC = ({ children }) => {
  return (
    <RouterContext.Provider value={{ ...mockRouter }}>
      {children}
    </RouterContext.Provider>
  );
};

export default MockRouter;

export const mockRouter: NextRouter = {
  basePath: "",
  pathname: "/",
  route: "/",
  asPath: "/",
  query: {},
  push: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  back: jest.fn(),
  prefetch: jest.fn(),
  beforePopState: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  isFallback: false,
};
