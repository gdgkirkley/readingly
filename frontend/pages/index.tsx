import BookCategorySearch from "../components/BookCategorySearch";
import SearchBar, { SearchInputs } from "../components/SearchBar";

export default function Home(): JSX.Element {
  const handleSearch = (data: SearchInputs) => {
    console.log(data);
  };

  return (
    <>
      <SearchBar handleSearch={handleSearch} />
      <BookCategorySearch searchTerm="Historical Fiction" />
      <BookCategorySearch searchTerm="Science Fiction" />
      <BookCategorySearch searchTerm="Classics" />
      <BookCategorySearch searchTerm="C.S. Lewis" />
    </>
  );
}
