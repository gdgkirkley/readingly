import Head from "next/head";

import BookGallery from "../components/BookGallery";

export default function Home(): JSX.Element {
  return (
    <>
      <BookGallery searchTerm="Historical Fiction" />
      <BookGallery searchTerm="Art History" />
      <BookGallery searchTerm="Classics" />
      <BookGallery searchTerm="Cracking" />
    </>
  );
}
