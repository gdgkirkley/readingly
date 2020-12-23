import React from "react";
import { Note } from "../../../graphql/notes";
import NoteContainer from "../Note";

type Props = {
  notes: Note[];
};

const NoteList = ({ notes }: Props) => {
  return (
    <div>
      {notes?.length
        ? notes.map((note) => <NoteContainer key={note.id} note={note} />)
        : null}
    </div>
  );
};

export default NoteList;
