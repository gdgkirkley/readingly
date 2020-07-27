import React from "react";
import styled from "styled-components";
import Menu from "./Menu";

const StyledHeader = styled.header`
  display: grid;
  grid-template-columns: auto 1fr;
  justify-content: space-between;
  align-items: stretch;

  @media (max-width: 1300px) {
    grid-template-columns: 1fr;
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
  & span {
    color: ${(props) => props.theme.yellow};
  }
`;

const Header = (): JSX.Element => {
  return (
    <StyledHeader>
      <Logo>
        Reading<span>ly</span>
      </Logo>
      <Menu />
    </StyledHeader>
  );
};

export default Header;
