import styled from "styled-components";

const StyledForm = styled.form`
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  padding: 2rem;
  margin-bottom: 1rem;
  border-radius: 0.25rem;
  max-width: 40rem;

  & label {
    font-size: 1.7rem;
    color: ${(props) => props.theme.black};
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  & input,
  textarea {
    width: 100%;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    padding: 1rem 1.75rem;
    line-height: 1.25;
    border: 1px solid #e2e8f0;
    border-radius: 0.25rem;
    appearance: none;
    font-family: "Inter", Arial, Helvetica, sans-serif;
    font-size: 1.6rem;
    margin: 0;

    &:focus {
      box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
      outline: 0;
    }
  }

  & .last {
    margin-bottom: 2rem;
  }

  & .error-message {
    color: ${(props) => props.theme.red};
    &::before {
      content: "⚠";
      margin-right: 0.5rem;
    }
  }
`;

export const InputGroup = styled.div`
  margin-bottom: 2rem;
`;

type ActionGroupProps = {
  justifyContent?: string;
};

export const ActionGroup = styled.div<ActionGroupProps>`
  display: flex;
  align-items: "center";
  justify-content: ${(props) =>
    props.justifyContent ? props.justifyContent : "space-between"};
  margin-top: 1rem;
`;

export const ModalForm = styled(StyledForm)`
  box-shadow: none;
  width: 100%;
  margin: 0;
  padding: 0;
`;

export const TextArea = styled.textarea`
  min-height: 10rem;
  font-size: 1.6rem;
  resize: vertical;
`;

export default StyledForm;
