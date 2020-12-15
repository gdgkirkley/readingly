import Head from "next/head";
import React from "react";
import CurrentlyReading from "../components/CurrentlyReading";
import { useUser } from "../hooks/useUser";

const ReadingPage = () => {
  const me = useUser();

  if (!me) {
    return null;
  }

  return (
    <div>
      <Head>
        <title>Currently Reading | Readingly</title>
      </Head>
      <CurrentlyReading />
    </div>
  );
};

export default ReadingPage;
