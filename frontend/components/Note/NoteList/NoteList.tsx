import React from "react";
import styled from "styled-components";
import { useQuery } from "@apollo/client";
import { Note, NOTES_QUERY } from "../../../graphql/notes";
import NoteContainer from "../Note";
import { NoteContainerStyle } from "../Note/Note";

const List = styled.div`
  & ${NoteContainerStyle} {
    &:nth-of-type(1n) {
      border-bottom: 1px dashed #ececec;
    }
    &:last-of-type {
      border-bottom: none;
    }
  }
`;

type Props = {
  notes?: Note[];
  googleBooksId?: string;
};

interface NoteData {
  notes: Note[];
}

const NoteList = ({ notes, googleBooksId }: Props) => {
  const { data, loading, error } = useQuery<NoteData>(NOTES_QUERY, {
    variables: { googleBooksId: googleBooksId },
  });

  return (
    <List>
      {data?.notes?.length
        ? data.notes.map((note) => <NoteContainer key={note.id} note={note} />)
        : null}
    </List>
  );
};

export default NoteList;
