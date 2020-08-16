import React from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import RelaxingIllustration from "./illustrations/RelaxingIllustration";

const Banner = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: 100%;
  background: ${(props) => props.theme.yellow};
  padding: 2rem;
  margin: 2rem 0rem;
`;

const HomeBanner = () => {
  const router = useRouter();

  if (router.pathname !== "/") return null;

  return (
    <Banner>
      <div>
        <h1>Welcome to Readingly</h1>
        <h3>Your reading companion</h3>
      </div>
      <RelaxingIllustration width={400} />
    </Banner>
  );
};

export default HomeBanner;
