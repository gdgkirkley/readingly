import styled from "styled-components";

type ButtonProps = {
  color?: string;
  themeColor: string;
  invert?: boolean;
  primary?: boolean;
  iconButton?: boolean;
};

const Button = styled.button<ButtonProps>`
  color: ${(props) =>
    props.invert
      ? "none"
      : props.themeColor
      ? props.theme[props.themeColor]
      : props.color};
  opacity: 0.8;
  background: #fff;
  border: 1px solid
    ${(props) =>
      props.invert
        ? "none"
        : props.themeColor
        ? props.theme[props.themeColor]
        : props.color};
  padding: 1rem 2rem;
  font-size: 1.7rem;
  font-weight: 600;
  border-radius: 0.5rem;
  line-height: inherit;
  transition: opacity 0.1s ease-in-out;
  /* box-shadow: ${(props) =>
    props.invert ? "" : "0 4px 4px -2px #919191"}; */
  display: inline-flex;
  align-items: center;
  box-sizing: border-box;

  & .hidden-text {
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    width: 1px;
  }

  &:hover,
  :focus {
    opacity: 1;
  }

  &:focus {
    border: 2px solid lightblue;
  }

  & svg {
    width: 16px;
  }

  &:disabled {
    opacity: 1;

    &:hover {
      cursor: initial;
    }
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

  & button:not(:last-child) {
    border-right: 1px solid ${(props) => props.theme.lightgrey};
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  & button:not(:first-child) {
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

type Props = {
  width?: number;
};

export const ButtonGroupDropdownContainer = styled.div<Props>`
  position: absolute;
  top: 0px;
  left: 0px;
  transform: translate(0px, 75px);
  min-width: ${(props) => (props.width ? props.width : "262")}px;
  max-height: 300px;
  overflow-y: auto;
  will-change: transform;
  box-shadow: 0 4px 4px -2px #919191;
`;

export const ButtonGroupDropdown = styled.div`
  opacity: 1;
  transform: none;
  transform-origin: center top;
  transition: opacity 251ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    transform 167ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
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

      &:hover {
        background-color: ${(props) => props.theme.lightgrey};
        cursor: pointer;
      }

      &[aria-selected="true"] {
        background-color: ${(props) => props.theme.yellow};
        color: #fff;
      }
    }
  }
`;

export default Button;
