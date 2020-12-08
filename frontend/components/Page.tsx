import React, { Component } from "react";
import { useRouter } from "next/router";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import { ToastContainer } from "react-toastify";
import Meta from "./Meta";
import Header from "./Header";
import Footer from "./Footer";
import HomeBanner from "./HomeBanner";

export const theme = {
  black: "#222222",
  yellow: "#f4b52e",
  purple: "#8242F6",
  red: "#E75248",
  lightgrey: "rgb(250, 250, 250)",
  maxWidth: "1200px",
};

const GlobalStyles = createGlobalStyle`
    @font-face {
      font-family: 'Inter' ;
      src: url('/inter-v2-latin-regular.woff2') form('woff2');
      font-weight: normal;
      font-style: normal;
    }
    @font-face {
      font-family: 'Inter' ;
      src: url('/inter-v2-latin-300.woff2') form('woff2');
      font-weight: 300;
      font-style: normal;
    }
    @font-face {
      font-family: 'Inter' ;
      src: url('/inter-v2-latin-600.woff2') form('woff2');
      font-weight: 600;
      font-style: normal;
    }
    @font-face {
      font-family: 'Inter' ;
      src: url('/inter-v2-latin-800.woff2') form('woff2');
      font-weight: 800;
      font-style: normal;
    }
    html {
        box-sizing: border-box;
        font-size: 10px
    }
    *, *:before, *:after {
        box-sizing: border-box;
    }
    body {
        padding: 0;
        margin: 0;
        font-size: 1.5rem;
        line-height: 2;
        font-family: 'Inter', Arial, Helvetica, sans-serif;
        min-height: 100vh;
    }
    h1, h2, h3, h4, h5, h6 {
      font-weight: 800;
    }
    strong {
      font-weight: 600;
    }
    a {
        text-decoration: none;
    }
    button {
      border: 0 solid #e2e8f0;
      cursor: pointer;
      &:focus {
        box-shadow: 0 0 0 3px rgba(66,153,225,.5);
        outline: 0;
      }
    }
`;

const StyledPage = styled.div`
  background: white;
  color: ${(props) => props.theme.black};
  height: 100vh;
`;

const Inner = styled.main`
  margin: 0 auto;
  padding: 2rem;
  width: ${(props) => props.theme.maxWidth};
  max-width: 100%;
  min-height: calc(100vh - 300px);
`;

const Page: React.FC = (props) => {
  const router = useRouter();

  return (
    <ThemeProvider theme={theme}>
      <Meta />
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        pauseOnHover
      />
      <StyledPage>
        <Header />
        {router.pathname === "/" ? <HomeBanner /> : null}
        <Inner>{props.children}</Inner>
        <Footer />
      </StyledPage>
      <GlobalStyles />
    </ThemeProvider>
  );
};

export default Page;
