import React from "react";
import styled from "styled-components";

const BookImage = styled.div<Props>`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  background: ${(props) => props.theme.red};
  border-radius: 1em 0.5em 0.5em 1.2em;
  background-image: linear-gradient(
    to right,
    #d11f2f 28%,
    #ba0716 29%,
    transparent 29%
  );
  position: relative;

  &::before {
    content: "";
    position: absolute;
    height: 3%;
    width: 30%;
    right: 20%;
    top: 15%;
    background: #d11f2f;
    border-radius: 20px;
    box-shadow: 0px 1em #d11f2f;
  }
  &::after {
    content: "";
    position: absolute;
    height: 15%;
    width: 95%;
    bottom: 3%;
    right: 0;
    background: white;
    border-radius: 2em 0.25em 0.25em 2em;
    box-shadow: inset 0.25em 0.3em 0 0 #e4e0ce;
    background-image: linear-gradient(
      to bottom,
      transparent 6%,
      #e4e0ce 8%,
      transparent 8%,
      transparent 12%,
      #e4e0ce 12%,
      transparent 14%,
      transparent 18%,
      #e4e0ce 18%,
      transparent 20%,
      transparent 34%,
      #e4e0ce 34%,
      transparent 36%,
      transparent 40%,
      #e4e0ce 40%,
      transparent 42%,
      transparent 56%,
      #e4e0ce 56%,
      transparent 58%,
      transparent 72%,
      #e4e0ce 72%,
      transparent 74%,
      transparent 88%,
      #e4e0ce 88%,
      transparent 90%
    );
  }
`;

type Props = {
  width?: number;
  height?: number;
};

const BookImagePlaceholder = ({ width = 180, height = 280 }: Props) => (
  <BookImage
    data-testid="book-image-placeholder"
    width={width}
    height={height}
  ></BookImage>
);

export default BookImagePlaceholder;
