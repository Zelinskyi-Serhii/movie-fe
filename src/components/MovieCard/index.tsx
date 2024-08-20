import { FC, MouseEvent, useState } from "react";
import {
  IMovie,
  useToggleFavoriteStatusMutation,
} from "../../redux/features/movie";
import styles from "./styles.module.scss";
import { useNavigate } from "react-router-dom";

type Props = {
  movie: IMovie;
};

export const MovieCard: FC<Props> = ({ movie }) => {
  const [isFavorite, setIsFavorite] = useState(movie.isFavorite);
  const [toggleFavorite, { isLoading }] = useToggleFavoriteStatusMutation();
  const navigate = useNavigate();

  const handleToggleFavorite = async (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    try {
      await toggleFavorite({ id: movie._id }).unwrap();
      setIsFavorite((prev) => !prev);
    } catch (err) {
      console.error("Failed to toggle favorite status:", err);
    }
  };

  const handleCardClick = () => {
    navigate(`/movies/${movie._id}`);
  };

  return (
    <div className={styles.card} onClick={handleCardClick}>
      <img src={movie.image} alt={movie.title} className={styles.card__image} />

      <div className={styles.card__details}>
        <h3 className={styles.card__title}>{movie.title}</h3>
        <p className={styles.card__rating}>Rating: {movie.rating}</p>
        <p className={styles.card__releaseDate}>
          Release Date: {new Date(movie.releaseDate).toLocaleDateString()}
        </p>
        <button
          onClick={handleToggleFavorite}
          className={`${styles.card__favoriteButton} ${
            isFavorite ? styles.card__favorite : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : isFavorite ? "Unfavorite" : "Favorite"}
        </button>
      </div>
    </div>
  );
};
