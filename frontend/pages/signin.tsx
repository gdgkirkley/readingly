import React from "react";
import Link from "next/link";
import Signin from "../components/Signin";
import styled from "styled-components";
import Button from "../components/styles/ButtonStyles";

export const StyledAuthPage = styled.div`
  display: grid;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  grid-template-columns: 3fr 2fr;
`;

export const FormBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const GoToBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  margin-left: 2em;
  height: 100%;
  border: 1px dotted ${(props) => props.theme.purple};
  border-radius: 0.25rem;
`;

const SignInPage = () => {
  return (
    <StyledAuthPage>
      <FormBlock>
        <h1>Sign in to Readingly</h1>
        <Signin />
      </FormBlock>
      <GoToBlock>
        <h2>New to Readingly?</h2>
        <Link href="/signup" passHref={true}>
          <Button as="a" themeColor="purple">
            Create an account
          </Button>
        </Link>
      </GoToBlock>
    </StyledAuthPage>
  );
};

export default SignInPage;
