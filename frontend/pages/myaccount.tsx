import React from "react";
import { useRouter } from "next/router";
import { useUser } from "../hooks/useUser";
import Account from "../components/Account";

const MyAccount = () => {
  const router = useRouter();
  const me = useUser();

  if (!me) {
    return null;
  }

  return (
    <div>
      <h1>My Account</h1>
      <Account me={me} />
    </div>
  );
};

export default MyAccount;
