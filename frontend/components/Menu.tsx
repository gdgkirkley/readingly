import React from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import Link from "next/link";
import { useUser } from "../hooks/useUser";
import Signout from "./Signout";

const StyledNav = styled.nav`
  margin: 0;
  padding: 0;
  display: flex;
  justify-self: end;
  font-size: 1.8rem;

  & a,
  button {
    padding: 1rem 3rem;
    display: flex;
    position: relative;
    align-items: center;
    font-weight: 600;
    border: 0;
    cursor: pointer;
    color: ${(props) => props.theme.black};

    &::before {
      content: "";
      position: absolute;
      width: 100%;
      height: 2px;
      bottom: 0;
      left: 0;
      background-color: ${(props) => props.theme.red};
      visibility: hidden;
      transform: scaleX(0);
      transition: all 0.3s ease-in-out 0s;
    }

    &:hover,
    :focus {
      outline: none;
      color: ${(props) => props.theme.red};
      &::before {
        visibility: visible;
        transform: scaleX(1);
      }
    }

    &.active {
      color: ${(props) => props.theme.red};
      &::before {
        visibility: visible;
        transform: scaleX(1);
      }
    }
  }

  @media (max-width: 1300px) {
    border-top: 1px solid ${(props) => props.theme.lightgrey};
    width: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

type Props = {
  onClick(): void;
};

const Menu = ({ onClick }: Props) => {
  const router = useRouter();
  const me = useUser();
  const path = router.pathname;

  return (
    <StyledNav>
      <Link href="/search">
        <a onClick={onClick} className={path === "/search" ? "active" : ""}>
          Search Books
        </a>
      </Link>
      {me && (
        <>
          <Link href="/mybookshelves">
            <a
              onClick={onClick}
              className={path === "/mybookshelves" ? "active" : ""}
            >
              Bookshelves
            </a>
          </Link>
          <Link href="/myaccount">
            <a
              onClick={onClick}
              className={path === "/myaccount" ? "active" : ""}
            >
              Account
            </a>
          </Link>
          <Signout onClick={onClick} />
        </>
      )}
      {!me && (
        <Link href="/signin">
          <a onClick={onClick}>Sign In</a>
        </Link>
      )}
    </StyledNav>
  );
};

export default Menu;
