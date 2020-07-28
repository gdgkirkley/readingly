import React from "react";
import { useMutation } from "@apollo/client";
import Link from "next/link";
import { toast } from "react-toastify";
import { SIGN_OUT_USER_MUTATION, CURRENT_USER_QUERY } from "../graphql/user";

const Signout = (): JSX.Element => {
  const [signout] = useMutation(SIGN_OUT_USER_MUTATION);

  const handleSignout = () => {
    signout({
      refetchQueries: [{ query: CURRENT_USER_QUERY }],
      awaitRefetchQueries: true,
    });
    toast.success("Goodbye!");
  };

  return (
    <Link href="/" passHref>
      <a onClick={handleSignout}>Sign Out</a>
    </Link>
  );
};

export default Signout;
