import { useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./styles.module.scss";
import {
  useDeleteMovieMutation,
  useLazyGetMovieByIdQuery,
} from "../../redux/features/movie";
import { Loader } from "../../components/Loader";

export const MovieDetailsPage = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [getMovie, { data, isLoading }] = useLazyGetMovieByIdQuery();
  const [deleteMovie, { isSuccess, isError }] = useDeleteMovieMutation();

  const handleDeleteMovie = () => {
    if (data?._id) {
      deleteMovie(data?._id);
    }
  };

  useEffect(() => {
    if (movieId) {
      getMovie(movieId);
    }
  }, [getMovie, movieId]);

  useEffect(() => {
    if (isError) {
      toast.error("Unable to delete movie. Please try again letter.");
    }

    if (isSuccess) {
      toast.success("Movie deleted successfully");
      navigate("/movies");
    }
  }, [isError, isSuccess]);


  return (
    <section className={styles.movieDetails}>
      {isLoading ? <Loader /> : (
        <>
          <div className={styles.movieDetails__actions}>
            <button onClick={() => navigate(`/movies/new?movieId=${movieId}`)}>
              Update
            </button>
            <button onClick={handleDeleteMovie}>Delete</button>
          </div>
          {data ? (
            <>
              <div className={styles.header}>
                <img src={data.image} alt={data.title} className={styles.poster} />
                <div className={styles.details}>
                  <h1 className={styles.title}>{data.title}</h1>
                  <p className={styles.rating}>Rating: {data.rating}</p>
                  <p className={styles.releaseDate}>
                    Release Date: {new Date(data.releaseDate).toLocaleDateString()}
                  </p>
                  <p className={styles.genre}>Genre: {data.genre}</p>
                  <p className={styles.director}>Directed by: {data.director}</p>
                </div>
              </div>

              <div className={styles.description}>
                <h2>Description</h2>
                <p>{data.description}</p>
              </div>

              <div className={styles.actors}>
                <h2>Actors</h2>
                <ul>
                  {data.actors.map((actor) => (
                    <li key={actor}>{actor}</li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className={styles.noData}>Movie details not available</div>
          )}
        </>
      )}
    </section>
  );
};
