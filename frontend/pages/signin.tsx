import React from "react";
import Signin from "../components/Signin";
import styled from "styled-components";

const StyledSignIn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SignInPage = () => {
  return (
    <StyledSignIn>
      <Signin />
    </StyledSignIn>
  );
};

export default SignInPage;
