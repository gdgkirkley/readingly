import React from "react";
import { useQuery } from "@apollo/client";
import { Note, NOTES_QUERY } from "../../../graphql/notes";
import NoteContainer from "../Note";

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
    <div>
      {data?.notes?.length
        ? data.notes.map((note) => <NoteContainer key={note.id} note={note} />)
        : null}
    </div>
  );
};

export default NoteList;
