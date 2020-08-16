import React from "react";
import Link from "next/link";
import SignUpForm from "../components/Signup";
import { StyledAuthPage, FormBlock, GoToBlock } from "./signin";
import Button from "../components/styles/ButtonStyles";

const SignUp = () => {
  return (
    <StyledAuthPage>
      <FormBlock>
        <h1>Welcome to Readingly</h1>
        <SignUpForm />
      </FormBlock>
      <GoToBlock>
        <h2>Already have an account?</h2>
        <Link href="/signin" passHref={true}>
          <Button as="a" themeColor="purple">
            Sign in
          </Button>
        </Link>
      </GoToBlock>
    </StyledAuthPage>
  );
};

export default SignUp;
