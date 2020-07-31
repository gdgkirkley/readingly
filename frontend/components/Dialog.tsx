import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import Button from "./styles/ButtonStyles";

const DialogStyle = styled.div`
  position: fixed;
  z-index: 999;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow-y: hidden;
  background-color: rgba(0, 0, 0, 0.4);
  @media (max-width: 768px) {
    width: 100vw;
    height: 100vh;
  }
`;

const DialogContent = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 4px;
  width: 600px;
  max-width: 100%;
  overflow-y: auto;

  @media (max-width: 768px) {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    padding: 20px 30px;
  }
`;

const DialogInner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DialogClose = styled(Button)`
  position: absolute;
  top: 10px;
  right: 20px;
  padding: 5px 10px;
  font-size: 1rem;

  @media (max-width: 768px) {
    top: 20px;
    right: 30px;
  }
`;

const DialogHeader = styled.div`
  & h1 {
    margin: 0;
  }
  margin-bottom: 30px;
`;

const ESCAPE_KEY_CODE = 27;

type Props = {
  toggleModal(): void;
  accessibilityLabel: string;
  role: string;
  heading?: string;
  open: boolean;
};

const Dialog: React.FC<Props> = ({
  children,
  toggleModal,
  accessibilityLabel,
  role,
  heading,
  open,
}) => {
  const outer = useRef(null);

  useEffect(() => {
    const handleKeyUp = (event) => {
      if (event.keyCode === ESCAPE_KEY_CODE) {
        toggleModal();
      }
    };

    const handleOutsideClick = (e: MouseEvent) => {
      if (!open || outer?.current?.contains(e.target)) {
        return;
      }

      toggleModal();
    };

    window.addEventListener("keydown", handleKeyUp);
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      window.removeEventListener("keydown", handleKeyUp);
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [toggleModal]);

  if (!open) return null;

  return (
    <DialogStyle>
      <DialogContent ref={outer} aria-label={accessibilityLabel} role={role}>
        <DialogClose themeColor="purple" onClick={toggleModal}>
          X
        </DialogClose>
        {heading && (
          <DialogHeader>
            <h1>{heading}</h1>
          </DialogHeader>
        )}
        <DialogInner>{children}</DialogInner>
      </DialogContent>
    </DialogStyle>
  );
};

export function toggleScreenLock() {
  document.querySelector("html").classList.toggle("scroll-lock");
}

export default Dialog;
