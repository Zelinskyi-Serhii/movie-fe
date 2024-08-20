import { NavLink } from "react-router-dom";
import styles from "./styles.module.scss";

export const Header = () => {
  return (
    <header className={styles.header}>
      <NavLink
        to="/movies"
        className={({ isActive }) => (isActive ? styles.active : "")}
        end
      >
        Movies
      </NavLink>

      <NavLink
        to="/movies/favorites"
        className={({ isActive }) => (isActive ? styles.active : "")}
      >
        Favorites
      </NavLink>
    </header>
  );
};
