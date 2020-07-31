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

  &:hover {
    opacity: 1;
    background: ${(props) => props.color};
  }
`;

export default Button;
