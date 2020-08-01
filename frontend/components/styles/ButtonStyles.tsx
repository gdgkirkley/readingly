import styled from "styled-components";

type ButtonProps = {
  color?: string;
  themeColor: string;
  invert?: boolean;
};

const Button = styled.button<ButtonProps>`
  color: ${(props) =>
    props.invert
      ? props.themeColor
        ? props.theme[props.themeColor]
        : props.color
      : "#fff"};
  opacity: 0.8;
  background: ${(props) =>
    props.invert
      ? "none"
      : props.themeColor
      ? props.theme[props.themeColor]
      : props.color};
  padding: 1rem 2rem;
  font-size: 1.7rem;
  font-weight: 600;
  border-radius: 0.25rem;
  line-height: inherit;
  transition: opacity 0.1s ease-in-out;
  box-shadow: ${(props) => (props.invert ? "" : "0 4px 4px -2px #919191")};
  display: inline-flex;
  align-items: center;

  &:hover {
    opacity: 1;
    background: ${(props) => props.color};
  }

  & svg {
    width: 16px;
  }
`;

export const ButtonGroup = styled.div`
  box-shadow: 0 4px 4px -2px #919191;
  display: inline-flex;
  border-radius: 0.25rem;
  margin: 2rem 0rem;

  & button {
    box-shadow: none;
  }

  & :not(:last-child) {
    border-right: 1px solid ${(props) => props.theme.lightgrey};
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  & :not(:first-child) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
`;

export const ButtonGroupRoot = styled.div`
  flex-grow: 0;
  max-width: 100%;
  flex-basis: 100%;
  position: relative;
`;

type ContainerProps = {
  groupWidth: number;
};

export const ButtonGroupDropdownContainer = styled.div<ContainerProps>`
  position: absolute;
  top: 0px;
  left: 0px;
  transform: translate(${(props) => props.groupWidth / 3}px, 75px);
  will-change: transform;
`;

export const ButtonGroupDropdown = styled.div`
  opacity: 1;
  transform: none;
  transform-origin: center top;
  transition: opacity 251ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    transform 167ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  box-shadow: 0 4px 4px -2px #919191;
  border-radius: 0.25rem;
  background-color: #fff;

  & ul {
    padding: 8px 0;
    margin: 0;
    position: relative;

    & li {
      min-height: auto;
      width: auto;
      overflow: hidden;
      font-size: 1.6rem;
      font-family: "Inter", sans-serif;
      font-weight: 300;
      line-height: 1.5;
      padding: 6px 16px;
      white-space: nowrap;
      display: flex;
      position: relative;
      text-align: left;
      justify-content: flex-start;
      align-items: center;
    }
  }
`;

export default Button;
