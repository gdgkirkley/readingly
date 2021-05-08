import styled from "styled-components";

type PercentageProps = {
  width: string;
};

export const PercentageBar = styled.div<PercentageProps>`
  width: 100%;
  background: ${(props) => props.theme.lightgrey};
  position: relative;
  min-height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;

  & strong {
    position: relative;
    z-index: 1;
  }

  &::before {
    content: "";
    top: 0;
    left: 0;
    width: ${(props) => props.width};
    height: 100%;
    background-color: ${(props) => props.theme.yellow};
    position: absolute;
    z-index: 1;
  }
`;
