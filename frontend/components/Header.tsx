import React from "react";
import styled from "styled-components";
import Menu from "./Menu";
import Link from "next/link";

const StyledHeader = styled.header`
  display: flex;
  flex: 1 1 150px;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: stretch;

  @media (max-width: 1300px) {
    justify-content: center;
  }
`;

const Logo = styled.h1`
  font-size: 3rem;
  margin-left: 2rem;
  padding: 0 1rem;
  position: relative;
  z-index: 2;
  color: white;
  background: ${(props) => props.theme.red};
  border-radius: 0.25rem;
  & a {
    color: white;
  }
  & span {
    color: ${(props) => props.theme.yellow};
  }
`;

const Header = (): JSX.Element => {
  return (
    <StyledHeader>
      <Logo>
        <Link href="/">
          <a>
            Reading<span>ly</span>
          </a>
        </Link>
      </Logo>
      <Menu />
    </StyledHeader>
  );
};

export default Header;
