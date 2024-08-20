import { createBrowserRouter, Navigate } from "react-router-dom";
import { FavoritesMoviesPage } from "./pages/FavoritesMovie";
import { MovieDetailsPage } from "./pages/MovieDetails";
import { MovieListPage } from "./pages/MovieList";
import { CreateOrUpdateMoviePage } from "./pages/CreateOrUpdateMovie";
import { Layout } from "./Layout";


const routes = [
  {
    path: "/",
    element: <Navigate to="/movies" replace />,
  },
  {
    path: "/movies",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <MovieListPage />,
      },
      {
        path: ":movieId",
        element: <MovieDetailsPage />,
      },
      {
        path: "new",
        element: <CreateOrUpdateMoviePage />,
      },
      {
        path: "favorites",
        element: <FavoritesMoviesPage />,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
