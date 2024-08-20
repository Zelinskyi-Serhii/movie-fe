import { useEffect } from "react";
import { Loader } from "../../components/Loader";
import { MovieCard } from "../../components/MovieCard";
import { useLazyGetFavoritesMovieQuery } from "../../redux/features/movie";
import styles from "./styles.module.scss";

export const FavoritesMoviesPage = () => {
  const [getFavorites, { data, error, isLoading }] =
    useLazyGetFavoritesMovieQuery();

  useEffect(() => {
    getFavorites({});
  }, []);

  if (error) {
    return (
      <div className={styles.favorite__error}>Error loading favorites</div>
    );
  }

  return (
    <section className={styles.favorite}>
      <h1 className={styles.favorite__title}>Favorite Movies</h1>
      {!isLoading && (!data || data.length === 0) && (
        <div className={styles.favorite__noFavorites}>No favorites yet</div>
      )}

      <div className={styles.favorite__movieList}>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {data?.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </>
        )}
      </div>
    </section>
  );
};
