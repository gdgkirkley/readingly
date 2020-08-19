import React, { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import styled from "styled-components";
import Menu from "./Menu";
import useWindowSize from "../hooks/useWindowSize";

const Hamburger = dynamic(() => import("hamburger-react"));

const StyledHeader = styled.header`
  display: flex;
  flex: 1 1 150px;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: stretch;

  @media (max-width: 1300px) {
    align-items: center;
    margin-right: 2rem;
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

const Header = () => {
  const [open, setOpen] = useState<boolean>(false);

  const { width } = useWindowSize();

  useEffect(() => {
    if (width !== undefined && width > 1300) {
      setOpen(false);
    }
  }, [width]);

  const handleMenuButtonClick = (): void => {
    if (width && width !== undefined && width > 1300) {
      return;
    }

    setOpen(!open);
  };

  return (
    <StyledHeader>
      <Logo>
        <Link href="/">
          <a>
            Reading<span>ly</span>
          </a>
        </Link>
      </Logo>
      {width < 1300 ? (
        <Hamburger toggled={open} toggle={handleMenuButtonClick} />
      ) : null}
      {width < 1300 ? (
        open ? (
          <Menu onClick={handleMenuButtonClick} />
        ) : null
      ) : (
        <Menu onClick={handleMenuButtonClick} />
      )}
    </StyledHeader>
  );
};

export default Header;
