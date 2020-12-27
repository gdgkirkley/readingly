import React from "react";
import styled from "styled-components";
import { Note } from "../../../graphql/notes";
import { formatDate } from "../../../lib/formatDates";
import DeleteNote from "../DeleteNote";
import UpdateNote from "../UpdateNote";

const NoteContainerStyle = styled.div`
  margin: 2rem 0;
`;

const NoteDateHeader = styled.div`
  color: #9c9c9c;
  margin: 0;

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
    padding: 0;
  }
`;

type Props = {
  note: Note;
};

const NoteContainer = ({ note }: Props) => {
  return (
    <NoteContainerStyle>
      <NoteDateHeader>
        <span>{formatDate(note.createdAt)}</span>
        {note.page ? <span>Page {note.page}</span> : null}
        <span>
          <UpdateNote note={note} />
        </span>
        <span>
          <DeleteNote noteId={note.id} />
        </span>
      </NoteDateHeader>
      <p>{note.note}</p>
    </NoteContainerStyle>
  );
};

export default NoteContainer;
