import React from "react";
import styled from "styled-components";
import { Note } from "../../../graphql/notes";
import { formatDate } from "../../../lib/formatDates";
import PrivacyIndicator from "../../Privacy";
import DeleteNote from "../DeleteNote";
import UpdateNote from "../UpdateNote";

export const NoteContainerStyle = styled.div`
  margin: 2rem 0;
`;

const NoteDateHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 1rem;
  color: #9c9c9c;
  margin: 0;

  @media (min-width: 1300px) {
    grid-template-columns: 1fr 1fr;
  }

  & span {
    & :nth-child(1n) {
      & :after {
        content: "|";
        margin: 0 1rem;
      }
    }
    & :last-of-type {
      & :after {
        content: "";
        margin: 0;
      }
    }
  }

  & button {
    padding: 0 1rem;
  }
`;

const NoteHeaderButtons = styled.div`
  justify-self: flex-start;

  @media (min-width: 1300px) {
    justify-self: flex-end;
  }
`;

const NoteTags = styled.div`
  display: flex;
  justify-content: flex-start;
`;

type Props = {
  note: Note;
};

const NoteContainer = ({ note }: Props) => {
  return (
    <NoteContainerStyle>
      <NoteDateHeader>
        <div>
          <span>{formatDate(note.createdAt)}</span>
          {note.page ? <span>Page {note.page}</span> : null}
        </div>
        <NoteHeaderButtons>
          <span>
            <UpdateNote note={note} />
          </span>
          <span>
            <DeleteNote noteId={note.id} />
          </span>
        </NoteHeaderButtons>
      </NoteDateHeader>
      <p>{note.note}</p>
      <NoteTags>
        <PrivacyIndicator privacyLevel={note.privacyLevel} />
      </NoteTags>
    </NoteContainerStyle>
  );
};

export default NoteContainer;
