import React from "react";
import styled from "styled-components";
import Link from "next/link";
import { useUser } from "../hooks/useUser";
import RelaxingIllustration from "./illustrations/RelaxingIllustration";
import Button from "./styles/ButtonStyles";

const Banner = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  padding: 2rem;
  min-height: 50vh;
  overflow: hidden;

  & svg {
    width: 400px;
    height: auto;
  }

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    margin-bottom: 2rem;

    & svg {
      min-height: 200px;
      width: 300px;
    }
  }
`;

const BannerTitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const HomeBanner = () => {
  const me = useUser();

  return (
    <Banner>
      <BannerTitle>
        <h1>Welcome to Readingly</h1>
        <h3>A better reading tracker.</h3>
        {!me ? (
          <Link href="/signup" passHref={true}>
            <Button as="a" themeColor="purple">
              Create an account
            </Button>
          </Link>
        ) : null}
      </BannerTitle>
      <RelaxingIllustration />
    </Banner>
  );
};

export default HomeBanner;
