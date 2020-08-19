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
  margin-bottom: 4rem;
  height: 50vh;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
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
      <RelaxingIllustration width={500} />
    </Banner>
  );
};

export default HomeBanner;
