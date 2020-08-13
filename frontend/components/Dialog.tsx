import React, { useRef, useEffect } from "react";
import ReactDOM from "react-dom";
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

// Reusable style for inner dialog content
export const InnerDialogContent = styled.div`
  display: grid;
  justify-content: center;
  align-items: center;
  margin-top: 3rem;
  font-size: 1.7rem;
  text-align: center;

  & .container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const ESCAPE_KEY_CODE = "Escape";
const TAB_KEY_CODE = "Tab";
const FOCUSABLE_QUERY =
  'a[href], button, textarea, input, select, details, [tabindex]:not([tabindex="-1"])';

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
  const modalRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!open) return;

      if (event.code === ESCAPE_KEY_CODE) {
        toggleModal();
      } else if (event.code === TAB_KEY_CODE) {
        // trap focus
        // get all focusable elements
        const focusableModalElements = modalRef.current.querySelectorAll(
          FOCUSABLE_QUERY
        ) as HTMLElement[];

        const isFocusedWithin = [...focusableModalElements].some(
          (el) => el === document.activeElement
        );

        const firstElement = focusableModalElements[0];

        const lastElement =
          focusableModalElements[focusableModalElements.length - 1];

        if (!isFocusedWithin) {
          firstElement.focus();
        }

        if (event.shiftKey && document.activeElement === firstElement) {
          lastElement.focus();
          event.preventDefault();
        }

        if (!event.shiftKey && document.activeElement === lastElement) {
          firstElement.focus();
          event.preventDefault();
        }
      }
    };

    const handleOutsideClick = (e: MouseEvent) => {
      if (!open || modalRef?.current?.contains(e.target)) {
        return;
      }

      toggleModal();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [toggleModal]);

  if (!open) return null;

  let modalRoot = document.querySelector("#modal-root");

  if (!modalRoot) {
    modalRoot = document.createElement("div");
    modalRoot.setAttribute("id", "modal-root");
    document.body.appendChild(modalRoot);
  }

  return ReactDOM.createPortal(
    <DialogStyle>
      <DialogContent
        ref={modalRef}
        aria-label={accessibilityLabel}
        role={role}
        aria-modal={true}
      >
        <DialogClose themeColor="purple" onClick={toggleModal}>
          X<span className="hidden-text">Close Dialog</span>
        </DialogClose>
        {heading && (
          <DialogHeader>
            <h1>{heading}</h1>
          </DialogHeader>
        )}
        <DialogInner>{children}</DialogInner>
      </DialogContent>
    </DialogStyle>,
    modalRoot
  );
};

export function toggleScreenLock() {
  document.querySelector("html").classList.toggle("scroll-lock");
}

export default Dialog;
