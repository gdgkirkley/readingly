import React from "react";
import Signin from "../components/Signin";
import styled from "styled-components";

const StyledSignIn = styled.div`
  display: flex;
  place-items: center;
  height: 100%;
`;

const SignInPage = () => {
  return (
    <StyledSignIn>
      <Signin />
    </StyledSignIn>
  );
};

export default SignInPage;
