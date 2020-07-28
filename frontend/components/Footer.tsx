import React from "react";
import styled from "styled-components";

const StyledFooter = styled.footer`
  background: ${(props) => props.theme.lightgrey};
  width: 100%;
  min-height: 200px;
`;

const FooterContent = styled.footer`
  display: flex;
  flex-wrap: wrap;
  padding: 2rem;
  margin: 0 auto;
  max-width: ${(props) => props.theme.maxWidth};
  justify-content: space-between;
  align-items: center;

  & h3 {
    font-size: 2rem;
  }
`;

const Footer = () => {
  return (
    <StyledFooter>
      <FooterContent>
        <h3>Readingly</h3>
        <div>
          <p>This is a portfolio project created by Gabriel Kirkley.</p>
          <a href="https://github.com/gdgkirkley/readingly">View on Github</a>
        </div>
      </FooterContent>
    </StyledFooter>
  );
};

export default Footer;
