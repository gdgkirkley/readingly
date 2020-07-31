import React from "react";
import Signin from "../components/Signin";
import styled from "styled-components";

const StyledSignIn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

const SignInPage = () => {
  return (
    <StyledSignIn>
      <Signin />
    </StyledSignIn>
  );
};

export default SignInPage;
