import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import styled from "styled-components";
import { toast } from "react-toastify";
import { useQuery, useMutation } from "@apollo/client";
import { Book, GOOGLE_BOOK_QUERY } from "../graphql/books";
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
  &:disabled {
    background: #fff;
    color: ${(props) => props.theme.black};
  }
`;

const DropButton = styled(Button)`
  & svg {
    transition: 0.2s;
  }
  &.open {
    & svg {
      transform: rotate(-180deg);
    }
  }
`;

const CreateLinkContainer = styled.div`
  margin: 2rem 0 3rem;
`;

type Props = {
  book: Book;
};

const AddToBookshelf = ({ book }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>(null);
  const [cursor, setCursor] = useState<number>(0);

  const outer = useRef(null);

  const me = useUser();
  const { data, error, loading } = useQuery<BookShelfData>(
    MY_BOOKSHELVES_QUERY
  );

  const [
    addBook,
    { data: dataAdd, error: errorAdd, loading: loadingAdd },
  ] = useMutation(ADD_BOOK_MUTATION);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (outer?.current?.contains(e.target)) {
        return;
      }

      setOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleClick = async (): Promise<void> => {
    const shelf = data.mybookshelves.find((shelf) => shelf.title === selected);
    await addBook({
      variables: {
        googleBookId: book.googleBooksId,
        bookshelfId: shelf.id,
      },
      refetchQueries: [
        {
          query: GOOGLE_BOOK_QUERY,
          variables: { googleBooksId: book.googleBooksId },
        },
        { query: MY_BOOKSHELVES_QUERY },
        {
          query: MY_BOOKSHELF_QUERY,
          variables: { title: shelf.title },
        },
      ],
      awaitRefetchQueries: true,
    });

    toast.success(`${book.title} added to ${shelf.title}!`);
    setSelected(null);

    if (open) {
      toggle();
    }
  };

  const getElementWidth = (): number => {
    if (outer?.current) {
      return outer.current.clientWidth;
    }
  };

  const toggle = () => {
    setOpen(!open);
  };

  const select = (
    event: React.MouseEvent | React.KeyboardEvent,
    index: number
  ): void => {
    if (!event.currentTarget) return;

    if (isSelected(event.currentTarget.id)) {
      resetDefaults();
      return;
    }

    setSelected(event.currentTarget.id);
    setCursor(index);
    toggle();
  };

  const isSelected = (targetId: string): boolean => {
    if (!targetId) return;
    return targetId === selected;
  };

  const resetDefaults = (): void => {
    setSelected(null);
    setCursor(0);
    toggle();
  };

  const handleKeyDown = (event: React.KeyboardEvent, index: number): void => {
    const keyCode = event.keyCode;
    if (keyCode === 13) {
      select(event, index);
    } else if (keyCode === 27) {
      setOpen(!open);
    } else if (keyCode === 40 || keyCode === 38) {
      highlightNext(keyCode);
    }
  };

  const highlightNext = (keyCode: number) => {
    const maxIndex = data.mybookshelves.length - 1;
    if (maxIndex === 0 || maxIndex === null || maxIndex === undefined) {
      return null;
    }

    let prevIndex = cursor;
    let nextIndex = 0;

    if (!selected) {
      prevIndex = -1;
    }

    if (keyCode === 40) {
      if (prevIndex < maxIndex) {
        nextIndex = prevIndex + 1;
      } else {
        nextIndex = prevIndex;
      }
    }
    if (keyCode === 38) {
      if (prevIndex > 0) {
        nextIndex = prevIndex - 1;
      } else {
        nextIndex = prevIndex;
      }
    }
    setCursor(nextIndex);
    setSelected(data.mybookshelves[nextIndex].title);
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
    <ButtonGroupRoot ref={outer}>
      <ButtonGroup>
        <AddToBookshelfButton
          themeColor="black"
          onClick={handleClick}
          disabled={!selected}
        >
          {selected
            ? `Add to ${
                selected.length > 18 ? `${selected.substr(0, 15)}...` : selected
              }`
            : "Choose a bookshelf:"}
        </AddToBookshelfButton>
        <DropButton
          themeColor="black"
          onClick={toggle}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={open ? "open" : ""}
        >
          <CaretDown />
          <span className="hidden-text">Open Bookshelf List</span>
        </DropButton>
      </ButtonGroup>
      {open ? (
        <ButtonGroupDropdownContainer width={getElementWidth()}>
          <ButtonGroupDropdown>
            <ul role="listbox" tabIndex={-1} aria-activedescendant={selected}>
              {data.mybookshelves.map((shelf, index) => (
                <li
                  key={shelf.id}
                  id={shelf.title}
                  onClick={(e) => select(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  role="option"
                  aria-selected={shelf.title === selected && cursor === index}
                  tabIndex={0}
                >
                  {shelf.title}
                </li>
              ))}
            </ul>
          </ButtonGroupDropdown>
        </ButtonGroupDropdownContainer>
      ) : null}
    </ButtonGroupRoot>
  );
};

export default AddToBookshelf;
