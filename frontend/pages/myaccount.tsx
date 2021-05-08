import React, { useState } from "react";
import Head from "next/head";
import styled from "styled-components";
import { useUser } from "../hooks/useUser";
import Account from "../components/Account";
import ResetPassword from "../components/ResetPassword";
import ReadingIllustration from "../components/illustrations/ReadingIllustration";

const AccountContainer = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1.5fr;
  justify-content: center;
  align-items: flex-start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-gap: 2rem;
  }
`;

const TabsContainer = styled.div`
  margin-bottom: 2rem;
`;

const TabButton = styled.button`
  color: ${(props) => props.theme.black};
  padding: 2rem 2rem;
  font-weight: 600;
  font-size: 1.5rem;
  background: #fff;
  transition: 0.2s linear;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: ${(props) => props.theme.purple};
    visibility: hidden;
    transform: scaleX(0);
    transition: all 0.3s ease-in-out 0s;
  }

  &:hover {
    outline: none;
    color: ${(props) => props.theme.purple};
    &::before {
      visibility: visible;
      transform: scaleX(1);
    }
  }

  &:focus {
    outline: none;
    box-shadow: none;
  }

  &.active {
    outline: none;
    color: ${(props) => props.theme.purple};
    &::before {
      visibility: visible;
      transform: scaleX(1);
    }
  }
`;

enum TABS {
  Account = "account",
  Password = "password",
}

const MyAccount = () => {
  const [tab, setTab] = useState<TABS>(TABS.Account);
  const me = useUser();

  const updateTab = (tab: TABS): void => {
    setTab(tab);
  };

  if (!me) {
    return null;
  }

  return (
    <div>
      <Head>
        <title>Account | Readingly</title>
      </Head>
      <AccountContainer>
        <div>
          <h1>Welcome{me.username ? `, ${me.username}` : null}!</h1>
          <TabsContainer>
            <TabButton
              onClick={() => updateTab(TABS.Account)}
              className={tab === TABS.Account ? "active" : null}
            >
              Account
            </TabButton>
            <TabButton
              onClick={() => updateTab(TABS.Password)}
              className={tab === TABS.Password ? "active" : null}
            >
              Reset Password
            </TabButton>
          </TabsContainer>
          {tab === TABS.Account ? <Account me={me} /> : null}
          {tab === TABS.Password ? <ResetPassword me={me} /> : null}
        </div>
        <ReadingIllustration />
      </AccountContainer>
    </div>
  );
};

export default MyAccount;
