import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import styled from "styled-components";
import { toast } from "react-toastify";
import { useQuery, useMutation } from "@apollo/client";
import { Book } from "../graphql/books";
import {
  MY_BOOKSHELVES_QUERY,
  MY_BOOKSHELF_QUERY,
  ADD_BOOK_MUTATION,
  BookShelfData,
} from "../graphql/bookshelves";
import { useUser } from "../hooks/useUser";
import Button, {
  ButtonGroup,
  ButtonGroupRoot,
  ButtonGroupDropdownContainer,
  ButtonGroupDropdown,
} from "./styles/ButtonStyles";
import CaretDown from "./icons/CaretDown";

const AddToBookshelfButton = styled(Button)`
  /* margin: 2rem 0 3rem; */
`;

const CreateLinkContainer = styled.div`
  margin: 2rem 0 3rem;
`;

type Props = {
  book: Book;
};

const AddToBookshelf = ({ book }: Props) => {
  const [width, setWidth] = useState(0);
  const dropdownContainer = useRef(null);
  const me = useUser();
  const { data, error, loading } = useQuery<BookShelfData>(
    MY_BOOKSHELVES_QUERY
  );

  const [
    addBook,
    { data: dataAdd, error: errorAdd, loading: loadingAdd },
  ] = useMutation(ADD_BOOK_MUTATION);

  useEffect(() => {
    if (!dropdownContainer.current) return;
    setWidth(dropdownContainer.current.offsetWidth);
  }, [dropdownContainer.current]);

  const handleClick = (): void => {
    addBook({
      variables: {
        googleBookId: book.googleBooksId,
        bookshelfId: data.mybookshelves[0].id,
      },
      refetchQueries: [
        { query: MY_BOOKSHELVES_QUERY },
        {
          query: MY_BOOKSHELF_QUERY,
          variables: { title: data.mybookshelves[0].title },
        },
      ],
      awaitRefetchQueries: true,
    });

    toast.success(`${book.title} added to ${data.mybookshelves[0].title}!`);
  };

  if (!me) return null;

  if (loading) return <p>Loading bookshelves...</p>;
  if (error) {
    toast.error("There was an error loading bookshelves. Please refresh.");
  }

  if (!data.mybookshelves?.length) {
    return (
      <CreateLinkContainer>
        <Link href="/mybookshelves" passHref>
          <Button themeColor="yellow" as="a">
            Create a bookshelf
          </Button>
        </Link>
      </CreateLinkContainer>
    );
  }

  return (
    <ButtonGroupRoot>
      <ButtonGroup ref={dropdownContainer}>
        <AddToBookshelfButton themeColor="yellow" onClick={handleClick}>
          Add to bookshelf
        </AddToBookshelfButton>
        <Button themeColor="yellow">
          <CaretDown />
        </Button>
      </ButtonGroup>
      <ButtonGroupDropdownContainer groupWidth={width}>
        <ButtonGroupDropdown>
          <ul>
            <li>Testing a bigger 1</li>
            <li>Test 2</li>
          </ul>
        </ButtonGroupDropdown>
      </ButtonGroupDropdownContainer>
    </ButtonGroupRoot>
  );
};

export default AddToBookshelf;
