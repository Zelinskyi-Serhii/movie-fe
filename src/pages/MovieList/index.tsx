import { ChangeEvent, useEffect, useState } from "react";
import { useLazyGetMoviesQuery } from "../../redux/features/movie";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./styles.module.scss";
import { MovieCard } from "../../components/MovieCard";
import { useDebounce } from "../../hooks/useDebaunce";
import { Loader } from "../../components/Loader";

export const MovieListPage = () => {
  const navigate = useNavigate();
  const [getMovies, { data, isLoading }] = useLazyGetMoviesQuery();
  const [searchParams, setSearchParams] = useSearchParams();

  const title = searchParams.get("title") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPage = parseInt(searchParams.get("perPage") || "10", 10);

  const [itemsPerPage, setItemsPerPage] = useState(perPage);
  const [searchTitle, setSearchTitle] = useState(title);

  const debouncedTitle = useDebounce(searchTitle);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTitle(e.target.value);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (data?.pages || 1)) {
      setSearchParams({
        title: debouncedTitle,
        page: newPage.toString(),
        perPage: itemsPerPage.toString(),
      });
    }
  };

  const handleItemsPerPageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newPerPage = parseInt(e.target.value, 10);
    setItemsPerPage(newPerPage);
    setSearchParams({
      title: debouncedTitle,
      page: "1",
      perPage: newPerPage.toString(),
    });
  };

  useEffect(() => {
    setSearchParams({
      title: debouncedTitle,
      page: "1",
      perPage: itemsPerPage.toString(),
    });
  }, [debouncedTitle, itemsPerPage]);

  useEffect(() => {
    getMovies({
      search: debouncedTitle,
      page,
      limit: itemsPerPage,
    });
  }, [getMovies, debouncedTitle, page, itemsPerPage]);

  return (
    <section className={styles.movieList}>
      <div className={styles.movieList__top}>
        <label className={styles.searchLabel}>
          Search by title
          <input
            type="text"
            value={searchTitle}
            onChange={handleSearchChange}
            className={styles.searchInput}
            placeholder="Enter movie title"
          />
        </label>

        <label className={styles.itemsPerPageLabel}>
          Items per page
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className={styles.itemsPerPageSelect}
          >
            <option value={2}>2</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
        </label>

        <button
          className={styles.addNewBtn}
          onClick={() => navigate("/movies/new")}
        >
          Add New
        </button>
      </div>

      <h3>{`Total movies: ${data?.total || 0}`}</h3>

      {!data?.movies.length && !isLoading && <h2>Movies list is empty!</h2>}

      {isLoading ? (
        <Loader />
      ) : (
        <>
          <ul className={styles.movieGrid}>
            {data?.movies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </ul>

          <div className={styles.pagination}>
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page < 2}
            >
              Previous
            </button>
            <span>
              Page {page} of {data?.pages || 1}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= (data?.pages || 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
};
