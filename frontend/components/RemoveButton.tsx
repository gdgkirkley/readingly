import React, { useState } from "react";
import styled from "styled-components";
import Button from "./styles/ButtonStyles";
import Dialog, { InnerDialogContent } from "./Dialog";

export const RemoveCornerButton = styled(Button)`
  position: absolute;
  top: -1rem;
  right: -1rem;
  border-radius: 1000px;
  font-size: 1rem;
  line-height: 1;
  padding: 0.8rem 1rem;

  @media (max-width: 768px) {
    right: 0.5rem;
    padding: 1.3rem 1.5rem;
  }
`;

type Props = {
  onConfirm(): void;
  itemToRemove: string;
  collectionRemovedFrom?: string;
};

const RemoveButton = ({
  onConfirm,
  itemToRemove,
  collectionRemovedFrom,
}: Props) => {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen(!open);

  const handleConfirm = async (e: React.MouseEvent): Promise<void> => {
    e.stopPropagation();

    onConfirm();
  };

  return (
    <>
      <RemoveCornerButton themeColor="red" onClick={toggle}>
        x<span className="hidden-text">Remove from bookshelf</span>
      </RemoveCornerButton>

      <Dialog
        open={open}
        role="dialog"
        accessibilityLabel="deletion confirmation"
        toggleModal={toggle}
      >
        <InnerDialogContent>
          <h1>Confirm Removal</h1>
          <p>
            Are you sure you want to remove <strong>{itemToRemove}</strong>
            {collectionRemovedFrom ? (
              <>
                from <strong>{collectionRemovedFrom}</strong>
              </>
            ) : null}
            ?
          </p>
          <div className="container">
            <Button themeColor="red" onClick={handleConfirm}>
              Confirm Remove
            </Button>
          </div>
        </InnerDialogContent>
      </Dialog>
    </>
  );
};

export default RemoveButton;
