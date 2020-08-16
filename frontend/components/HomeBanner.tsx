import React from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import RelaxingIllustration from "./illustrations/RelaxingIllustration";

const Banner = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  padding: 2rem;
  margin-bottom: 4rem;
  height: 50vh;
`;

const HomeBanner = () => {
  const router = useRouter();

  if (router.pathname !== "/") return null;

  return (
    <Banner>
      <div>
        <h1>Welcome to Readingly</h1>
        <h3>A better reading tracker.</h3>
      </div>
      <RelaxingIllustration width={500} />
    </Banner>
  );
};

export default HomeBanner;
