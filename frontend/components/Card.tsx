import React from "react";
import styled from "styled-components";

type ContainerProps = {
  position: string;
};

const Container = styled.div<ContainerProps>`
  position: ${(props) => (props.position ? props.position : "relative")};
  border: 1px solid ${(props) => props.theme.lightgrey};
  padding: 2.5rem 1.8rem;
  background: ${(props) => (props.color ? props.theme[props.color] : "#fff")};
  color: ${(props) => (props.color ? "#fff" : "inherit")};
  max-width: 100%;
  display: flex;
  align-items: center;
  text-align: center;
  flex-flow: column;
  border-radius: 1rem;
  margin: 1rem;
  transition: 0.25s;
  border: 1px solid #ececec;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 6px 16px;

  &:hover {
    transform: translateY(-2px);
    /* box-shadow: 0 4px 4px -2px #919191; */
  }
`;

export enum ColorOptions {
  Purple = "purple",
  Red = "red",
  Yellow = "yellow",
}

type Props = {
  title?: string;
  color?: ColorOptions;
  position?: string;
  className?: string;
};

const Card: React.FC<Props> = ({
  title,
  color,
  position,
  className,
  children,
}) => {
  return (
    <Container color={color} position={position} className={className}>
      {title ? <h2>{title}</h2> : null}
      <div>{children}</div>
    </Container>
  );
};

export default Card;
