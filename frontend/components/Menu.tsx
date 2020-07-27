import React from "react";
import styled from "styled-components";
import Link from "next/link";
import { useUser } from "../hooks/useUser";

const StyledNav = styled.nav`
  margin: 0;
  padding: 0;
  display: flex;
  justify-self: end;
  font-size: 2rem;

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

    @media (max-width: 700px) {
      font-size: 10px;
      padding: 0 10px;
    }
  }

  @media (max-width: 1300px) {
    border-top: 1px solid ${(props) => props.theme.lightgrey};
    width: 100%;
    justify-content: center;
    font-size: 1.5rem;
  }
`;

const Menu = (): JSX.Element => {
  const me = useUser();
  return (
    <StyledNav>
      <Link href="/books">
        <a>Books</a>
      </Link>
      {me && (
        <>
          <Link href="/signout">
            <a>Sign Out</a>
          </Link>
        </>
      )}
      {!me && (
        <Link href="/signin">
          <a>Sign In</a>
        </Link>
      )}
    </StyledNav>
  );
};

export default Menu;
