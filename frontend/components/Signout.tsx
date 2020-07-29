import React from "react";
import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import { SIGN_OUT_USER_MUTATION, CURRENT_USER_QUERY } from "../graphql/user";

const Signout = (): JSX.Element => {
  const [signout] = useMutation(SIGN_OUT_USER_MUTATION, {
    onError: () => {
      toast.error("There was a problem signing out! Please try again.");
    },
    onCompleted: () => {
      toast.success("Goodbye!");
    },
  });

  const handleSignout = () => {
    signout({
      refetchQueries: [{ query: CURRENT_USER_QUERY }],
      awaitRefetchQueries: true,
    });
  };

  return (
    <a onClick={handleSignout} data-testid="signout" role="link">
      Sign Out
    </a>
  );
};

export default Signout;
