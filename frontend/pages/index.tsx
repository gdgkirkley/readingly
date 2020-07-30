import { useRouter } from "next/router";
import BookCategorySearch from "../components/BookCategorySearch";
import SearchBar, { SearchInputs } from "../components/SearchBar";

export default function Home(): JSX.Element {
  const router = useRouter();
  const handleSearch = (data: SearchInputs) => {
    const search = new URLSearchParams(`q=${data.search}`);
    router.push(`/search?${search}`);
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
