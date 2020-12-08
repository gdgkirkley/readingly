import React, { useEffect } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import FormStyles, { ActionGroup } from "./styles/FormStyles";
import Button from "./styles/ButtonStyles";

const SearchFormStyles = styled(FormStyles)`
  max-width: 100%;
  box-shadow: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    margin-bottom: 4rem;
  }
`;

const SearchButton = styled(ActionGroup)`
  justify-content: center;
`;

const Bar = styled.div`
  width: 575px;
  margin: 0 auto;
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
  display: flex;
  padding: 0 1rem;

  & svg {
    width: 16px;
    position: relative;
  }

  & input {
    width: 500px;
    border: 0px solid #e2e8f0;
    box-shadow: none;
    font-size: 1.6rem;
  }
  &:hover {
    box-shadow: 1px 1px 8px 1px #dcdcdc;
  }
  &:focus-within {
    box-shadow: 1px 1px 8px 1px #dcdcdc;
    & input {
      outline: none;
      box-shadow: none;
    }
  }

  @media (max-width: 768px) {
    width: 335px;
    height: 5rem;

    & input {
      width: 275px;
    }
  }
`;

export type SearchInputs = {
  search: string;
};

type Props = {
  handleSearch(data: SearchInputs): void;
  defaultValue?: string;
};

const SearchBar = ({ handleSearch, defaultValue }: Props) => {
  const { register, handleSubmit, errors, reset } = useForm<SearchInputs>();

  useEffect(() => {
    if (!defaultValue) return;

    reset({
      search: defaultValue,
    });
  }, [defaultValue]);

  const onSubmit = (data: SearchInputs) => {
    handleSearch(data);
  };

  return (
    <SearchFormStyles onSubmit={handleSubmit(onSubmit)} role="form">
      <Bar>
        <SearchIcon />
        <input
          type="text"
          id="search"
          name="search"
          placeholder="Search for a book..."
          aria-label="Search books"
          ref={register}
          autoComplete="off"
        />
      </Bar>
      <SearchButton>
        <Button themeColor="black" type="submit">
          Search
        </Button>
      </SearchButton>
    </SearchFormStyles>
  );
};

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <path
      fill="currentColor"
      d="M508.5 468.9L387.1 347.5c-2.3-2.3-5.3-3.5-8.5-3.5h-13.2c31.5-36.5 50.6-84 50.6-136C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c52 0 99.5-19.1 136-50.6v13.2c0 3.2 1.3 6.2 3.5 8.5l121.4 121.4c4.7 4.7 12.3 4.7 17 0l22.6-22.6c4.7-4.7 4.7-12.3 0-17zM208 368c-88.4 0-160-71.6-160-160S119.6 48 208 48s160 71.6 160 160-71.6 160-160 160z"
    ></path>
  </svg>
);

export default SearchBar;
