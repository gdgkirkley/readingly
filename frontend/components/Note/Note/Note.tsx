import React from "react";
import styled from "styled-components";
import { Note } from "../../../graphql/notes";
import { formatDate } from "../../../lib/formatDates";

const NoteContainerStyle = styled.div`
  margin: 2rem 0;
`;

const NoteDateHeader = styled.p`
  color: #9c9c9c;
  margin: 0;
`;

type Props = {
  note: Note;
};

const NoteContainer = ({ note }: Props) => {
  return (
    <NoteContainerStyle>
      <NoteDateHeader>
        {formatDate(note.createdAt)}{" "}
        {note.page ? <>| Page {note.page}</> : null}
      </NoteDateHeader>
      <p>{note.note}</p>
    </NoteContainerStyle>
  );
};

export default NoteContainer;
