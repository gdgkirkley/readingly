import React from "react";
import styled from "styled-components";
import CatGlassIllustration from "../components/illustrations/CatGlassIllustration";

const Illustration = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Page404 = () => {
  return (
    <Illustration>
      <CatGlassIllustration width={500} />
      <h1>Wut?</h1>
      <p>There's nothing to see here...</p>
    </Illustration>
  );
};

export default Page404;
